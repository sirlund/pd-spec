import React from 'react';
import { useLiveData } from '../hooks.js';
import Card from './ui/Card.jsx';
import { IdBadge, StatusBadge } from './ui/Badge.jsx';
import AccentBox from './ui/AccentBox.jsx';
import Icon from './ui/Icon.jsx';

export default function StrategicVisionView({ onNavigate }) {
  const { data, loading } = useLiveData('/strategic-vision', ['STRATEGIC_VISION']);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading strategic vision...</div></div>;
  }

  if (!data || (!data.vision && data.principles.length === 0 && data.domains.length === 0)) {
    return (
      <div className="empty-state">
        <Icon name="sitemap" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No strategic vision yet</div>
        <div className="empty-state-text">
          Run <code>/spec</code> to generate the strategic vision.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Strategic Vision</h1>
      </div>

      {/* Vision */}
      {data.vision && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 8 }}>Product Vision</div>
          <AccentBox>
            <RichText text={data.vision} onNavigate={onNavigate} />
          </AccentBox>
        </div>
      )}

      {/* Strategy */}
      {data.strategy && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 8 }}>Product Strategy</div>
          <AccentBox>
            <RichText text={data.strategy} onNavigate={onNavigate} />
          </AccentBox>
        </div>
      )}

      {/* Design Principles */}
      {data.principles.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>Design Principles ({data.principles.length})</div>
          {data.principles.map((p, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600,
                  color: 'var(--accent-cyan)', flexShrink: 0, lineHeight: '1.6',
                }}>
                  {i + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  <div className="card-title">{p.name}</div>
                  {p.role && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
                      {p.role}
                    </div>
                  )}
                  {p.operates_at.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.operates_at.map(layer => (
                        <span key={layer} className="badge badge-id" style={{ fontSize: '0.65rem', cursor: 'default' }}>
                          {layer}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.primary_domain && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      Domain: <strong>{p.primary_domain}</strong>
                    </div>
                  )}
                  {p.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '6px 0 0', lineHeight: '1.5' }}>
                      {p.description}
                    </p>
                  )}
                  {p.design_question && (
                    <div style={{
                      marginTop: 8, padding: '6px 10px',
                      borderLeft: '2px solid var(--accent-cyan)',
                      fontSize: '0.78rem', color: 'var(--accent-cyan)',
                      fontStyle: 'italic',
                    }}>
                      {p.design_question}
                    </div>
                  )}
                  {p.refs.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.refs.map(ref => (
                        <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Internal Design Criteria */}
      {data.internal_criteria && data.internal_criteria.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>Internal Design Criteria ({data.internal_criteria.length})</div>
          {data.internal_criteria.map((c, i) => (
            <Card key={i}>
              <div className="card-title" style={{ fontSize: '0.9rem' }}>{c.name}</div>
              {c.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0', lineHeight: '1.5' }}>
                  {c.description}
                </p>
              )}
              {c.refs.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {c.refs.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Operational Domains */}
      {data.domains.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>
            Operational Domains ({data.domains.length})
          </div>
          {data.domains.map((d, i) => (
            <Card key={i}>
              <div className="card-header">
                <span className="card-title">{d.name}</span>
              </div>
              {d.lead_pillar && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  Lead pillar: <strong>{d.lead_pillar}</strong>
                </div>
              )}
              {d.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 4px', lineHeight: '1.5' }}>
                  {d.description}
                </p>
              )}
              {d.cases && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                  <strong>Cases:</strong> {d.cases}
                </div>
              )}
              {d.refs.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {d.refs.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Value Propositions */}
      {data.value_props.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>Value Propositions ({data.value_props.length})</div>
          {data.value_props.map((vp, i) => (
            <Card key={i}>
              {vp.title && <div className="card-title" style={{ fontSize: '0.9rem', marginBottom: 4 }}>{vp.title}</div>}
              {vp.quote && (
                <div style={{
                  padding: '6px 10px', marginBottom: 6,
                  borderLeft: '2px solid var(--accent-cyan)',
                  fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--accent-cyan)',
                }}>
                  "{vp.quote}"
                </div>
              )}
              {vp.description && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  <RichText text={vp.description} onNavigate={onNavigate} />
                </p>
              )}
              {vp.refs.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {vp.refs.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Open Questions */}
      {data.open_questions.length > 0 && (
        <div>
          <div className="label-mono" style={{ marginBottom: 12 }}>Open Questions ({data.open_questions.length})</div>
          <QuestionList questions={data.open_questions} onNavigate={onNavigate} />
        </div>
      )}
    </div>
  );
}

// Group questions by category and render
function QuestionList({ questions, onNavigate }) {
  const hasCategories = questions.some(q => q.category);

  if (!hasCategories) {
    return questions.map((q, i) => <QuestionItem key={i} q={q} onNavigate={onNavigate} />);
  }

  const groups = [];
  let currentCat = null;
  let currentItems = [];
  for (const q of questions) {
    if (q.category !== currentCat) {
      if (currentItems.length) groups.push({ category: currentCat, items: currentItems });
      currentCat = q.category;
      currentItems = [];
    }
    currentItems.push(q);
  }
  if (currentItems.length) groups.push({ category: currentCat, items: currentItems });

  return groups.map((g, gi) => (
    <div key={gi} style={{ marginBottom: 12 }}>
      {g.category && (
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
          {g.category}
        </div>
      )}
      {g.items.map((q, i) => <QuestionItem key={i} q={q} onNavigate={onNavigate} />)}
    </div>
  ));
}

function QuestionItem({ q, onNavigate }) {
  return (
    <div style={{
      display: 'flex', gap: 10, alignItems: 'flex-start',
      padding: '8px 0', borderBottom: '1px solid var(--border-subtle)',
      fontSize: '0.85rem',
    }}>
      <span style={{ color: q.resolved ? 'var(--verified-fg)' : 'var(--text-muted)', flexShrink: 0 }}>
        <Icon name={q.resolved ? 'check' : 'x'} size={16} />
      </span>
      <span style={{ color: 'var(--text-main)', flex: 1 }}>{q.text}</span>
      {q.conflict_ref && (
        <IdBadge id={q.conflict_ref} onClick={() => onNavigate?.(q.conflict_ref)} />
      )}
    </div>
  );
}

// Render markdown text with line structure, bold, headings, blockquotes, and [IG-XX] badges
function RichText({ text, onNavigate }) {
  if (!text) return null;
  const lines = text.split('\n');

  return (
    <div style={{ lineHeight: '1.6' }}>
      {lines.map((line, li) => {
        if (!line.trim()) return <div key={li} style={{ height: 8 }} />;

        // ### heading
        const h3 = line.match(/^###\s+(.+)/);
        if (h3) {
          return (
            <div key={li} style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: 12, marginBottom: 4, color: 'var(--text-main)' }}>
              <InlineRich text={h3[1]} onNavigate={onNavigate} />
            </div>
          );
        }

        // > blockquote
        if (line.startsWith('>')) {
          const content = line.replace(/^>\s*/, '');
          return (
            <div key={li} style={{
              borderLeft: '2px solid var(--accent-cyan)', paddingLeft: 10,
              fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--accent-cyan)',
              margin: '4px 0',
            }}>
              <InlineRich text={content} onNavigate={onNavigate} />
            </div>
          );
        }

        // | table row — render monospace
        if (line.startsWith('|')) {
          // Skip separator rows like |---|---|
          if (line.match(/^\|[\s-|]+\|$/)) return null;
          return (
            <div key={li} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'pre' }}>
              {line}
            </div>
          );
        }

        // Regular line
        return (
          <div key={li} style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
            <InlineRich text={line} onNavigate={onNavigate} />
          </div>
        );
      })}
    </div>
  );
}

// Inline: bold + italic + [IG-XX]/[CF-XX] badges
function InlineRich({ text, onNavigate }) {
  // Split on [IG-XX], [CF-XX], **bold**, and *italic*
  const parts = text.split(/(\[(?:IG-[A-Za-z0-9-]+|CF-\d+)\]|\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        // [IG-XX] or [CF-XX] badge
        const refMatch = part.match(/^\[(IG-[A-Za-z0-9-]+|CF-\d+)\]$/);
        if (refMatch) {
          return <IdBadge key={i} id={refMatch[1]} onClick={() => onNavigate?.(refMatch[1])} />;
        }
        // **bold**
        const boldMatch = part.match(/^\*\*(.+)\*\*$/);
        if (boldMatch) {
          return <strong key={i}>{boldMatch[1]}</strong>;
        }
        // *italic*
        const italicMatch = part.match(/^\*([^*]+)\*$/);
        if (italicMatch) {
          return <em key={i}>{italicMatch[1]}</em>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
