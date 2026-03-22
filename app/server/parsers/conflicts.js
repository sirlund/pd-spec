/**
 * Parser for CONFLICTS.md → JSON
 *
 * Format: h3 entries like `### [CF-XX] Title — Description`
 * with fields: Status, Type, Related insights
 * followed by source claims and Resolution/Action.
 */

const CONFLICT_HEADER = /^### \[(CF-\d+)\]\s*(?:([^—]+)—\s*)?(.+)$/;

export function parseConflicts(content) {
  if (!content) return { conflicts: [], summary: {} };

  const lines = content.split('\n');
  const conflicts = [];
  let current = null;
  let section = null; // 'fields' | 'claims' | 'resolution'

  function flush() {
    if (current) {
      if (current.resolution) current.resolution = current.resolution.trim();
      if (current.action) current.action = current.action.trim();
      conflicts.push(current);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip h2 headers (Status Legend, etc.)
    if (line.startsWith('## ') && !line.startsWith('### ')) continue;

    // h3 = conflict entry
    const headerMatch = line.match(CONFLICT_HEADER);
    if (headerMatch) {
      flush();
      current = {
        id: headerMatch[1],
        title: (headerMatch[2] || '').trim(),
        description: headerMatch[3].trim(),
        status: 'PENDING',
        intermediate: null,
        intermediate_note: null,
        type: null,
        related_insights: [],
        claims: [],
        resolution: null,
        action: null,
        priority: null,
      };
      section = 'fields';
      continue;
    }

    if (!current) continue;

    // Field lines
    if (section === 'fields' || section === 'claims') {
      const status = line.match(/^-?\s*Status:\s*(\w+)(?:\s*—\s*(.+))?/);
      if (status) {
        current.status = status[1].toUpperCase();
        if (status[2]) {
          const suffix = status[2].trim();
          const noteMatch = suffix.match(/^\w+\s*\((.+)\)\s*$/);
          if (suffix.startsWith('Flagged')) {
            current.intermediate = 'FLAGGED';
            current.intermediate_note = noteMatch?.[1] || '';
          } else if (suffix.startsWith('Research')) {
            current.intermediate = 'RESEARCH';
            current.intermediate_note = noteMatch?.[1] || '';
          }
        }
        continue;
      }

      const type = line.match(/^-?\s*Type:\s*(.+)/);
      if (type) { current.type = type[1].trim(); continue; }

      const related = line.match(/^-?\s*Related insights:\s*(.+)/);
      if (related) {
        current.related_insights = related[1].match(/\[IG-[A-Za-z0-9-]+\]/g) || [];
        current.related_insights = current.related_insights.map(r => r.replace(/[\[\]]/g, ''));
        continue;
      }
    }

    // Source claims
    const claim = line.match(/^- \*\*Source claim [A-Z]:\*\*\s*(.+)/);
    if (claim) {
      section = 'claims';
      current.claims.push(claim[1].trim());
      continue;
    }

    // Resolution
    if (line.match(/^\*\*Resolution:\*\*/)) {
      section = 'resolution';
      const text = line.replace(/^\*\*Resolution:\*\*\s*/, '');
      current.resolution = text;
      continue;
    }

    // Action
    if (line.match(/^\*\*Action:\*\*/)) {
      section = 'resolution';
      const text = line.replace(/^\*\*Action:\*\*\s*/, '');
      current.action = text;
      continue;
    }

    // Priority under action
    const priority = line.match(/^- Priority:\s*(.+)/);
    if (priority) { current.priority = priority[1].trim(); continue; }

    // Continue resolution text
    if (section === 'resolution' && line.trim() && !line.match(/^---/)) {
      if (current.resolution !== null) current.resolution += '\n' + line;
      else if (current.action !== null) current.action += '\n' + line;
    }

    // Separator
    if (line.match(/^---\s*$/)) {
      section = null;
    }
  }

  flush();

  const summary = {
    total: conflicts.length,
    pending: conflicts.filter(c => c.status === 'PENDING' && !c.intermediate).length,
    flagged: conflicts.filter(c => c.intermediate === 'FLAGGED').length,
    research: conflicts.filter(c => c.intermediate === 'RESEARCH').length,
    resolved: conflicts.filter(c => c.status === 'RESOLVED').length,
  };

  return { conflicts, summary };
}
