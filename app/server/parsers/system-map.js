/**
 * Parser for SYSTEM_MAP.md → JSON
 *
 * Format:
 * ## Product Vision — paragraph
 * ## Modules — h3 entries with Status, Refs, Design implications
 * ## Design Principles — numbered h3 entries
 * ## Open Questions — checkbox list
 */

export function parseSystemMap(content) {
  if (!content) return { vision: null, modules: [], principles: [], open_questions: [] };

  const lines = content.split('\n');
  let section = null; // 'vision' | 'modules' | 'principles' | 'questions'
  let vision = '';
  const modules = [];
  const principles = [];
  const open_questions = [];
  let currentModule = null;
  let currentPrinciple = null;
  let collectingImplications = false;

  function flushModule() {
    if (currentModule) modules.push(currentModule);
    currentModule = null;
    collectingImplications = false;
  }

  function flushPrinciple() {
    if (currentPrinciple) {
      currentPrinciple.description = currentPrinciple.description.trim();
      principles.push(currentPrinciple);
    }
    currentPrinciple = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // h2 sections
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushModule();
      flushPrinciple();
      const heading = line.replace(/^## /, '').trim();
      if (heading.match(/vision/i)) section = 'vision';
      else if (heading.match(/module/i)) section = 'modules';
      else if (heading.match(/principle/i)) section = 'principles';
      else if (heading.match(/question/i)) section = 'questions';
      continue;
    }

    // Vision paragraph
    if (section === 'vision') {
      if (line.trim()) vision += line + '\n';
      continue;
    }

    // Modules
    if (section === 'modules') {
      const moduleHeader = line.match(/^### Module:\s*(.+)/);
      if (moduleHeader) {
        flushModule();
        currentModule = {
          name: moduleHeader[1].trim(),
          status: null,
          refs: [],
          blocker: null,
          implications: [],
        };
        collectingImplications = false;
        continue;
      }

      if (currentModule) {
        const status = line.match(/^\*\*Status:\*\*\s*(\w+)/);
        if (status) { currentModule.status = status[1]; continue; }

        const refs = line.match(/^\*\*Refs:\*\*\s*(.+)/);
        if (refs) {
          currentModule.refs = (refs[1].match(/\[IG-[A-Z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
          continue;
        }

        const blocker = line.match(/^\*\*Blocker:\*\*\s*(.+)/);
        if (blocker) { currentModule.blocker = blocker[1].trim(); continue; }

        if (line.match(/^\*\*Design implications:\*\*/)) {
          collectingImplications = true;
          continue;
        }

        if (collectingImplications && line.match(/^- /)) {
          currentModule.implications.push(line.replace(/^- /, '').trim());
          continue;
        }
      }
    }

    // Principles
    if (section === 'principles') {
      const principleHeader = line.match(/^### \d+\.\s*(?:"([^"]+)"|(.+))/);
      if (principleHeader) {
        flushPrinciple();
        currentPrinciple = {
          name: principleHeader[1] || principleHeader[2].trim(),
          description: '',
          refs: [],
        };
        continue;
      }

      if (currentPrinciple) {
        const refs = line.match(/^\*\*Refs:\*\*\s*(.+)/);
        if (refs) {
          currentPrinciple.refs = (refs[1].match(/\[IG-[A-Z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
          continue;
        }
        if (line.trim()) currentPrinciple.description += line + '\n';
      }
    }

    // Open questions
    if (section === 'questions') {
      const question = line.match(/^- \[([ x])\]\s*(.+)/);
      if (question) {
        // Extract CF reference if present
        const cfMatch = question[2].match(/\[CF-\d+\]/);
        open_questions.push({
          text: question[2].replace(/\s*—\s*\[CF-\d+\]/, '').trim(),
          resolved: question[1] === 'x',
          conflict_ref: cfMatch ? cfMatch[0].replace(/[\[\]]/g, '') : null,
        });
      }
    }
  }

  flushModule();
  flushPrinciple();

  return {
    vision: vision.trim() || null,
    modules,
    principles,
    open_questions,
  };
}
