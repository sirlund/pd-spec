import React from 'react';

export default function Dashboard({ data, loading, onNavigate }) {
  if (loading || !data) {
    return <div className="empty-state"><div className="empty-state-text">Loading dashboard...</div></div>;
  }

  const { pipeline, status_distribution, categories } = data;
  const extractionProgress = pipeline.sources > 0
    ? Math.round((pipeline.extracted / pipeline.sources) * 100)
    : 0;
  const conflictProgress = pipeline.conflicts > 0
    ? Math.round((pipeline.conflicts_resolved / pipeline.conflicts) * 100)
    : 0;

  // Empty state
  if (pipeline.sources === 0 && pipeline.insights === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">◫</div>
        <div className="empty-state-title">No research data yet</div>
        <div className="empty-state-text">
          Add source files to <code>01_Sources/</code> and run <code>/extract</code> to get started.
        </div>
      </div>
    );
  }

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

      {/* Progress bars */}
      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Extraction Progress</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              {pipeline.extracted}/{pipeline.sources} files ({extractionProgress}%)
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${extractionProgress}%`, background: 'var(--color-accent)' }}
            />
          </div>
        </div>

        {pipeline.conflicts > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Conflict Resolution</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {pipeline.conflicts_resolved}/{pipeline.conflicts} resolved ({conflictProgress}%)
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${conflictProgress}%`,
                  background: conflictProgress === 100 ? 'var(--color-verified-fg)' : 'var(--color-pending-fg)',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Insight status distribution */}
      {status_distribution && Object.keys(status_distribution).length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
            Insight Status
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {Object.entries(status_distribution).map(([status, count]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12, marginTop: 0 }}>
            Insight Categories
          </h3>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <span
                key={cat}
                className="filter-btn"
                onClick={() => onNavigate && onNavigate(null)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{sub}</div>}
    </div>
  );
}
