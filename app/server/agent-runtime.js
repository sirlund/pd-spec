/**
 * Agent runtime — tool definitions and execution for the Claude agent loop.
 * Two categories: filesystem tools (auto-continue) and interaction tools (pause for user).
 */

import { readFile, writeFile, readdir, stat, mkdir, copyFile } from 'fs/promises';
import { resolve, relative, join, dirname } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

// Script allowlist
const ALLOWED_SCRIPTS = new Set([
  'verify-insight.sh',
  'resolve-conflict.sh',
  'count-statuses.sh',
  'next-id.sh',
  'integrity-check.sh',
  'discover-sources.sh',
]);

// Readable paths
const READ_PREFIXES = ['01_Sources/', '02_Work/', '03_Outputs/', '.claude/'];
const READ_EXACT = ['PROJECT.md', 'CLAUDE.md'];

// Writable paths
const WRITE_PREFIXES = ['02_Work/', '03_Outputs/'];

function validateReadPath(path) {
  if (!path || path.includes('..')) return false;
  if (path.startsWith('/')) return false;
  return READ_EXACT.includes(path) || READ_PREFIXES.some(p => path.startsWith(p));
}

function validateWritePath(path) {
  if (!path || path.includes('..')) return false;
  if (path.startsWith('/')) return false;
  // Block MEMORY.md and SESSION_CHECKPOINT.md
  if (path.includes('MEMORY.md') || path.includes('SESSION_CHECKPOINT.md')) return false;
  return WRITE_PREFIXES.some(p => path.startsWith(p));
}

function validateListPath(path) {
  if (!path || path.includes('..')) return false;
  if (path.startsWith('/')) return false;
  return READ_EXACT.includes(path) || READ_PREFIXES.some(p => path.startsWith(p) || p.startsWith(path + '/'));
}

// --- Filesystem Tools ---

const filesystemTools = [
  {
    name: 'read_file',
    description: 'Read the contents of a file. Path is relative to project root.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path' },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Write content to a file. Path is relative to project root. Only 02_Work/ and 03_Outputs/ are writable.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative file path' },
        content: { type: 'string', description: 'File content to write' },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'list_files',
    description: 'List files in a directory. Returns file names and sizes.',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Relative directory path' },
        pattern: { type: 'string', description: 'Optional filename filter (e.g., "*.md")' },
      },
      required: ['path'],
    },
  },
  {
    name: 'run_script',
    description: 'Run a utility script from the scripts/ directory. Allowed: verify-insight.sh, resolve-conflict.sh, count-statuses.sh, next-id.sh, integrity-check.sh, discover-sources.sh.',
    input_schema: {
      type: 'object',
      properties: {
        script: { type: 'string', description: 'Script filename (e.g., "verify-insight.sh")' },
        args: {
          type: 'array',
          items: { type: 'string' },
          description: 'Arguments to pass to the script',
        },
      },
      required: ['script', 'args'],
    },
  },
  {
    name: 'search_files',
    description: 'Search for a pattern across files using grep. Returns matching lines with file paths.',
    input_schema: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regex pattern to search for' },
        path: { type: 'string', description: 'Relative directory to search in (default: project root)' },
        glob: { type: 'string', description: 'File glob filter (e.g., "*.md")' },
      },
      required: ['pattern'],
    },
  },
];

// --- Interaction Tools ---

const interactionTools = [
  {
    name: 'ask_confirmation',
    description: 'Ask the user to confirm or choose between options. Use for yes/no decisions or approval.',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to show the user' },
        options: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              description: { type: 'string' },
            },
            required: ['id', 'label'],
          },
          description: 'Buttons for the user to choose from',
        },
      },
      required: ['message', 'options'],
    },
  },
  {
    name: 'ask_selection',
    description: 'Ask the user to select from a list of options (radio buttons or checkboxes).',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message to show the user' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              label: { type: 'string' },
              description: { type: 'string' },
            },
            required: ['id', 'label'],
          },
          description: 'Items to select from',
        },
        multiple: { type: 'boolean', description: 'Allow multiple selections' },
      },
      required: ['message', 'items'],
    },
  },
  {
    name: 'ask_text',
    description: 'Ask the user for free-form text input.',
    input_schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Message/question to show' },
        placeholder: { type: 'string', description: 'Placeholder text for the input' },
      },
      required: ['message'],
    },
  },
];

// --- Exports ---

export const TOOLS = [...filesystemTools, ...interactionTools];

