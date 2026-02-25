/**
 * Parser for STRATEGIC_VISION.md → JSON
 *
 * Format:
 * ## Product Vision — paragraph
 * ## Product Strategy — paragraph
 * ## Design Principles — h3 entries with Operates at, Description, Refs
 * ## Operational Domains — h3 entries with Lead pillar, Refs
 * ## Value Propositions — list items
 * ## Open Questions — checkbox list
 */

export function parseStrategicVision(content) {
  if (!content) return { vision: null, strategy: null, principles: [], domains: [], value_props: [], open_questions: [] };

  const lines = content.split('\n');
  let section = null;
  let vision = '';
  let strategy = '';
  const principles = [];
  const domains = [];
  const value_props = [];
  const open_questions = [];
  let currentPrinciple = null;
  let currentDomain = null;

  function flushPrinciple() {
    if (currentPrinciple) {
      currentPrinciple.description = currentPrinciple.description.trim();
      principles.push(currentPrinciple);
    }
    currentPrinciple = null;
  }

  function flushDomain() {
    if (currentDomain) {
      domains.push(currentDomain);
    }
    currentDomain = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // h2 sections
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushPrinciple();
      flushDomain();
      const heading = line.replace(/^## /, '').trim();
      if (heading.match(/vision/i)) section = 'vision';
      else if (heading.match(/strategy/i)) section = 'strategy';
      else if (heading.match(/principle/i)) section = 'principles';
      else if (heading.match(/domain/i)) section = 'domains';
      else if (heading.match(/value/i)) section = 'value_props';
      else if (heading.match(/question/i)) section = 'questions';
      continue;
    }

    // Vision paragraph
    if (section === 'vision') {
      if (line.trim() && !line.startsWith('<!--')) vision += line + '\n';
      continue;
    }

    // Strategy paragraph
    if (section === 'strategy') {
      if (line.trim() && !line.startsWith('<!--')) strategy += line + '\n';
      continue;
    }

    // Principles
    if (section === 'principles') {
      const principleHeader = line.match(/^### (.+)/);
      if (principleHeader) {
        flushPrinciple();
        currentPrinciple = {
          name: principleHeader[1].trim(),
          operates_at: [],
          description: '',
          refs: [],
        };
        continue;
      }

      if (currentPrinciple) {
        const operates = line.match(/^\*?\*?-?\s*\*?\*?Operates at:\*?\*?\s*(.+)/i);
        if (operates) {
          currentPrinciple.operates_at = operates[1].split(/[,/]/).map(s => s.trim()).filter(Boolean);
          continue;
        }
        const desc = line.match(/^\*?\*?-?\s*\*?\*?Description:\*?\*?\s*(.+)/i);
        if (desc) {
          currentPrinciple.description = desc[1].trim();
          continue;
        }
        const refs = line.match(/^\*?\*?-?\s*\*?\*?Refs:\*?\*?\s*(.+)/i);
        if (refs) {
          currentPrinciple.refs = (refs[1].match(/\[IG-[A-Za-z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
          continue;
        }
        if (line.trim() && !line.startsWith('<!--') && !line.startsWith('-')) {
          currentPrinciple.description += line + '\n';
        }
      }
    }

    // Domains
    if (section === 'domains') {
      const domainHeader = line.match(/^### (.+)/);
      if (domainHeader) {
        flushDomain();
        currentDomain = {
          name: domainHeader[1].trim(),
          lead_pillar: null,
          refs: [],
        };
        continue;
      }

      if (currentDomain) {
        const pillar = line.match(/^\*?\*?-?\s*\*?\*?Lead pillar:\*?\*?\s*(.+)/i);
        if (pillar) {
          currentDomain.lead_pillar = pillar[1].trim();
          continue;
        }
        const refs = line.match(/^\*?\*?-?\s*\*?\*?Refs:\*?\*?\s*(.+)/i);
        if (refs) {
          currentDomain.refs = (refs[1].match(/\[IG-[A-Za-z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
          continue;
        }
      }
    }

    // Value propositions
    if (section === 'value_props') {
      if (line.match(/^[-*]\s+/) && !line.startsWith('<!--')) {
        const text = line.replace(/^[-*]\s+/, '').trim();
        const refs = (text.match(/\[IG-[A-Za-z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
        value_props.push({ text, refs });
      }
    }

    // Open questions
    if (section === 'questions') {
      const question = line.match(/^- \[([ x])\]\s*(.+)/);
      if (question) {
        const cfMatch = question[2].match(/\[CF-\d+\]/);
        open_questions.push({
          text: question[2].replace(/\s*—\s*\[CF-\d+\]/, '').trim(),
          resolved: question[1] === 'x',
          conflict_ref: cfMatch ? cfMatch[0].replace(/[\[\]]/g, '') : null,
        });
      }
    }
  }

  flushPrinciple();
  flushDomain();

  return {
    vision: vision.trim() || null,
    strategy: strategy.trim() || null,
    principles,
    domains,
    value_props,
    open_questions,
  };
}
