/**
 * Parser for PROPOSALS.md → JSON
 *
 * Format:
 * ## Domain: [name]
 * ### [DP-XX] [Name]
 * **Type:** module | feature
 * **Domain:** [name]
 * **Status:** PROPOSED | VALIDATED | BUILDING | SHIPPED
 * **Grounded in:** [IG-XX], [IG-XX]
 * **Parent:** [DP-XX]
 * **Design implications:** - list
 * **Acceptance criteria:** - list
 * **Open questions:** - list
 */

export function parseProposals(content) {
  if (!content) return { proposals: [], domains: [] };

  const lines = content.split('\n');
  let currentDomain = null;
  let currentProposal = null;
  let collectingField = null; // 'implications' | 'criteria' | 'questions'
  const proposals = [];
  const domains = new Set();

  function flushProposal() {
    if (currentProposal) {
      proposals.push(currentProposal);
    }
    currentProposal = null;
    collectingField = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Domain header
    const domainMatch = line.match(/^## Domain:\s*(.+)/);
    if (domainMatch) {
      flushProposal();
      currentDomain = domainMatch[1].trim();
      domains.add(currentDomain);
      continue;
    }

    // Proposal header
    const proposalMatch = line.match(/^### \[(DP-\d+)\]\s*(.+)/);
    if (proposalMatch) {
      flushProposal();
      currentProposal = {
        id: proposalMatch[1],
        name: proposalMatch[2].trim(),
        type: null,
        domain: currentDomain,
        status: null,
        grounded_in: [],
        parent: null,
        implications: [],
        criteria: [],
        questions: [],
      };
      continue;
    }

    if (!currentProposal) continue;

    // Metadata fields
    const typeMatch = line.match(/^\*\*Type:\*\*\s*(.+)/);
    if (typeMatch) { currentProposal.type = typeMatch[1].trim(); collectingField = null; continue; }

    const domainField = line.match(/^\*\*Domain:\*\*\s*(.+)/);
    if (domainField) {
      currentProposal.domain = domainField[1].trim();
      domains.add(currentProposal.domain);
      collectingField = null;
      continue;
    }

    const statusMatch = line.match(/^\*\*Status:\*\*\s*(.+)/);
    if (statusMatch) { currentProposal.status = statusMatch[1].trim(); collectingField = null; continue; }

    const groundedMatch = line.match(/^\*\*Grounded in:\*\*\s*(.+)/);
    if (groundedMatch) {
      currentProposal.grounded_in = (groundedMatch[1].match(/\[IG-[A-Za-z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
      collectingField = null;
      continue;
    }

    const parentMatch = line.match(/^\*\*Parent:\*\*\s*(.+)/);
    if (parentMatch) {
      const dpRef = parentMatch[1].match(/\[?(DP-\d+)\]?/);
      currentProposal.parent = dpRef ? dpRef[1] : parentMatch[1].trim();
      collectingField = null;
      continue;
    }

    if (line.match(/^\*\*Design implications:\*\*/)) { collectingField = 'implications'; continue; }
    if (line.match(/^\*\*Acceptance criteria:\*\*/)) { collectingField = 'criteria'; continue; }
    if (line.match(/^\*\*Open questions:\*\*/)) { collectingField = 'questions'; continue; }

    // Collect list items
    if (collectingField && line.match(/^- /)) {
      const text = line.replace(/^- /, '').trim();
      currentProposal[collectingField].push(text);
      continue;
    }

    // Non-list line ends current collection
    if (collectingField && line.trim() && !line.startsWith('  ')) {
      collectingField = null;
    }
  }

  flushProposal();

  return {
    proposals,
    domains: [...domains],
  };
}
