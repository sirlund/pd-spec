/**
 * Claude API integration — session management + SSE agent endpoint.
 * Uses Claude Agent SDK for tool execution and context management.
 * BYOK: user provides their own API key, stored in-memory only.
 */

// Allow SDK subprocess to spawn when running inside a Claude Code session
delete process.env.CLAUDECODE;

import { Router } from 'express';
import { randomUUID } from 'crypto';
import { readFile, readdir, mkdir, copyFile, stat } from 'fs/promises';
import { resolve, join, dirname } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { query } from '@anthropic-ai/claude-agent-sdk';
import { InteractionBridge, createCanUseTool } from './sdk-guards.js';

export function createClaudeRoutes(projectRoot, broadcast) {
  const router = Router();

  // In-memory session store: token → { apiKey, createdAt, client, sdkSessionId }
  const sessions = new Map();
  // Active runs: token → { bridge, abortController, query, eventLog, sseConnected }
  const activeRuns = new Map();
  // Completed runs (for recovery after disconnect): token → { log, completedAt }
  const completedRuns = new Map();

  const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

  function getSession(token) {
    if (!token) return null;
    const session = sessions.get(token);
    if (!session) return null;
    if (Date.now() - session.createdAt > SESSION_TTL) {
      sessions.delete(token);
      return null;
    }
    return session;
  }

  function requireSession(req, res, next) {
    const token = req.headers['x-session-token'];
    const session = getSession(token);
    if (!session) return res.status(401).json({ error: 'Invalid or expired session' });
    req.session = session;
    req.sessionToken = token;
    next();
  }

  // --- Session routes (unchanged) ---

  router.get('/env-available', (req, res) => {
    res.json({ available: !!process.env.ANTHROPIC_API_KEY });
  });

  router.post('/session', async (req, res) => {
    const { apiKey: bodyKey, fromEnv } = req.body || {};
    const apiKey = fromEnv ? process.env.ANTHROPIC_API_KEY : bodyKey;
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({
        error: fromEnv
          ? 'ANTHROPIC_API_KEY not set in server environment'
          : 'Invalid API key format',
      });
    }

    try {
      const client = new Anthropic({ apiKey });
      await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      });

      const sessionToken = randomUUID();
      sessions.set(sessionToken, { apiKey, createdAt: Date.now(), client, sdkSessionId: null });

      setTimeout(() => {
        sessions.delete(sessionToken);
      }, SESSION_TTL);

      res.json({ sessionToken, valid: true });
    } catch (err) {
      if (err.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      const friendlyMessage = err.error?.error?.message || err.message;
      const status = err.status || 500;
      res.status(status).json({ error: friendlyMessage });
    }
  });

  router.get('/session', (req, res) => {
    const token = req.headers['x-session-token'];
    const session = getSession(token);
    res.json({ valid: !!session });
  });

  router.delete('/session', (req, res) => {
    const token = req.headers['x-session-token'];
    if (token) {
      sessions.delete(token);
      const run = activeRuns.get(token);
      if (run) {
        run.bridge.cancelAll();
        run.abortController.abort();
        activeRuns.delete(token);
      }
    }
    res.json({ ok: true });
  });

  // --- Build system prompt ---

  async function buildSystemPrompt(mode, skillName, projectRoot) {
    let projectMd = '';
    try {
      projectMd = await readFile(resolve(projectRoot, 'PROJECT.md'), 'utf-8');
    } catch { /* ok */ }

    if (mode === 'skill') {
      const skillPath = resolve(projectRoot, `.claude/skills/${skillName}/SKILL.md`);
      const skillContent = await readFile(skillPath, 'utf-8');

      const preamble = `You are running inside the PD-Spec web application.
You have native filesystem tools: Read, Write, Edit, Bash, Glob, Grep.
NOTE: The Read tool has a 2000-line default limit and truncates lines longer than 2000
characters. For source files, discover-sources.sh creates normalized versions of files with
oversized lines in 02_Work/_temp/ — check the NORMALIZED section of its output and use those
paths when reading. For files over 1800 lines, use Read with offset/limit in chunks of 1500.
IMPORTANT: When a skill requires user confirmation or selection (gates, approvals,
choices), you MUST use the AskUserQuestion tool. Do NOT write questions as plain text
— the user cannot respond to text. Only AskUserQuestion renders an interactive panel.

For utility scripts, run them via Bash: ./scripts/script-name.sh [args]
IMPORTANT: ALWAYS start /extract by running via Bash: ./scripts/discover-sources.sh "01_Sources" "02_Work/SOURCE_MAP.md"

Skip writing to 02_Work/MEMORY.md and 02_Work/_temp/SESSION_CHECKPOINT.md.
The project root is the working directory for all file paths.

INDEX FILES: When reading large Work layer files (EXTRACTIONS.md, INSIGHTS_GRAPH.md),
check 02_Work/_index/ first for index files (e.g. extractions-index.md). If an index
exists, read it first to get the table of contents, then use Read with offset/limit
to access specific sections. This saves tokens on large files.

PROJECT.md contents:
${projectMd}
`;
      return preamble + '\n---\n\n' + skillContent;
    }

    // Q&A mode — read work layer for context
    let context = '';
    const contextFiles = [
      '02_Work/INSIGHTS_GRAPH.md',
      '02_Work/CONFLICTS.md',
      '02_Work/STRATEGIC_VISION.md',
      '02_Work/PROPOSALS.md',
    ];
    for (const f of contextFiles) {
      try {
        const content = await readFile(resolve(projectRoot, f), 'utf-8');
        if (content.length < 50000) {
          context += `\n--- ${f} ---\n${content}\n`;
        } else {
          context += `\n--- ${f} (truncated to 50K chars) ---\n${content.slice(0, 50000)}\n`;
        }
      } catch { /* ok */ }
    }

    return `You are a research assistant for a PD-Spec project. Answer questions about the project based on the Work layer data below. Reference insight IDs as [IG-XX] and conflict IDs as [CF-XX] when relevant.\n\n${context}`;
  }

  // --- SSE helpers ---

  function setupSSE(res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    return (data) => {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    };
  }

  function summarizeInput(input) {
    const result = {};
    for (const [key, value] of Object.entries(input || {})) {
      if (typeof value === 'string' && value.length > 200) {
        result[key] = value.slice(0, 200) + '...';
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  // --- Main run endpoint ---

  router.post('/run', requireSession, async (req, res) => {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const token = req.sessionToken;
    const session = req.session;

    // Mode detection
    const skillMatch = message.match(/^\/(extract|analyze|spec)\b(.*)/);
    const mode = skillMatch ? 'skill' : 'qa';
    const skillName = skillMatch ? skillMatch[1] : null;
    const skillArgs = skillMatch ? skillMatch[2].trim() : '';

    // Build system prompt (throws on missing skill)
    let systemPrompt;
    try {
      systemPrompt = await buildSystemPrompt(mode, skillName, projectRoot);
    } catch (err) {
      return res.status(404).json({ error: `Skill not found: ${skillName}` });
    }

    // Backup before pipeline
    if (mode === 'skill') {
      try {
        await backupWorkLayer(projectRoot);
      } catch { /* non-fatal */ }
    }

    // SSE setup with event buffering (BL-108)
    const eventLog = [];
    const rawSendSSE = setupSSE(res);
    const sendSSE = (data) => {
      eventLog.push(data);
      rawSendSSE(data);
    };
    const bridge = new InteractionBridge();
    const abortController = new AbortController();

    // Store active run
    activeRuns.set(token, { bridge, abortController, query: null, eventLog, sseConnected: true });

    req.on('close', () => {
      const run = activeRuns.get(token);
      if (run) {
        run.sseConnected = false;
        // DON'T abort — let the query finish. Events buffer in eventLog.
      }
    });

    try {
      // Permission architecture:
      // - Do NOT set permissionMode — default behavior auto-approves safe tools
      //   (Read, Glob, Grep, safe Bash) and routes dangerous ops through canUseTool.
      // - canUseTool handles: Write/Edit path validation, Bash safety, interaction
      //   bridging for AskUserQuestion, and mode-based denials.
      // - disallowedTools blocks tools at the CLI level that would be auto-approved
      //   but shouldn't be available (Agent, Skill, etc.).
      const queryOptions = {
        model: mode === 'qa'
          ? 'claude-haiku-4-5-20251001'
          : 'claude-sonnet-4-20250514',
        cwd: projectRoot,
        systemPrompt,
        maxTurns: 200,
        canUseTool: createCanUseTool(projectRoot, bridge, sendSSE, mode),
        disallowedTools: mode === 'qa'
          ? ['Write', 'Edit', 'Agent', 'Skill', 'EnterPlanMode', 'EnterWorktree', 'NotebookEdit', 'TaskCreate', 'TaskUpdate', 'AskUserQuestion']
          : ['Agent', 'Skill', 'EnterPlanMode', 'EnterWorktree', 'NotebookEdit', 'TaskCreate', 'TaskUpdate'],
        env: { ...process.env, ANTHROPIC_API_KEY: session.apiKey },
        abortController,
        persistSession: mode === 'qa',
        settingSources: [],
      };

      // Resume Q&A sessions
      if (mode === 'qa' && session.sdkSessionId) {
        queryOptions.resume = session.sdkSessionId;
      }

      // For skills, replace "/extract" with a descriptive prompt so the SDK
      // doesn't intercept it as its own slash command. The system prompt
      // already contains the full SKILL.md instructions.
      const sdkPrompt = mode === 'skill'
        ? `Execute the ${skillName} skill now.${skillArgs ? ` Arguments: ${skillArgs}` : ''} Follow the instructions in your system prompt.`
        : message;

      const q = query({ prompt: sdkPrompt, options: queryOptions });
      const run = activeRuns.get(token);
      if (run) run.query = q;

      // Track tool_use blocks to emit tool_done when we see results
      const pendingTools = new Map(); // id → { name, startTime }

      for await (const msg of q) {
        if (abortController.signal.aborted) break;

        // System init — capture session ID
        if (msg.type === 'system' && msg.subtype === 'init') {
          if (mode === 'qa') {
            session.sdkSessionId = msg.session_id;
          }
          continue;
        }

        // Assistant message — text, tool_use blocks (skip thinking)
        if (msg.type === 'assistant' && msg.message?.content) {
          for (const block of msg.message.content) {
            if (block.type === 'thinking') continue;
            if (block.type === 'text') {
              sendSSE({ type: 'text', content: block.text });
            } else if (block.type === 'tool_use') {
              // Skip AskUserQuestion — handled in canUseTool
              if (block.name === 'AskUserQuestion') continue;

              sendSSE({
                type: 'tool_start',
                tool: block.name,
                input: summarizeInput(block.input),
              });
              pendingTools.set(block.id, { name: block.name, startTime: Date.now() });
            }
          }
          continue;
        }

        // User message (tool results) — match tool_done events
        if (msg.type === 'user' && msg.message?.content && Array.isArray(msg.message.content)) {
          for (const block of msg.message.content) {
            if (block.type === 'tool_result' && pendingTools.has(block.tool_use_id)) {
              const tool = pendingTools.get(block.tool_use_id);
              pendingTools.delete(block.tool_use_id);
              const content = typeof block.content === 'string'
                ? block.content
                : JSON.stringify(block.content);
              const summary = content.length > 500
                ? content.slice(0, 500) + '...'
                : content;
              sendSSE({ type: 'tool_done', tool: tool.name, summary });
            }
          }
          continue;
        }

        // Result message — done or error
        if (msg.type === 'result') {
          if (msg.subtype === 'success') {
            sendSSE({
              type: 'done',
              usage: msg.usage || null,
            });
          } else if (msg.subtype === 'error') {
            sendSSE({
              type: 'error',
              message: msg.error || 'Unknown error',
            });
          }
          continue;
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError' && !abortController.signal.aborted) {
        sendSSE({ type: 'error', message: err.message });
      } else {
        sendSSE({ type: 'aborted' });
      }
    } finally {
      const run = activeRuns.get(token);
      if (run && !run.sseConnected) {
        // Client disconnected — keep log for recovery (BL-108)
        completedRuns.set(token, { log: run.eventLog, completedAt: Date.now() });
        setTimeout(() => completedRuns.delete(token), 5 * 60 * 1000); // 5min TTL
      }
      activeRuns.delete(token);
      if (!res.writableEnded) res.end();
    }
  });

  // --- Interaction response endpoint ---

  router.post('/run/respond', requireSession, (req, res) => {
    const { toolUseId, response } = req.body || {};
    if (!toolUseId) return res.status(400).json({ error: 'Missing toolUseId' });

    const run = activeRuns.get(req.sessionToken);
    if (!run) return res.status(404).json({ error: 'No active run' });

    const ok = run.bridge.respond(toolUseId, response);
    if (!ok) return res.status(404).json({ error: 'No pending interaction for this toolUseId' });

    res.json({ ok: true });
  });

  // --- Run status endpoint (BL-108: recovery after disconnect) ---

  router.get('/run/status', requireSession, (req, res) => {
    const token = req.sessionToken;
    const active = activeRuns.get(token);
    if (active) {
      const pending = active.bridge.getPending();
      return res.json({
        active: true,
        log: active.eventLog,
        interaction: pending ? {
          tool: InteractionBridge.transformForFrontend(pending.input).tool,
          input: InteractionBridge.transformForFrontend(pending.input).input,
          toolUseId: pending.toolUseId,
        } : null,
      });
    }
    const completed = completedRuns.get(token);
    if (completed) {
      completedRuns.delete(token); // one-time recovery
      return res.json({ active: false, log: completed.log });
    }
    res.json({ active: false, log: [] });
  });

  // --- Cancel endpoint ---

  router.post('/run/cancel', requireSession, (req, res) => {
    const token = req.sessionToken;
    const run = activeRuns.get(token);
    if (run) {
      run.bridge.cancelAll();
      run.abortController.abort();
      activeRuns.delete(token);
    }
    res.json({ ok: true });
  });

  return router;
}

// --- Utility: backup Work layer before pipeline ---

async function backupWorkLayer(projectRoot) {
  const backupDir = resolve(projectRoot, '02_Work/_temp/backup-pre-pipeline');
  await mkdir(backupDir, { recursive: true });

  const workDir = resolve(projectRoot, '02_Work');
  let entries;
  try {
    entries = await readdir(workDir, { withFileTypes: true });
  } catch {
    return; // no Work dir yet
  }

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const src = join(workDir, entry.name);
    const dst = join(backupDir, entry.name);
    try {
      await copyFile(src, dst);
    } catch { /* skip */ }
  }
}
