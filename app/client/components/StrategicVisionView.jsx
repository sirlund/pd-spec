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
                  {p.operates_at.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {p.operates_at.map(layer => (
                        <span key={layer} className="badge badge-id" style={{ fontSize: '0.65rem', cursor: 'default' }}>
                          {layer}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.description && (
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                      {p.description}
                    </p>
                  )}
                  {p.refs.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
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
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Lead pillar: <strong>{d.lead_pillar}</strong>
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
          <div className="label-mono" style={{ marginBottom: 12 }}>Value Propositions</div>
          {data.value_props.map((vp, i) => (
            <div key={i} style={{
              padding: '8px 0', borderBottom: '1px solid var(--border-subtle)',
              fontSize: '0.85rem', display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
              <span style={{ color: 'var(--text-main)', flex: 1 }}>
                <RichText text={vp.text} onNavigate={onNavigate} />
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Open Questions */}
      {data.open_questions.length > 0 && (
        <div>
          <div className="label-mono" style={{ marginBottom: 12 }}>Open Questions</div>
          {data.open_questions.map((q, i) => (
            <div key={i} style={{
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
          ))}
        </div>
      )}
    </div>
  );
}

// Render text with inline [IG-XX] / [CF-XX] as clickable badges
function RichText({ text, onNavigate }) {
  const parts = text.split(/(\[(?:IG-[A-Za-z0-9-]+|CF-\d+)\])/g);
  return (
    <span>
      {parts.map((part, i) => {
        const match = part.match(/^\[(IG-[A-Za-z0-9-]+|CF-\d+)\]$/);
        if (match) {
          return <IdBadge key={i} id={match[1]} onClick={() => onNavigate?.(match[1])} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
