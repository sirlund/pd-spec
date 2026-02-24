/**
 * Semantic markdown renderer for PD-Spec content.
 *
 * Extends marked.js to recognize PD-Spec patterns:
 * - [IG-XX] → blue badge links
 * - [CF-XX] → red badge links
 * - **Status:** VALUE → colored status tags
 * - > "quote" → styled blockquotes
 * - Markdown tables → HTML tables
 */

import { marked } from 'marked';

// Custom renderer for PD-Spec extensions
const renderer = new marked.Renderer();

// Add PD-Spec badge processing to text
function processPdSpecTokens(text) {
  // Bracket-format multi-refs: [IG-01, CF-02, IG-03] → individual badges
  text = text.replace(
    /\[(((?:IG-[A-Za-z0-9-]+|CF-\d+)(?:\s*,\s*(?:IG-[A-Za-z0-9-]+|CF-\d+))+))\]/g,
    (_, inner) => inner.split(/\s*,\s*/).map(ref => {
      const cls = ref.startsWith('IG') ? 'badge-insight' : 'badge-conflict';
      return `<span class="badge ${cls}" data-ref="${ref}" role="link" tabindex="0">${ref}</span>`;
    }).join(' ')
  );

  // [IG-XX] → blue badge
  text = text.replace(
    /\[(IG-[A-Za-z0-9-]+)\]/g,
    '<span class="badge badge-insight" data-ref="$1" role="link" tabindex="0">$1</span>'
  );

  // [CF-XX] → red badge
  text = text.replace(
    /\[(CF-\d+)\]/g,
    '<span class="badge badge-conflict" data-ref="$1" role="link" tabindex="0">$1</span>'
  );

  // **Status:** VALUE → status tag
  text = text.replace(
    /\*\*Status:\*\*\s*(VERIFIED|PENDING|MERGED|INVALIDATED|RESOLVED|READY|BLOCKED)/gi,
    (_, status) => {
      const s = status.toUpperCase();
      const cls = {
        VERIFIED: 'badge-verified', PENDING: 'badge-pending',
        MERGED: 'badge-merged', INVALIDATED: 'badge-invalidated',
        RESOLVED: 'badge-resolved', READY: 'badge-ready',
        BLOCKED: 'badge-blocked',
      }[s] || 'badge-pending';
      return `<strong>Status:</strong> <span class="badge ${cls}">${s}</span>`;
    }
  );

  // [AI-GENERATED] / [AI-SOURCE] → warning badge
  text = text.replace(
    /\[(AI-GENERATED|AI-SOURCE)[^\]]*\]/g,
    '<span class="badge badge-ai-warning">$1</span>'
  );

  return text;
}

// Override text rendering
const originalText = renderer.text;
renderer.text = function({ text }) {
  if (typeof text === 'string') {
    return processPdSpecTokens(text);
  }
  return originalText ? originalText.call(this, { text }) : text;
};

// Fix BUG-02: strong/em tokens must wrap contents properly
renderer.strong = function({ text }) {
  const inner = typeof text === 'string' ? processPdSpecTokens(text) : text;
  return `<strong>${inner}</strong>`;
};

renderer.em = function({ text }) {
  const inner = typeof text === 'string' ? processPdSpecTokens(text) : text;
  return `<em>${inner}</em>`;
};

const markedOptions = {
  renderer,
  gfm: true,
  breaks: false,
};

export function renderMarkdown(content) {
  if (!content) return '';
  let html = marked(content, markedOptions);
  // Catch any **bold** or *italic* markers that survived marked's inline lexer
  // (happens in <li><p> content in some marked versions)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  return html;
}

/**
 * Parse EXTRACTIONS.md into structured sections per source file.
 */
export function parseExtractions(content) {
  if (!content) return { files: [], total_claims: 0 };

  const lines = content.split('\n');
  const files = [];
  let current = null;
  let inClaims = false;

  function flush() {
    if (current) files.push(current);
  }

  for (const line of lines) {
    // h2 = source file section
    const fileHeader = line.match(/^## \[([^\]]+)\]\s*(.*)?$/);
    if (fileHeader) {
      flush();
      const tags = [];
      if (fileHeader[2]) {
        const tagMatches = fileHeader[2].match(/⚠️\s*(\S+)/);
        if (tagMatches) tags.push(tagMatches[1]);
      }
      current = {
        path: fileHeader[1],
        tags,
        metadata: {},
        claims: [],
      };
      inClaims = false;
      continue;
    }

    if (!current) continue;

    // Metadata fields
    const meta = line.match(/^- (\w+):\s*(.+)/);
    if (meta && !inClaims) {
      current.metadata[meta[1].toLowerCase()] = meta[2].trim();
      continue;
    }

    // Claims section
    if (line.match(/^### Raw Claims/)) {
      inClaims = true;
      continue;
    }

    // Numbered claim
    const claim = line.match(/^(\d+)\.\s*(.+)/);
    if (claim && inClaims) {
      const text = claim[2].trim();
      const claimTags = [];
      const tagMatch = text.match(/\[(AI-SOURCE|[A-Z-]+)\]/g);
      if (tagMatch) tagMatch.forEach(t => claimTags.push(t.replace(/[\[\]]/g, '')));
      current.claims.push({
        number: parseInt(claim[1]),
        text: text.replace(/\s*\[[A-Z-]+\]\s*/g, '').replace(/^"(.*)"$/, '$1'),
        tags: claimTags,
      });
      continue;
    }

    // Separator
    if (line.match(/^---\s*$/)) {
      inClaims = false;
    }
  }

  flush();

  const total_claims = files.reduce((sum, f) => sum + f.claims.length, 0);

  return { files, total_claims };
}
