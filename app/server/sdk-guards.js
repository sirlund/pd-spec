/**
 * SDK Guards — canUseTool callback and InteractionBridge for the Claude Agent SDK.
 * Handles: write path validation, Bash safety, BL-101 index redirects, and
 * user interaction pausing via Promises.
 */

import { existsSync } from 'fs';
import { resolve, relative } from 'path';

const WRITE_PREFIXES = ['02_Work/', '03_Outputs/'];
const DANGEROUS_BASH = ['rm -rf', 'sudo ', 'rm -r /'];

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
 * @param {string} projectRoot — absolute path to project
 * @param {InteractionBridge} bridge — interaction bridge instance
 * @param {function} sendSSE — function to send SSE events to the client
 * @returns {function} canUseTool callback
 */
export function createCanUseTool(projectRoot, bridge, sendSSE) {
  return async (toolName, input, options) => {
    const { toolUseID } = options;

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

      return { behavior: 'allow' };
    }

    // --- Read: BL-101 index redirect ---
    if (toolName === 'Read') {
      const filePath = input.file_path || '';
      const relPath = filePath.startsWith('/')
        ? relative(projectRoot, filePath)
        : filePath;

      // Redirect to index when reading EXTRACTIONS.md without offset
      if (relPath === '02_Work/EXTRACTIONS.md' && !input.offset) {
        const indexPath = resolve(projectRoot, '02_Work/_index/extractions-index.md');
        if (existsSync(indexPath)) {
          return {
            behavior: 'allow',
            updatedInput: { ...input, file_path: indexPath },
          };
        }
      }

      return { behavior: 'allow' };
    }

    // --- Bash: safety checks ---
    if (toolName === 'Bash') {
      const command = input.command || '';
      for (const dangerous of DANGEROUS_BASH) {
        if (command.includes(dangerous)) {
          return { behavior: 'deny', message: `Blocked dangerous command: ${dangerous}` };
        }
      }
      return { behavior: 'allow' };
    }

    // --- Default: allow ---
    return { behavior: 'allow' };
  };
}
