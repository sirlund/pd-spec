import React from 'react';
import { useLiveData } from '../hooks.js';
import Card from './ui/Card.jsx';
import { IdBadge, StatusBadge } from './ui/Badge.jsx';
import AccentBox from './ui/AccentBox.jsx';
import Icon from './ui/Icon.jsx';

export default function SystemMapView({ onNavigate }) {
  const { data, loading } = useLiveData('/system-map', ['SYSTEM_MAP']);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading system map...</div></div>;
  }

  if (!data || (!data.vision && data.modules.length === 0)) {
    return (
      <div className="empty-state">
        <Icon name="sitemap" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No system map yet</div>
        <div className="empty-state-text">
          Run <code>/synthesis</code> to generate the product system map.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">System Map</h1>
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

      {/* Modules */}
      {data.modules.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>
            Modules ({data.modules.length})
          </div>
          {data.modules.map((mod, i) => (
            <Card key={i} accent={mod.blocker ? 'conflict' : mod.status === 'Ready' ? 'verified' : 'pending'}>
              <div className="card-header">
                <span className="card-title">{mod.name}</span>
                {mod.status && <StatusBadge status={mod.status} />}
              </div>

              {mod.refs.length > 0 && (
                <div style={{ marginBottom: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {mod.refs.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}

              {mod.implications.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Design Implications
                  </div>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, margin: 0 }}>
                    {mod.implications.map((imp, j) => (
                      <li key={j} style={{ marginBottom: 3 }}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {mod.blocker && (
                <div style={{
                  marginTop: 8, padding: '8px 12px', borderRadius: 'var(--radius)',
                  background: 'var(--conflict-bg)', fontSize: '0.82rem', color: 'var(--conflict-fg)',
                }}>
                  <strong>Blocker:</strong> {mod.blocker}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Design Principles */}
      {data.principles.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>Design Principles</div>
          {data.principles.map((p, i) => (
            <Card key={i}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600,
                  color: 'var(--accent-cyan)', flexShrink: 0, lineHeight: '1.6',
                }}>
                  {i + 1}.
                </span>
                <div>
                  <div className="card-title">{p.name}</div>
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
