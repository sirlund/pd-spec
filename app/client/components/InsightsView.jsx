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
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showArchived, setShowArchived] = useState(false);
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

  // Categories from actual insight.category field (parsed, without temporal tag)
  const categories = [...new Set(data.insights.map(i => {
    if (!i.category) return null;
    return i.category.replace(/\s*\([^)]*\)\s*$/, '').trim();
  }).filter(Boolean))].sort();

  const filtered = data.insights.filter(i => {
    if (categoryFilter !== 'all') {
      const cat = i.category?.replace(/\s*\([^)]*\)\s*$/, '').trim();
      if (cat !== categoryFilter) return false;
    }
    return true;
  });

  const allActive = data.insights.filter(isActiveInsight);
  const allArchived = data.insights.filter(i => !isActiveInsight(i));
  const displayList = showArchived ? filtered.filter(i => !isActiveInsight(i)) : filtered.filter(isActiveInsight);

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
        willExitFilter={false}
      />
    </div>
  );

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Insights ({data.insights.length})</h1>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${!showArchived && categoryFilter === 'all' ? 'active' : ''}`} onClick={() => { setShowArchived(false); setCategoryFilter('all'); }}>
          All ({allActive.length})
        </button>
        {categories.length > 1 && categories.map(c => (
          <button key={c} className={`filter-btn ${!showArchived && categoryFilter === c ? 'active' : ''}`} onClick={() => { setShowArchived(false); setCategoryFilter(c); }}>
            {c}
          </button>
        ))}
        {allArchived.length > 0 && (
          <button className={`filter-btn ${showArchived ? 'active' : ''}`} onClick={() => { setShowArchived(true); setCategoryFilter('all'); }}>
            Archived ({allArchived.length})
          </button>
        )}
      </div>

      {displayList.map(renderCard)}

      {displayList.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">No insights match the current filters.</div>
        </div>
      )}
    </div>
  );
}
