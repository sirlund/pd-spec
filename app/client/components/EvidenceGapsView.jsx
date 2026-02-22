import React from 'react';
import { useLiveData } from '../hooks.js';
import Card from './ui/Card.jsx';
import { IdBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';

const GAP_TYPE_LABELS = {
  'claim-level': 'Claim-Level',
  'source-diversity': 'Source-Diversity',
  'category-gap': 'Category Gap',
};

export default function EvidenceGapsView({ onNavigate }) {
  const { data, loading } = useLiveData('/evidence-gaps', ['02_Work/']);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Computing evidence gaps...</div></div>;
  }

  if (!data || !data.gaps || data.gaps.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="alert-triangle" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No evidence gaps detected</div>
        <div className="empty-state-text">
          All insights have adequate source support. Gaps appear when insights have single-source evidence
          or when source categories are underrepresented.
        </div>
      </div>
    );
  }

  // Group by type
  const grouped = {};
  for (const gap of data.gaps) {
    if (!grouped[gap.type]) grouped[gap.type] = [];
    grouped[gap.type].push(gap);
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Evidence Gaps ({data.gaps.length})</h1>
      </div>

      <div style={{ marginBottom: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        Auto-computed structural gaps. For deeper analysis, use <code>/audit</code>.
      </div>

      {Object.entries(grouped).map(([type, gaps]) => (
        <div key={type} style={{ marginBottom: 24 }}>
          <div className="label-mono" style={{ marginBottom: 10 }}>
            {GAP_TYPE_LABELS[type] || type} ({gaps.length})
          </div>
          {gaps.map((gap, i) => (
            <Card key={i}>
              <div className="card-body">
                <p style={{ margin: 0, color: 'var(--text-main)' }}>{gap.description}</p>
                {gap.suggestion && (
                  <p style={{ margin: '8px 0 0', fontStyle: 'italic', fontSize: '0.8rem' }}>
                    {gap.suggestion}
                  </p>
                )}
              </div>
              {gap.refs && gap.refs.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {gap.refs.map(ref => (
                    <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
