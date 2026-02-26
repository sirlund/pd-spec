import React, { useState, useEffect } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, SubtleBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';
import { useScriptAction } from '../hooks.js';

const CONFLICT_OPTIONS = [
  { id: 'flag', label: 'Flag for discussion' },
  { id: 'research', label: 'Needs more research' },
  { id: 'context', label: 'I have context' },
];

export default function ConflictCard({ conflict, onNavigate, decision, onDecision }) {
  const [expanded, setExpanded] = useState(false);
  const [contextText, setContextText] = useState('');
  const { execute, loading, error, clearError } = useScriptAction();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleResolve = async () => {
    if (!contextText.trim()) return;
    try {
      await execute('resolve-conflict', { id: conflict.id, resolution: contextText.trim() });
      setContextText('');
    } catch { /* error shown inline */ }
  };

  const statusAccent = conflict.status === 'RESOLVED' ? 'verified'
    : conflict.intermediate ? 'pending' : 'conflict';

  const handleOption = (optionId) => {
    if (optionId === 'context') {
      onDecision?.(conflict.id, { type: 'context', text: contextText });
    } else {
      onDecision?.(conflict.id, { type: optionId });
    }
  };

  const currentType = decision?.type;

  return (
    <Card accent={statusAccent}>
      <div className="card-header">
        <IdBadge id={conflict.id} />
        <StatusBadge status={conflict.intermediate || conflict.status} />
        {conflict.type && <SubtleBadge>{conflict.type}</SubtleBadge>}
        {conflict.priority && (
          <span className={`badge ${conflict.priority === 'Critical' ? 'badge-critical' : conflict.priority === 'High' ? 'badge-pending' : 'badge-subtle'}`}>
            {conflict.priority}
          </span>
        )}
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>
        {conflict.title && `${conflict.title} — `}{conflict.description}
      </div>

      {conflict.intermediate_note && (
        <div style={{ marginBottom: 8, fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', paddingLeft: 8, borderLeft: `2px solid var(--${conflict.intermediate === 'FLAGGED' ? 'flagged' : 'research'}-fg)` }}>
          {conflict.intermediate_note}
        </div>
      )}

      {conflict.related_insights.length > 0 && (
        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Related: </span>
          {conflict.related_insights.map(ref => (
            <IdBadge key={ref} id={ref} onClick={() => onNavigate?.(ref)} />
          ))}
        </div>
      )}

      {conflict.claims.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <button className="btn btn-sm btn-ghost" onClick={() => setExpanded(!expanded)}>
            <Icon name="chevron-down" size={14} />
            {expanded ? 'Hide' : 'Show'} source claims ({conflict.claims.length})
          </button>
          {expanded && (
            <ul style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 16, marginTop: 6 }}>
              {conflict.claims.map((claim, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{claim}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {conflict.resolution && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--verified-fg)' }}>Resolution:</strong>{' '}
          <span style={{ color: 'var(--text-muted)' }}>{conflict.resolution}</span>
        </div>
      )}

      {conflict.action && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)', fontSize: '0.82rem' }}>
          <strong style={{ color: 'var(--pending-fg)' }}>Action needed:</strong>{' '}
          <span style={{ color: 'var(--text-muted)' }}>{conflict.action}</span>
        </div>
      )}

      {/* Decision radio options for unresolved conflicts */}
      {conflict.status !== 'RESOLVED' && !conflict.intermediate && onDecision && (
        <div className="radio-group">
          {CONFLICT_OPTIONS.map(opt => (
            <div key={opt.id}>
              <div
                className={`radio-option ${currentType === opt.id ? 'selected' : ''}`}
                onClick={() => handleOption(opt.id)}
              >
                <span className="radio-dot" />
                <span>{opt.label}</span>
              </div>
              {opt.id === 'context' && currentType === 'context' && (
                <>
                  <textarea
                    className="context-textarea"
                    placeholder="Add your context here..."
                    value={contextText}
                    onChange={(e) => {
                      setContextText(e.target.value);
                      onDecision?.(conflict.id, { type: 'context', text: e.target.value });
                    }}
                  />
                  {contextText.trim() && (
                    <button
                      className="btn btn-sm btn-accent"
                      style={{ marginTop: 6 }}
                      onClick={handleResolve}
                      disabled={loading}
                    >
                      {loading ? '...' : 'Resolve now'}
                    </button>
                  )}
                  {error && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)', marginTop: 4 }}>{error}</div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
