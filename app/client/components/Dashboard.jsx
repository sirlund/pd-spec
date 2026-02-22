import React from 'react';
import Icon from './ui/Icon.jsx';
import Card from './ui/Card.jsx';
import StatCard from './ui/StatCard.jsx';
import ProgressBar from './ui/ProgressBar.jsx';
import AccentBox from './ui/AccentBox.jsx';

const EXPECTED_SOURCE_TYPES = [
  'Entrevistas', 'Workshops', 'Benchmarks',
  'Analytics', 'Documentos estratégicos', 'Datos financieros',
];

const AUTHORITY_TIERS = {
  'Tier 1 (Direct Quote)': { label: 'Tier 1: Direct Quotes', short: 'T1' },
  'Tier 2 (Stakeholder Observation)': { label: 'Tier 2: Observations', short: 'T2' },
  'Tier 3 (Hypothesis)': { label: 'Tier 3: Hypotheses', short: 'T3' },
  'Tier 4 (Vision/Aspiration)': { label: 'Tier 4: Vision', short: 'T4' },
};

export default function Dashboard({ data, loading, onNavigate, setView }) {
  if (loading || !data) {
    return <div className="empty-state"><div className="empty-state-text">Loading dashboard...</div></div>;
  }

  const { pipeline, status_distribution, authority_distribution, categories } = data;

  if (pipeline.sources === 0 && pipeline.insights === 0) {
    return (
      <div className="empty-state">
        <Icon name="layout-dashboard" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No research data yet</div>
        <div className="empty-state-text">
          Add source files to <code>01_Sources/</code> and run <code>/extract</code> to get started.
        </div>
      </div>
    );
  }

  const extractionPct = pipeline.sources > 0 ? Math.round((pipeline.extracted / pipeline.sources) * 100) : 0;
  const pendingInsights = status_distribution?.PENDING || 0;
  const unresolvedConflicts = pipeline.conflicts - pipeline.conflicts_resolved;
  const gapCount = data.evidence_gap_count || 0;

  // Source diversity from folder names
  const sourceFolders = data.source_folders || [];

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Dashboard</h1>
      </div>

      {/* Pipeline stats */}
      <div className="stat-grid">
        <StatCard value={pipeline.sources} label="Sources" />
        <StatCard value={pipeline.claims} label="Claims" />
        <StatCard value={pipeline.insights} label="Insights" />
        <StatCard
          value={pipeline.conflicts}
          label="Conflicts"
          sub={pipeline.conflicts_resolved > 0 ? `${pipeline.conflicts_resolved} resolved` : null}
        />
      </div>

      {/* Research Maturity Bar */}
      {status_distribution && Object.keys(status_distribution).length > 0 && (
        <Card>
          <div className="label-mono" style={{ marginBottom: 10 }}>Research Maturity</div>
          <ProgressBar
            legend
            segments={[
              { value: status_distribution.VERIFIED || 0, color: 'var(--verified-fg)', label: 'Verified' },
              { value: status_distribution.PENDING || 0, color: 'var(--pending-fg)', label: 'Pending' },
              { value: status_distribution.MERGED || 0, color: 'var(--merged-fg)', label: 'Merged' },
              { value: status_distribution.INVALIDATED || 0, color: 'var(--invalidated-fg)', label: 'Invalidated' },
            ]}
          />
        </Card>
      )}

      {/* Extraction progress */}
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="label-mono">Extraction Progress</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {pipeline.extracted}/{pipeline.sources} ({extractionPct}%)
          </span>
        </div>
        <ProgressBar segments={[{ value: extractionPct, color: 'var(--accent-cyan)' }, { value: 100 - extractionPct, color: 'transparent' }]} />
      </Card>

      {/* Authority Distribution */}
      {authority_distribution && Object.keys(authority_distribution).length > 0 && (
        <Card>
          <div className="label-mono" style={{ marginBottom: 10 }}>Authority Distribution</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(authority_distribution).map(([tier, count]) => {
              const info = AUTHORITY_TIERS[tier] || { label: tier, short: tier.slice(0, 2) };
              return (
                <div key={tier} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="badge badge-subtle">{info.short}</span>
                  <span style={{ fontSize: '0.82rem' }}>{info.label}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Source Diversity */}
      {sourceFolders.length > 0 && (
        <Card>
          <div className="label-mono" style={{ marginBottom: 10 }}>Source Diversity</div>
          <div className="diversity-grid">
            {EXPECTED_SOURCE_TYPES.map((type) => {
              const present = sourceFolders.some(f =>
                f.toLowerCase().includes(type.toLowerCase().slice(0, 5))
              );
              return (
                <div key={type} className={`diversity-item ${present ? 'present' : 'missing'}`}>
                  {type}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <Card>
          <div className="label-mono" style={{ marginBottom: 10 }}>Insight Categories</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <span key={cat} className="filter-btn" onClick={() => setView?.('insights')}>
                {cat}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Links */}
      {(pendingInsights > 0 || unresolvedConflicts > 0 || gapCount > 0) && (
        <Card>
          <div className="label-mono" style={{ marginBottom: 10 }}>Action Items</div>
          <div className="quick-links">
            {pendingInsights > 0 && (
              <span className="quick-link" onClick={() => setView?.('insights')}>
                {pendingInsights} pending insight{pendingInsights !== 1 ? 's' : ''}
              </span>
            )}
            {unresolvedConflicts > 0 && (
              <span className="quick-link" onClick={() => setView?.('conflicts')}>
                {unresolvedConflicts} unresolved conflict{unresolvedConflicts !== 1 ? 's' : ''}
              </span>
            )}
            {gapCount > 0 && (
              <span className="quick-link" onClick={() => setView?.('evidence-gaps')}>
                {gapCount} evidence gap{gapCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
