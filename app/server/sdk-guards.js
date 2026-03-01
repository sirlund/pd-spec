/**
 * SDK Guards — canUseTool callback and InteractionBridge for the Claude Agent SDK.
 * Handles: write path validation, Bash safety, and user interaction pausing via Promises.
 */

import { relative } from 'path';

const WRITE_PREFIXES = ['02_Work/', '03_Outputs/'];
const DANGEROUS_BASH = ['rm -rf', 'sudo ', 'rm -r /'];

// Tools allowed per mode. Everything else is denied.
const SKILL_TOOLS = new Set(['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep', 'AskUserQuestion']);
const QA_TOOLS = new Set(['Read', 'Glob', 'Grep']);

/**
 * InteractionBridge — pauses SDK execution when AskUserQuestion fires,
 * waits for user response via HTTP POST, then resumes.
 */
export class InteractionBridge {
  constructor() {
    this._pending = null; // { resolve, reject, toolUseId, input, timer }
  }

  /**
   * Called from canUseTool when AskUserQuestion fires.
   * Returns a Promise that resolves with the user's answer.
   */
  handleQuestion(input, toolUseId) {
    if (this._pending) {
      this._pending.reject(new Error('Superseded by new question'));
      clearTimeout(this._pending.timer);
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this._pending = null;
        reject(new Error('Interaction timeout (10 minutes)'));
      }, 10 * 60 * 1000);

      this._pending = { resolve, reject, toolUseId, input, timer };
    });
  }

  /**
   * Called from POST /run/respond when user answers.
   */
  respond(toolUseId, answer) {
    if (!this._pending || this._pending.toolUseId !== toolUseId) {
      return false;
    }
    clearTimeout(this._pending.timer);
    this._pending.resolve(answer);
    this._pending = null;
    return true;
  }

  getPending() {
    return this._pending
      ? { toolUseId: this._pending.toolUseId, input: this._pending.input }
      : null;
  }

  cancelAll() {
    if (this._pending) {
      clearTimeout(this._pending.timer);
      this._pending.reject(new Error('Cancelled'));
      this._pending = null;
    }
  }

  /**
   * Transform AskUserQuestion input → frontend interaction format.
   *
   * SDK AskUserQuestion: { questions: [{ question, options: [{label, description}], multiSelect }] }
   * Frontend format: { tool: 'ask_confirmation'|'ask_selection'|'ask_text', input: {...} }
   */
  static transformForFrontend(askUserInput) {
    const questions = askUserInput.questions || [];
    if (questions.length === 0) {
      return { tool: 'ask_text', input: { message: 'Please provide input.' } };
    }

    const q = questions[0];
    const options = q.options || [];

    if (options.length === 0) {
      return {
        tool: 'ask_text',
        input: { message: q.question, placeholder: '' },
      };
    }

    if (q.multiSelect) {
      return {
        tool: 'ask_selection',
        input: {
          message: q.question,
          items: options.map(o => ({ id: o.label, label: o.label, description: o.description })),
          multiple: true,
        },
      };
    }

    // Single selection — ask_confirmation for ≤4 options, ask_selection for more
    if (options.length <= 4) {
      return {
        tool: 'ask_confirmation',
        input: {
          message: q.question,
          options: options.map(o => ({ id: o.label, label: o.label, description: o.description })),
        },
      };
    }

    return {
      tool: 'ask_selection',
      input: {
        message: q.question,
        items: options.map(o => ({ id: o.label, label: o.label, description: o.description })),
        multiple: false,
      },
    };
  }

  /**
   * Build AskUserQuestion updatedInput from the user's frontend response.
   * Maps frontend response back to SDK answer format.
   */
  static buildAnswer(originalInput, userResponse) {
    const questions = originalInput.questions || [];
    if (questions.length === 0) return originalInput;

    const q = questions[0];
    const answers = {};
    answers[q.question] = typeof userResponse === 'string'
      ? userResponse
      : JSON.stringify(userResponse);

    return { ...originalInput, answers };
  }
}

