import React, { useState, useEffect, useRef } from 'react';
import { useLiveData } from '../hooks.js';
import InsightCard from './InsightCard.jsx';
import Icon from './ui/Icon.jsx';

const ACTIVE_STATUSES = new Set(['VERIFIED', 'PENDING']);

function isActiveInsight(insight) {
  // Parse base status (before any "—reason" suffix)
  const base = insight.status?.split('—')[0].trim();
  return ACTIVE_STATUSES.has(base);
}

export default function InsightsView({ highlightId, onHighlightClear, onNavigate, decisions, onDecision }) {
  const { data, loading } = useLiveData('/insights', ['INSIGHTS_GRAPH']);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [archivedOpen, setArchivedOpen] = useState(false);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => onHighlightClear?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, data]);

  if (!data) {
    return <div className="empty-state"><div className="empty-state-text">Loading insights...</div></div>;
  }

  if (data.insights.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="diamond" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No insights yet</div>
        <div className="empty-state-text">
          Run <code>/extract</code> then <code>/analyze</code> to generate insights.
        </div>
      </div>
    );
  }

  const statuses = [...new Set(data.insights.map(i => i.status?.split('—')[0].trim()))];
  const categories = data.categories || [];

  const filtered = data.insights.filter(i => {
    const base = i.status?.split('—')[0].trim();
    if (statusFilter !== 'all' && base !== statusFilter) return false;
    if (categoryFilter !== 'all' && i.category_group !== categoryFilter) return false;
    return true;
  });

  const active = filtered.filter(isActiveInsight);
  const archived = filtered.filter(i => !isActiveInsight(i));

  const renderCard = (insight) => (
    <div
      key={insight.id}
      ref={highlightId === insight.id ? highlightRef : null}
      style={{
        transition: 'box-shadow 0.3s',
        boxShadow: highlightId === insight.id ? '0 0 0 2px var(--accent-cyan)' : 'none',
        borderRadius: 'var(--radius)',
      }}
    >
      <InsightCard
        insight={insight}
        onNavigate={onNavigate}
        decision={decisions?.[insight.id]}
        onDecision={onDecision}
        willExitFilter={statusFilter !== 'all'}
      />
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Insights ({data.insights.length})</h1>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All
        </button>
        {statuses.map(s => (
          <button key={s} className={`filter-btn ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
            {s}
          </button>
        ))}
      </div>

      {categories.length > 1 && (
        <div className="filter-bar">
          <button className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`} onClick={() => setCategoryFilter('all')}>
            All categories
          </button>
          {categories.map(c => (
            <button key={c} className={`filter-btn ${categoryFilter === c ? 'active' : ''}`} onClick={() => setCategoryFilter(c)} title={c} style={{ whiteSpace: 'normal', textAlign: 'left' }}>
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Active insights */}
      {active.map(renderCard)}

      {/* Archived section */}
      {archived.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setArchivedOpen(!archivedOpen)}
            style={{ fontSize: '0.82rem', marginBottom: archivedOpen ? 8 : 0 }}
          >
            <Icon name="chevron-down" size={14} style={archivedOpen ? { transform: 'rotate(180deg)' } : {}} />
            Archived ({archived.length})
          </button>
          {archivedOpen && archived.map(renderCard)}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">No insights match the current filters.</div>
        </div>
      )}
    </div>
  );
}
