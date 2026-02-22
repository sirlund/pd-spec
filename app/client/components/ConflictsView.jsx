import React, { useState, useEffect, useRef } from 'react';
import { useLiveData } from '../hooks.js';
import ConflictCard from './ConflictCard.jsx';
import Icon from './ui/Icon.jsx';

export default function ConflictsView({ highlightId, onHighlightClear, onNavigate, decisions, onDecision }) {
  const { data, loading } = useLiveData('/conflicts', ['CONFLICTS']);
  const [statusFilter, setStatusFilter] = useState('all');
  const highlightRef = useRef(null);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => onHighlightClear?.(), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightId, data]);

  if (loading || !data) {
    return <div className="empty-state"><div className="empty-state-text">Loading conflicts...</div></div>;
  }

  if (data.conflicts.length === 0) {
    return (
      <div className="empty-state">
        <Icon name="bolt" size={48} className="empty-state-icon" />
        <div className="empty-state-title">No conflicts detected</div>
        <div className="empty-state-text">
          Run <code>/analyze</code> to detect contradictions and ambiguities in your sources.
        </div>
      </div>
    );
  }

  const filtered = data.conflicts.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          Conflicts ({data.conflicts.length})
          {data.summary.resolved > 0 && (
            <span style={{ fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: 8 }}>
              {data.summary.resolved} resolved
            </span>
          )}
        </h1>
      </div>

      <div className="filter-bar">
        <button className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => setStatusFilter('all')}>
          All ({data.conflicts.length})
        </button>
        <button className={`filter-btn ${statusFilter === 'PENDING' ? 'active' : ''}`} onClick={() => setStatusFilter('PENDING')}>
          Pending ({data.summary.pending})
        </button>
        <button className={`filter-btn ${statusFilter === 'RESOLVED' ? 'active' : ''}`} onClick={() => setStatusFilter('RESOLVED')}>
          Resolved ({data.summary.resolved})
        </button>
      </div>

      {filtered.map(conflict => (
        <div
          key={conflict.id}
          ref={highlightId === conflict.id ? highlightRef : null}
          style={{
            transition: 'box-shadow 0.3s',
            boxShadow: highlightId === conflict.id ? '0 0 0 2px var(--conflict-fg)' : 'none',
            borderRadius: 'var(--radius)',
          }}
        >
          <ConflictCard
            conflict={conflict}
            onNavigate={onNavigate}
            decision={decisions?.[conflict.id]}
            onDecision={onDecision}
          />
        </div>
      ))}
    </div>
  );
}