export function isInteractionTool(name) {
  return ['ask_confirmation', 'ask_selection', 'ask_text'].includes(name);
}

export async function executeTool(name, input, projectRoot) {
  switch (name) {
    case 'read_file': {
      if (!validateReadPath(input.path)) {
        return { content: `Error: Access denied for path: ${input.path}`, is_error: true };
      }
      try {
        const content = await readFile(resolve(projectRoot, input.path), 'utf-8');
        return { content };
      } catch (err) {
        return { content: `Error reading file: ${err.message}`, is_error: true };
      }
    }

    case 'write_file': {
      if (!validateWritePath(input.path)) {
        return { content: `Error: Write access denied for path: ${input.path}`, is_error: true };
      }
      try {
        const fullPath = resolve(projectRoot, input.path);
        await mkdir(dirname(fullPath), { recursive: true });
        await writeFile(fullPath, input.content, 'utf-8');
        return { content: `OK: wrote ${input.content.length} chars to ${input.path}` };
      } catch (err) {
        return { content: `Error writing file: ${err.message}`, is_error: true };
      }
    }

    case 'list_files': {
      if (!validateListPath(input.path)) {
        return { content: `Error: Access denied for path: ${input.path}`, is_error: true };
      }
      try {
        const fullPath = resolve(projectRoot, input.path);
        const entries = await readdir(fullPath, { withFileTypes: true });
        const results = [];
        for (const entry of entries) {
          if (entry.name.startsWith('.')) continue;
          const entryPath = join(fullPath, entry.name);
          try {
            const stats = await stat(entryPath);
            const rel = relative(projectRoot, entryPath);
            if (entry.isDirectory()) {
              results.push(`${rel}/ (dir)`);
            } else {
              // Apply pattern filter
              if (input.pattern) {
                const regex = new RegExp(input.pattern.replace(/\*/g, '.*').replace(/\?/g, '.'));
                if (!regex.test(entry.name)) continue;
              }
              results.push(`${rel} (${stats.size} bytes)`);
            }
          } catch { /* skip */ }
        }
        return { content: results.join('\n') || '(empty directory)' };
      } catch (err) {
        return { content: `Error listing files: ${err.message}`, is_error: true };
      }
    }

    case 'run_script': {
      if (!ALLOWED_SCRIPTS.has(input.script)) {
        return { content: `Error: Script not allowed: ${input.script}. Allowed: ${[...ALLOWED_SCRIPTS].join(', ')}`, is_error: true };
      }
      try {
        const scriptPath = resolve(projectRoot, 'scripts', input.script);
        const { stdout, stderr } = await execFileAsync(scriptPath, input.args || [], {
          cwd: projectRoot,
          timeout: 30000,
        });
        return { content: (stdout + (stderr ? '\nSTDERR: ' + stderr : '')).trim() };
      } catch (err) {
        return { content: `Script error (exit ${err.code}): ${(err.stderr || err.stdout || err.message).trim()}`, is_error: true };
      }
    }

    case 'search_files': {
      const searchPath = input.path || '.';
      if (searchPath !== '.' && !validateReadPath(searchPath + '/')) {
        return { content: `Error: Access denied for path: ${searchPath}`, is_error: true };
      }
      try {
        const args = ['-rn', '--max-count=5'];
        if (input.glob) args.push('--include', input.glob);
        args.push(input.pattern, resolve(projectRoot, searchPath));

        const { stdout } = await execFileAsync('grep', args, {
          cwd: projectRoot,
          timeout: 15000,
          maxBuffer: 1024 * 1024,
        });
        // Make paths relative
        const result = stdout.replace(new RegExp(projectRoot + '/', 'g'), '');
        return { content: result.trim() || 'No matches found.' };
      } catch (err) {
        if (err.code === 1) return { content: 'No matches found.' };
        return { content: `Search error: ${err.message}`, is_error: true };
      }
    }

    default:
      return { content: `Unknown tool: ${name}`, is_error: true };
  }
}

/** Pre-pipeline backup of Work layer files */
export async function backupWorkLayer(projectRoot) {
  const backupDir = resolve(projectRoot, '02_Work/_temp/backup-pre-pipeline');
  await mkdir(backupDir, { recursive: true });

  const workDir = resolve(projectRoot, '02_Work');
  const entries = await readdir(workDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const src = join(workDir, entry.name);
    const dst = join(backupDir, entry.name);
    try {
      await copyFile(src, dst);
    } catch { /* skip */ }
  }
}