/**
 * Create the canUseTool callback for the SDK.
 *
 * Permission architecture (two layers):
 *   1. disallowedTools (in claude.js) — blocks tools at CLI level before they
 *      reach canUseTool. Handles Agent, Skill, and Q&A write restrictions.
 *   2. canUseTool (this callback) — only fires for "dangerous" operations
 *      that the CLI's default permission system doesn't auto-approve.
 *      Handles: Write/Edit path validation, Bash safety, AskUserQuestion
 *      interaction bridging, and BL-101 index redirects.
 *
 * Safe tools (Read, Glob, Grep, safe Bash) are auto-approved by the CLI
 * without calling canUseTool. This is acceptable — they're read-only.
 *
 * @param {string} projectRoot — absolute path to project
 * @param {InteractionBridge} bridge — interaction bridge instance
 * @param {function} sendSSE — function to send SSE events to the client
 * @param {string} mode — 'skill' or 'qa'
 * @returns {function} canUseTool callback
 */
export function createCanUseTool(projectRoot, bridge, sendSSE, mode) {
  const allowedTools = mode === 'skill' ? SKILL_TOOLS : QA_TOOLS;

  return async (toolName, input, options) => {
    const { toolUseID } = options;

    // --- Mode-based tool allowlist ---
    // NOTE: The CLI auto-approves "safe" tools (Read, Glob, Grep, safe Bash)
    // without calling canUseTool. This callback only fires for "dangerous"
    // operations (Write, Edit, risky Bash, AskUserQuestion). The allowlist
    // check below catches tools that slip through as dangerous but shouldn't
    // be available in the current mode (e.g., Write in Q&A mode).
    if (!allowedTools.has(toolName)) {
      return { behavior: 'deny', message: `Tool ${toolName} is not available in ${mode} mode.` };
    }

    // Note: SDK requires updatedInput to be a record (object) when present.
    // When allowing without modification, pass the original input.

    // --- AskUserQuestion: pause for user interaction ---
    if (toolName === 'AskUserQuestion') {
      const frontendData = InteractionBridge.transformForFrontend(input);
      sendSSE({
        type: 'interaction',
        tool: frontendData.tool,
        input: frontendData.input,
        toolUseId: toolUseID,
      });
      sendSSE({ type: 'waiting' });

      try {
        const userResponse = await bridge.handleQuestion(input, toolUseID);
        const updatedInput = InteractionBridge.buildAnswer(input, userResponse);
        return { behavior: 'allow', updatedInput };
      } catch (err) {
        return { behavior: 'deny', message: err.message };
      }
    }

    // --- Write/Edit: path validation ---
    if (toolName === 'Write' || toolName === 'Edit') {
      const filePath = input.file_path || '';
      const relPath = filePath.startsWith('/')
        ? relative(projectRoot, filePath)
        : filePath;

      if (relPath.startsWith('..') || relPath.startsWith('/')) {
        return { behavior: 'deny', message: 'Write access denied: path outside project root' };
      }

      const allowed = WRITE_PREFIXES.some(p => relPath.startsWith(p));
      if (!allowed) {
        return {
          behavior: 'deny',
          message: `Write access denied for: ${relPath}. Only 02_Work/ and 03_Outputs/ are writable.`,
        };
      }

      return { behavior: 'allow', updatedInput: input };
    }

    // --- Bash: safety checks ---
    if (toolName === 'Bash') {
      const command = input.command || '';
      for (const dangerous of DANGEROUS_BASH) {
        if (command.includes(dangerous)) {
          return { behavior: 'deny', message: `Blocked dangerous command: ${dangerous}` };
        }
      }
      return { behavior: 'allow', updatedInput: input };
    }

    // --- Glob/Grep: allow with input passthrough ---
    return { behavior: 'allow', updatedInput: input };
  };
}
