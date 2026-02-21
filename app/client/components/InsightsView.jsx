import React, { useState, useEffect, useRef } from 'react';
import { useLiveData } from '../hooks.js';
import InsightCard from './InsightCard.jsx';

export default function InsightsView({ highlightId, onHighlightClear, onNavigate }) {
  const { data, loading } = useLiveData('/insights', ['INSIGHTS_GRAPH']);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const highlightRef = useRef(null);

  // Scroll to highlighted insight
  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear highlight after animation
      const timer = setTimeout(() => onHighlightClear?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, data]);

  if (loading || !data) {
    return <div className="empty-state"><div className="empty-state-text">Loading insights...</div></div>;
  }

  if (data.insights.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">◆</div>
        <div className="empty-state-title">No insights yet</div>
        <div className="empty-state-text">
          Run <code>/extract</code> then <code>/analyze</code> to generate insights.
        </div>
      </div>
    );
  }

  const statuses = [...new Set(data.insights.map(i => i.status))];
  const categories = data.categories || [];

  const filtered = data.insights.filter(i => {
    if (statusFilter !== 'all' && i.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && i.category_group !== categoryFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Insights ({data.insights.length})</h1>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button
          className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All
        </button>
        {statuses.map(s => (
          <button
            key={s}
            className={`filter-btn ${statusFilter === s ? 'active' : ''}`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {categories.length > 1 && (
        <div className="filter-bar">
          <button
            className={`filter-btn ${categoryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('all')}
          >
            All categories
          </button>
          {categories.map(c => (
            <button
              key={c}
              className={`filter-btn ${categoryFilter === c ? 'active' : ''}`}
              onClick={() => setCategoryFilter(c)}
              title={c}
            >
              {c.length > 30 ? c.slice(0, 30) + '...' : c}
            </button>
          ))}
        </div>
      )}

      {/* Cards */}
      {filtered.map(insight => (
        <div
          key={insight.id}
          ref={highlightId === insight.id ? highlightRef : null}
          style={{
            transition: 'box-shadow 0.3s',
            boxShadow: highlightId === insight.id ? '0 0 0 2px var(--color-accent)' : 'none',
            borderRadius: 8,
          }}
        >
          <InsightCard insight={insight} onNavigate={onNavigate} />
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-text">No insights match the current filters.</div>
        </div>
      )}
    </div>
  );
}
