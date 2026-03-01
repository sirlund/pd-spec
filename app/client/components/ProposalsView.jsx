import React from 'react';
import { useLiveData } from '../hooks.js';
import Card from './ui/Card.jsx';
import { IdBadge, StatusBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';

const STATUS_ACCENT = {
  PROPOSED: 'pending',
  VALIDATED: 'verified',
  BUILDING: 'pending',
  SHIPPED: 'verified',
};

export default function ProposalsView({ onNavigate }) {
  const { data, loading } = useLiveData('/proposals', ['PROPOSALS']);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading proposals...</div></div>;
  }

  if (!data || data.proposals.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="layout-list" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No design proposals yet</div>
        <div className="empty-state-text">
          Run <code>/spec</code> to generate design proposals from verified insights.
        </div>
      </div>
    );
  }

  // Group proposals by domain
  const byDomain = {};
  for (const dp of data.proposals) {
    const domain = dp.domain || 'Uncategorized';
    if (!byDomain[domain]) byDomain[domain] = [];
    byDomain[domain].push(dp);
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Design Proposals</h1>
        <span className="badge badge-id" style={{ cursor: 'default' }}>
          {data.proposals.length} proposals
        </span>
      </div>

      {Object.entries(byDomain).map(([domain, proposals]) => (
        <div key={domain} style={{ marginBottom: 24 }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>
            Domain: {domain} ({proposals.length})
          </div>
          {proposals.map((dp) => (
            <Card key={dp.id} accent={STATUS_ACCENT[dp.status] || 'pending'}>
              <div className="card-header">
                <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className="badge badge-id">{dp.id}</span>
                  <span className="card-title">{dp.name}</span>
                </span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {dp.type && (
                    <span className="badge badge-subtle">{dp.type}</span>
                  )}
                  {dp.status && <StatusBadge status={dp.status} />}
                </div>
              </div>

              {dp.parent && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Parent: <span className="badge badge-id" style={{ fontSize: '0.65rem' }}>{dp.parent}</span>
                </div>
              )}

              {dp.grounded_in.length > 0 && (
                <div style={{ marginBottom: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {dp.grounded_in.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}

              {dp.implications.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Design Implications
                  </div>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, margin: 0 }}>
                    {dp.implications.map((imp, j) => (
                      <li key={j} style={{ marginBottom: 3 }}>{imp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {dp.criteria.length > 0 && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Acceptance Criteria
                  </div>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, margin: 0 }}>
                    {dp.criteria.map((ac, j) => (
                      <li key={j} style={{ marginBottom: 3 }}>{ac}</li>
                    ))}
                  </ul>
                </div>
              )}

              {dp.questions.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: 4 }}>
                    Open Questions
                  </div>
                  <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, margin: 0 }}>
                    {dp.questions.map((q, j) => (
                      <li key={j} style={{ marginBottom: 3 }}>{q}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
