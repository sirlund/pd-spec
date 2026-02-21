/**
 * Parser for INSIGHTS_GRAPH.md → JSON
 *
 * Format: h3 entries like `### [IG-XX] "Concept" — Description`
 * with fields: Consolidates, Convergence, Category, Voice, Authority, Status
 * followed by Narrative blockquote, Evidence trail, and Ref line.
 */

const INSIGHT_ID = /^### \[(IG-[A-Z0-9-]+)\]\s*(.*)/;

function parseInsightHeader(line) {
  const m = line.match(INSIGHT_ID);
  if (!m) return null;
  const id = m[1];
  const rest = m[2].trim();

  // Try: "Concept" — Description
  const full = rest.match(/^"([^"]+)"\s*—\s*(.+)$/);
  if (full) return { id, concept: full[1], title: full[2] };

  // Try: "Concept" only
  const conceptOnly = rest.match(/^"([^"]+)"$/);
  if (conceptOnly) return { id, concept: conceptOnly[1], title: conceptOnly[1] };

  // Plain title (no quotes, no em-dash)
  return { id, concept: null, title: rest };
}

export function parseInsights(content) {
  if (!content) return { categories: [], insights: [] };

  const lines = content.split('\n');
  const insights = [];
  let currentCategory = null;
  let current = null;
  let section = null; // 'fields' | 'narrative' | 'evidence' | 'after'

  function flush() {
    if (current) {
      if (current.narrative) current.narrative = current.narrative.trim();
      insights.push(current);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // h2 = category
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flush();
      current = null;
      currentCategory = line.replace(/^## /, '').trim();
      continue;
    }

    // h3 = insight entry
    const header = parseInsightHeader(line);
    if (header) {
      flush();
      current = {
        id: header.id,
        concept: header.concept,
        title: header.title,
        category_group: currentCategory,
        consolidates: null,
        convergence: null,
        convergence_ratio: null,
        category: null,
        voice: null,
        authority: null,
        status: 'PENDING',
        ai_generated: false,
        narrative: '',
        evidence: [],
        named_concept_origin: null,
        refs: [],
      };
      section = 'fields';
      continue;
    }

    if (!current) continue;

    // Field lines (key-value)
    if (section === 'fields') {
      const consolidates = line.match(/^\*\*Consolidates:\*\*\s*(.+)/);
      if (consolidates) { current.consolidates = consolidates[1].trim(); continue; }

      const convergence = line.match(/^\*\*Convergence:\*\*\s*(.+)/);
      if (convergence) {
        current.convergence = convergence[1].trim();
        const ratio = convergence[1].match(/(\d+)\/(\d+)/);
        if (ratio) current.convergence_ratio = { matched: parseInt(ratio[1]), total: parseInt(ratio[2]) };
        continue;
      }

      const cat = line.match(/^\*\*Category:\*\*\s*(.+)/);
      if (cat) { current.category = cat[1].trim(); continue; }

      const voice = line.match(/^\*\*Voice:\*\*\s*(.+)/);
      if (voice) { current.voice = voice[1].trim(); continue; }

      const auth = line.match(/^\*\*Authority:\*\*\s*(.+)/);
      if (auth) { current.authority = auth[1].trim(); continue; }

      const status = line.match(/^Status:\s*(\w+)/);
      if (status) { current.status = status[1].toUpperCase(); continue; }

      const aiTag = line.match(/\[AI-GENERATED/);
      if (aiTag) { current.ai_generated = true; continue; }
    }

    // Narrative blockquote
    if (line.startsWith('> **Narrative:**') || line.startsWith('> ')) {
      section = 'narrative';
      const text = line.replace(/^>\s*/, '').replace(/^\*\*Narrative:\*\*\s*/, '');
      if (text) current.narrative += text + '\n';
      continue;
    }

    // Evidence trail
    if (line.match(/^\*\*Evidence trail:\*\*/)) {
      section = 'evidence';
      continue;
    }

    if (section === 'evidence' && line.match(/^- /)) {
      current.evidence.push(line.replace(/^- /, '').trim());
      continue;
    }

    // Named concept origin
    const concept = line.match(/^\*\*Named concept origin:\*\*\s*(.+)/);
    if (concept) { current.named_concept_origin = concept[1].trim(); continue; }

    // Ref line
    const ref = line.match(/^Ref:\s*(.+)/);
    if (ref) {
      current.refs = ref[1].split(',').map(r => r.trim()).filter(Boolean);
      section = 'after';
      continue;
    }

    // Separator
    if (line.match(/^---\s*$/)) {
      section = 'after';
      continue;
    }

    // Continue narrative if we're in that section
    if (section === 'narrative' && line.trim()) {
      current.narrative += line + '\n';
    }
  }

  flush();

  // Extract unique categories
  const categories = [...new Set(insights.map(i => i.category_group).filter(Boolean))];

  return { categories, insights };
}
