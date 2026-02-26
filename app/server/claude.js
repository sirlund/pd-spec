/**
 * Claude API integration — session management + SSE agent endpoint.
 * BYOK: user provides their own API key, stored in-memory only.
 */

import { Router } from 'express';
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import { resolve } from 'path';
import Anthropic from '@anthropic-ai/sdk';
import { TOOLS, isInteractionTool, executeTool, backupWorkLayer } from './agent-runtime.js';

export function createClaudeRoutes(projectRoot, broadcast) {
  const router = Router();

  // In-memory session store: token → { apiKey, createdAt, client }
  const sessions = new Map();
  // Conversation state: token → { messages, systemPrompt, mode, aborted, pendingInteraction }
  const conversations = new Map();
  // Active abort controllers: token → AbortController
  const activeStreams = new Map();

  const SESSION_TTL = 8 * 60 * 60 * 1000; // 8 hours

  function getSession(token) {
    if (!token) return null;
    const session = sessions.get(token);
    if (!session) return null;
    if (Date.now() - session.createdAt > SESSION_TTL) {
      sessions.delete(token);
      conversations.delete(token);
      return null;
    }
    return session;
  }

  // Middleware: validate session token for protected routes
  function requireSession(req, res, next) {
    const token = req.headers['x-session-token'];
    const session = getSession(token);
    if (!session) return res.status(401).json({ error: 'Invalid or expired session' });
    req.session = session;
    req.sessionToken = token;
    next();
  }

  /**
   * POST /api/claude/session — validate key, create session
   */
  router.post('/session', async (req, res) => {
    const { apiKey } = req.body || {};
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      return res.status(400).json({ error: 'Invalid API key format' });
    }

    try {
      // Test the key with a minimal request
      const client = new Anthropic({ apiKey });
      await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      });

      const sessionToken = randomUUID();
      sessions.set(sessionToken, { apiKey, createdAt: Date.now(), client });

      // Schedule eviction
      setTimeout(() => {
        sessions.delete(sessionToken);
        conversations.delete(sessionToken);
      }, SESSION_TTL);

      res.json({ sessionToken, valid: true });
    } catch (err) {
      if (err.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      res.status(500).json({ error: err.message });
    }
  });

  /**
   * GET /api/claude/session — check if session is valid
   */
  router.get('/session', (req, res) => {
    const token = req.headers['x-session-token'];
    const session = getSession(token);
    res.json({ valid: !!session });
  });

  /**
   * DELETE /api/claude/session — destroy session
   */
  router.delete('/session', (req, res) => {
    const token = req.headers['x-session-token'];
    if (token) {
      sessions.delete(token);
      conversations.delete(token);
    }
    res.json({ ok: true });
  });

  /**
   * POST /api/claude/run — SSE agent loop
   */
  router.post('/run', requireSession, async (req, res) => {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: 'Missing message' });

    const token = req.sessionToken;
    const { client } = req.session;
    let conv = conversations.get(token);

    // --- Mode detection ---
    const skillMatch = message.match(/^\/(extract|analyze|spec)\b/);
    const isInteractionResponse = conv?.pendingInteraction && !skillMatch;

    if (skillMatch) {
      // Starting a new skill — reset conversation
      const skillName = skillMatch[1];
      const skillPath = resolve(projectRoot, `.claude/skills/${skillName}/SKILL.md`);
      let skillContent;
      try {
        skillContent = await readFile(skillPath, 'utf-8');
      } catch {
        return res.status(404).json({ error: `Skill not found: ${skillName}` });
      }

      // Read PROJECT.md for context
      let projectMd = '';
      try {
        projectMd = await readFile(resolve(projectRoot, 'PROJECT.md'), 'utf-8');
      } catch { /* ok */ }

      const preamble = `You are running inside the PD-Spec web application. You have these tools available:

Filesystem: read_file, write_file, list_files, run_script, search_files
- Use read_file instead of "Read tool"
- Use write_file instead of "Write tool" or "Edit tool"
- Use list_files to explore directories
- Use run_script for utility scripts (verify-insight.sh, resolve-conflict.sh, count-statuses.sh, next-id.sh)
- Use search_files to grep across files

User interaction: ask_confirmation, ask_selection, ask_text
- When you need user approval or a yes/no decision → ask_confirmation
- When you need the user to choose from options → ask_selection
- When you need free-form input from the user → ask_text
- ALWAYS use these tools for user interaction. Never ask questions in plain text.

Skip writing to 02_Work/MEMORY.md and 02_Work/_temp/SESSION_CHECKPOINT.md.
The project root is the working directory for all file paths.

PROJECT.md contents:
${projectMd}
`;

      // Backup before pipeline
      try {
        await backupWorkLayer(projectRoot);
      } catch { /* non-fatal */ }

      conv = {
        messages: [],
        systemPrompt: preamble + '\n---\n\n' + skillContent,
        mode: 'skill',
        aborted: false,
        pendingInteraction: null,
      };
      conversations.set(token, conv);
    } else if (isInteractionResponse) {
      // User is responding to an interaction tool
      const { toolUseId } = conv.pendingInteraction;
      conv.messages.push({
        role: 'user',
        content: [{ type: 'tool_result', tool_use_id: toolUseId, content: message }],
      });
      conv.pendingInteraction = null;
    } else if (!conv || conv.mode === 'qa') {
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

      conv = {
        messages: [],
        systemPrompt: `You are a research assistant for a PD-Spec project. Answer questions about the project based on the Work layer data below. Reference insight IDs as [IG-XX] and conflict IDs as [CF-XX] when relevant.\n\n${context}`,
        mode: 'qa',
        aborted: false,
        pendingInteraction: null,
      };
      conversations.set(token, conv);
    }

    // Append user message (for non-interaction-response cases)
    if (!isInteractionResponse) {
      conv.messages.push({ role: 'user', content: message });
    }

    // --- SSE setup ---
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const sendSSE = (data) => {
      if (!res.writableEnded) {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      }
    };

    const abortController = new AbortController();
    activeStreams.set(token, abortController);

    req.on('close', () => {
      if (conv) conv.aborted = true;
      abortController.abort();
      activeStreams.delete(token);
    });

    try {
      let iterations = 0;
      const MAX_ITERATIONS = 200;

      while (iterations < MAX_ITERATIONS && !conv.aborted) {
        iterations++;

        const apiParams = {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 16384,
          system: conv.systemPrompt,
          messages: conv.messages,
        };
        if (conv.mode === 'skill') {
          apiParams.tools = TOOLS;
        }

        let response;
        try {
          response = await client.messages.create(apiParams, {
            signal: abortController.signal,
          });
        } catch (err) {
          if (err.name === 'AbortError' || conv.aborted) {
            sendSSE({ type: 'aborted' });
            break;
          }
          sendSSE({ type: 'error', message: err.message });
          break;
        }

        // Process content blocks
        const toolResults = [];
        let hasInteraction = false;

        const assistantContent = response.content;
        conv.messages.push({ role: 'assistant', content: assistantContent });

        for (const block of assistantContent) {
          if (conv.aborted) break;

          if (block.type === 'text') {
            sendSSE({ type: 'text', content: block.text });
          } else if (block.type === 'tool_use') {
            if (isInteractionTool(block.name)) {
              sendSSE({ type: 'interaction', tool: block.name, input: block.input, toolUseId: block.id });
              conv.pendingInteraction = { toolUseId: block.id, toolName: block.name };
              hasInteraction = true;
            } else {
              // Filesystem tool — auto-execute
              sendSSE({ type: 'tool_start', tool: block.name, input: summarizeInput(block.input) });
              try {
                const result = await executeTool(block.name, block.input, projectRoot);
                const summary = result.content.length > 500
                  ? result.content.slice(0, 500) + '...'
                  : result.content;
                sendSSE({ type: 'tool_done', tool: block.name, summary });
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: result.content,
                  is_error: result.is_error || false,
                });
              } catch (err) {
                sendSSE({ type: 'tool_done', tool: block.name, summary: `Error: ${err.message}` });
                toolResults.push({
                  type: 'tool_result',
                  tool_use_id: block.id,
                  content: `Error: ${err.message}`,
                  is_error: true,
                });
              }
            }
          }
        }

        if (conv.aborted) {
          sendSSE({ type: 'aborted' });
          break;
        }

        if (hasInteraction) {
          sendSSE({ type: 'waiting' });
          // Save state and close connection — wait for next POST
          activeStreams.delete(token);
          res.end();
          return;
        }

        if (response.stop_reason === 'tool_use' && toolResults.length > 0) {
          // Auto-continue with tool results
          conv.messages.push({ role: 'user', content: toolResults });
          sendSSE({ type: 'continuing' });
          continue;
        }

        // end_turn or max_tokens — done
        sendSSE({
          type: 'done',
          usage: response.usage,
        });
        break;
      }

      if (iterations >= MAX_ITERATIONS) {
        sendSSE({ type: 'error', message: 'Max iterations reached (200)' });
      }

      // Cleanup
      if (conv.mode === 'qa') {
        conversations.delete(token);
      }
      activeStreams.delete(token);
    } catch (err) {
      sendSSE({ type: 'error', message: err.message });
      activeStreams.delete(token);
    }

    if (!res.writableEnded) res.end();
  });

  /**
   * POST /api/claude/run/cancel — abort current run
   */
  router.post('/run/cancel', requireSession, (req, res) => {
    const token = req.sessionToken;
    const conv = conversations.get(token);
    if (conv) conv.aborted = true;
    const controller = activeStreams.get(token);
    if (controller) controller.abort();
    activeStreams.delete(token);
    conversations.delete(token);
    res.json({ ok: true });
  });

  return router;
}

/** Summarize tool input for SSE display (hide large content) */
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
