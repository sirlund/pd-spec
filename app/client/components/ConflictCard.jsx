import React, { useState, useEffect } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, SubtleBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';
import { useScriptAction } from '../hooks.js';

export default function ConflictCard({ conflict, onNavigate, decision, onDecision }) {
  const [expanded, setExpanded] = useState(false);
  const [contextText, setContextText] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [localIntermediate, setLocalIntermediate] = useState(null);
  const { execute, loading, error, clearError } = useScriptAction();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Reset optimistic state when real data catches up
  useEffect(() => { setLocalIntermediate(null); }, [conflict.intermediate, conflict.status]);

  const handleFlag = async () => {
    try {
      await execute('resolve-conflict', { id: conflict.id, flag: 'Flagged by user' });
      setLocalIntermediate('FLAGGED');
    } catch { /* error shown inline */ }
  };

  const handleResearch = async () => {
    try {
      await execute('resolve-conflict', { id: conflict.id, research: 'Marked for research' });
      setLocalIntermediate('RESEARCH');
    } catch { /* error shown inline */ }
  };

  const handleResolve = async () => {
    if (!contextText.trim()) return;
    try {
      await execute('resolve-conflict', { id: conflict.id, resolution: contextText.trim() });
      setContextText('');
      setShowContext(false);
    } catch { /* error shown inline */ }
  };

  const effectiveIntermediate = localIntermediate || conflict.intermediate;
  const statusAccent = conflict.status === 'RESOLVED' ? 'verified'
    : effectiveIntermediate ? 'pending' : 'conflict';
  const displayStatus = effectiveIntermediate || conflict.status;

  return (
    <Card accent={statusAccent}>
      <div className="card-header">
        <IdBadge id={conflict.id} />
        <StatusBadge status={displayStatus} />
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

      {/* Direct action buttons for unresolved conflicts */}
      {conflict.status !== 'RESOLVED' && !effectiveIntermediate && (
        <div className="decision-row" style={{ flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sm btn-ghost" onClick={handleFlag} disabled={loading}>
              <Icon name="flag" size={14} /> Flag for discussion
            </button>
            <button className="btn btn-sm btn-ghost" onClick={handleResearch} disabled={loading}>
              <Icon name="search" size={14} /> Needs research
            </button>
            <button className="btn btn-sm btn-accent" onClick={() => setShowContext(!showContext)} disabled={loading}>
              <Icon name="message-circle" size={14} /> I have context
            </button>
          </div>
          {showContext && (
            <>
              <textarea
                className="context-textarea"
                placeholder="Add your context here..."
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
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
            </>
          )}
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)', marginTop: 4 }}>{error}</div>
          )}
        </div>
      )}
    </Card>
  );
}
