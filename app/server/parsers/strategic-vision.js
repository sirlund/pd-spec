/**
 * Parser for STRATEGIC_VISION.md → JSON
 *
 * Handles both English and Spanish headings/field names.
 *
 * Sections:
 * ## Product Vision / Visión de Producto — paragraph
 * ## Product Strategy / Estrategia de Producto — paragraph (with subsections)
 * ## Design Principles / Pilares — h3 entries with Opera en, Refs, body
 * ## Internal Design Criteria / Criterios de Diseño Internos — h3 entries with body
 * ## Operational Domains / Dominios Operativos — h3 entries with Lead pillar, Refs
 * ## Value Propositions / Propuestas de Valor — h3 entries with quote + body
 * ## Open Questions — checkbox list (with optional h3 category groups)
 */

export function parseStrategicVision(content) {
  if (!content) return { vision: null, strategy: null, principles: [], internal_criteria: [], domains: [], value_props: [], open_questions: [] };

  const lines = content.split('\n');
  let section = null;
  let vision = '';
  let strategy = '';
  const principles = [];
  const internal_criteria = [];
  const domains = [];
  const value_props = [];
  const open_questions = [];
  let currentPrinciple = null;
  let currentCriteria = null;
  let currentDomain = null;
  let currentValueProp = null;
  let questionCategory = null;

  function extractRefs(text) {
    return (text.match(/\[IG-[A-Za-z0-9-]+\]/g) || []).map(r => r.replace(/[\[\]]/g, ''));
  }

  function flushPrinciple() {
    if (currentPrinciple) {
      currentPrinciple.description = currentPrinciple.description.trim();
      if (!currentPrinciple.refs.length) {
        currentPrinciple.refs = extractRefs(currentPrinciple.description);
      }
      principles.push(currentPrinciple);
    }
    currentPrinciple = null;
  }

  function flushCriteria() {
    if (currentCriteria) {
      currentCriteria.description = currentCriteria.description.trim();
      if (!currentCriteria.refs.length) {
        currentCriteria.refs = extractRefs(currentCriteria.description);
      }
      internal_criteria.push(currentCriteria);
    }
    currentCriteria = null;
  }

  function flushDomain() {
    if (currentDomain) {
      currentDomain.description = (currentDomain.description || '').trim();
      domains.push(currentDomain);
    }
    currentDomain = null;
  }

  function flushValueProp() {
    if (currentValueProp) {
      currentValueProp.description = currentValueProp.description.trim();
      if (!currentValueProp.refs.length) {
        currentValueProp.refs = extractRefs(currentValueProp.description);
      }
      value_props.push(currentValueProp);
    }
    currentValueProp = null;
  }

  function flushAll() {
    flushPrinciple();
    flushCriteria();
    flushDomain();
    flushValueProp();
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // h2 sections
    if (line.startsWith('## ') && !line.startsWith('### ')) {
      flushAll();
      const heading = line.replace(/^## /, '').trim();
      if (heading.match(/visi[oó]n/i)) section = 'vision';
      else if (heading.match(/strateg|estrateg/i)) section = 'strategy';
      else if (heading.match(/design principles|principios|pilares/i)) section = 'principles';
      else if (heading.match(/internal|criterios/i)) section = 'internal_criteria';
      else if (heading.match(/domain|dominio/i)) section = 'domains';
      else if (heading.match(/value prop|propuesta/i)) section = 'value_props';
      else if (heading.match(/question|pregunta/i)) section = 'questions';
      else section = null;
      continue;
    }

    // Skip HTML comments, separators, and blank-ish lines for accumulation
    if (line.startsWith('<!--') || line === '---') continue;

    // Vision paragraph — strip blockquote markers
    if (section === 'vision') {
      if (line.trim()) vision += line.replace(/^>\s*/, '') + '\n';
      continue;
    }

    // Strategy paragraph (including subsections as raw text)
    if (section === 'strategy') {
      if (line.trim()) strategy += line + '\n';
      continue;
    }

    // Principles (Design Principles / Pilares)
    if (section === 'principles') {
      const principleHeader = line.match(/^### (.+)/);
      if (principleHeader) {
        flushPrinciple();
        currentPrinciple = {
          name: principleHeader[1].trim(),
          role: null,
          operates_at: [],
          primary_domain: null,
          description: '',
          design_question: null,
          refs: [],
        };
        continue;
      }

      if (currentPrinciple) {
        // Operates at (EN) / Opera en (ES)
        const operates = line.match(/^\*?\*?-?\s*\*?\*?(?:Operates at|Opera en):\*?\*?\s*(.+)/i);
        if (operates) {
          currentPrinciple.operates_at = operates[1].split(/[,/+]/).map(s => s.replace(/\(.*?\)/g, '').trim()).filter(Boolean);
          continue;
        }
        // Role / Rol en el sistema
        const role = line.match(/^\*?\*?-?\s*\*?\*?(?:Role|Rol en el sistema):\*?\*?\s*(.+)/i);
        if (role) {
          currentPrinciple.role = role[1].trim();
          continue;
        }
        // Primary domain / Dominio primario
        const primaryDomain = line.match(/^\*?\*?-?\s*\*?\*?(?:Primary domain|Dominio primario):\*?\*?\s*(.+)/i);
        if (primaryDomain) {
          currentPrinciple.primary_domain = primaryDomain[1].trim();
          continue;
        }
        // Description (EN explicit field)
        const desc = line.match(/^\*?\*?-?\s*\*?\*?Description:\*?\*?\s*(.+)/i);
        if (desc) {
          currentPrinciple.description = desc[1].trim();
          continue;
        }
        // Refs
        const refs = line.match(/^\*?\*?-?\s*\*?\*?Refs:\*?\*?\s*(.+)/i);
        if (refs) {
          currentPrinciple.refs = extractRefs(refs[1]);
          continue;
        }
        // Design question (blockquote)
        const designQ = line.match(/^>\s*\*?\*?(?:Pregunta de diseño|Design question):\*?\*?\s*(.+)/i);
        if (designQ) {
          currentPrinciple.design_question = designQ[1].trim();
          continue;
        }
        // Body text → description
        if (line.trim()) {
          currentPrinciple.description += line + '\n';
        }
      }
      continue;
    }

    // Internal Design Criteria
    if (section === 'internal_criteria') {
      const criteriaHeader = line.match(/^### (.+)/);
      if (criteriaHeader) {
        flushCriteria();
        currentCriteria = {
          name: criteriaHeader[1].trim(),
          description: '',
          refs: [],
        };
        continue;
      }

      if (currentCriteria) {
        const refs = line.match(/^\*?\*?-?\s*\*?\*?Refs:\*?\*?\s*(.+)/i);
        if (refs) {
          currentCriteria.refs = extractRefs(refs[1]);
          continue;
        }
        if (line.trim()) {
          currentCriteria.description += line + '\n';
        }
      }
      continue;
    }

    // Domains
    if (section === 'domains') {
      const domainHeader = line.match(/^### (.+)/);
      if (domainHeader) {
        flushDomain();
        currentDomain = {
          name: domainHeader[1].trim(),
          lead_pillar: null,
          description: '',
          cases: null,
          refs: [],
        };
        continue;
      }

      if (currentDomain) {
        // Lead pillar (EN) / Pilar líder (ES)
        const pillar = line.match(/^\*?\*?-?\s*\*?\*?(?:Lead pillar|Pilar l[ií]der):\*?\*?\s*(.+)/i);
        if (pillar) {
          currentDomain.lead_pillar = pillar[1].trim();
          continue;
        }
        // Description / Descripción
        const desc = line.match(/^\*?\*?-?\s*\*?\*?(?:Description|Descripci[oó]n):\*?\*?\s*(.+)/i);
        if (desc) {
          currentDomain.description = desc[1].trim();
          continue;
        }
        // Cases / Casos
        const cases = line.match(/^\*?\*?-?\s*\*?\*?Casos:\*?\*?\s*(.+)/i);
        if (cases) {
          currentDomain.cases = cases[1].trim();
          continue;
        }
        // Refs
        const refs = line.match(/^\*?\*?-?\s*\*?\*?Refs:\*?\*?\s*(.+)/i);
        if (refs) {
          currentDomain.refs = extractRefs(refs[1]);
          continue;
        }
      }
      continue;
    }

    // Value propositions (h3-based or list-based)
    if (section === 'value_props') {
      const vpHeader = line.match(/^### (.+)/);
      if (vpHeader) {
        flushValueProp();
        currentValueProp = {
          title: vpHeader[1].trim(),
          quote: null,
          description: '',
          refs: [],
        };
        continue;
      }

      if (currentValueProp) {
        // Blockquote (tagline)
        const quote = line.match(/^>\s*(.+)/);
        if (quote) {
          currentValueProp.quote = quote[1].replace(/\*+/g, '').replace(/^"|"$/g, '').trim();
          continue;
        }
        if (line.trim()) {
          currentValueProp.description += line + '\n';
        }
        continue;
      }

      // Fallback: simple list items (EN template format)
      if (line.match(/^[-*]\s+/) && !line.startsWith('<!--')) {
        const text = line.replace(/^[-*]\s+/, '').trim();
        const refs = extractRefs(text);
        value_props.push({ text, title: null, quote: null, description: text, refs });
      }
      continue;
    }

    // Open questions (with optional h3 category groups)
    if (section === 'questions') {
      const catHeader = line.match(/^### (.+)/);
      if (catHeader) {
        questionCategory = catHeader[1].trim();
        continue;
      }
      const question = line.match(/^- \[([ x])\]\s*(.+)/);
      if (question) {
        const cfMatch = question[2].match(/\[CF-\d+\]/);
        const igRefs = extractRefs(question[2]);
        open_questions.push({
          text: question[2].replace(/\s*[→—]\s*\[CF-\d+\]/, '').trim(),
          resolved: question[1] === 'x',
          conflict_ref: cfMatch ? cfMatch[0].replace(/[\[\]]/g, '') : null,
          insight_refs: igRefs,
          category: questionCategory,
        });
      }
      continue;
    }
  }

  flushAll();

  return {
    vision: vision.trim() || null,
    strategy: strategy.trim() || null,
    principles,
    internal_criteria,
    domains,
    value_props,
    open_questions,
  };
}
