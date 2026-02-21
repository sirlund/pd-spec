/**
 * Parser for SOURCE_MAP.md → JSON
 *
 * Format: markdown table with columns:
 * | File | Format | Status | Claims | Hash | Last Processed |
 */

export function parseSourceMap(content) {
  if (!content) return { sources: [], summary: {} };

  const lines = content.split('\n');
  const sources = [];

  // Find the table — skip header and separator rows
  let inTable = false;
  let headerParsed = false;

  for (const line of lines) {
    if (!line.startsWith('|')) {
      if (inTable) break; // table ended
      continue;
    }

    // Skip separator row (|---|---|...)
    if (line.match(/^\|[\s-|]+$/)) {
      inTable = true;
      continue;
    }

    // Skip header row (first | row before separator)
    if (!inTable && !headerParsed) {
      headerParsed = true;
      continue;
    }

    if (!inTable) continue;

    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 6) continue;

    const [file, format, status, claims, hash, lastProcessed] = cells;

    // Extract folder from file path
    const parts = file.split('/');
    const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '';
    const filename = parts[parts.length - 1];

    sources.push({
      path: file,
      folder,
      filename,
      format,
      status,
      claims: parseInt(claims) || 0,
      hash: hash === '—' ? null : hash,
      last_processed: lastProcessed === '—' ? null : lastProcessed,
    });
  }

  const summary = {
    total: sources.length,
    processed: sources.filter(s => s.status === 'processed').length,
    pending: sources.filter(s => s.status.startsWith('pending')).length,
    unsupported: sources.filter(s => s.status.startsWith('unsupported')).length,
    total_claims: sources.reduce((sum, s) => sum + s.claims, 0),
  };

  // Group by folder
  const folders = {};
  for (const s of sources) {
    const key = s.folder || '(root)';
    if (!folders[key]) folders[key] = [];
    folders[key].push(s);
  }

  return { sources, folders, summary };
}
