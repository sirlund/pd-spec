import React, { useState, useEffect } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, SubtleBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';
import { useScriptAction } from '../hooks.js';

export default function ConflictCard({ conflict, onNavigate }) {
  const [expanded, setExpanded] = useState(false);
  const [activeAction, setActiveAction] = useState(null); // 'flag' | 'research' | 'resolve'
  const [noteText, setNoteText] = useState('');
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

  const handleSubmit = async () => {
    if (!noteText.trim()) return;
    try {
      if (activeAction === 'flag') {
        await execute('resolve-conflict', { id: conflict.id, flag: noteText.trim() });
        setLocalIntermediate('FLAGGED');
      } else if (activeAction === 'research') {
        await execute('resolve-conflict', { id: conflict.id, research: noteText.trim() });
        setLocalIntermediate('RESEARCH');
      } else {
        await execute('resolve-conflict', { id: conflict.id, resolution: noteText.trim() });
      }
      setNoteText('');
      setActiveAction(null);
    } catch { /* error shown inline */ }
  };

  const toggleAction = (action) => {
    setActiveAction(prev => prev === action ? null : action);
    setNoteText('');
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

      {/* Action tabs for unresolved conflicts */}
      {conflict.status !== 'RESOLVED' && !effectiveIntermediate && (
        <div style={{ marginTop: 10 }}>
          <div className="tab-group">
            {[
              { key: 'flag', icon: 'flag', label: 'Flag' },
              { key: 'research', icon: 'search', label: 'Research' },
              { key: 'resolve', icon: 'message-circle', label: 'Resolve' },
            ].map(tab => (
              <button
                key={tab.key}
                className={`tab-item ${activeAction === tab.key ? 'active' : ''}`}
                onClick={() => toggleAction(tab.key)}
                disabled={loading}
              >
                <Icon name={tab.icon} size={13} /> {tab.label}
              </button>
            ))}
          </div>
          {activeAction && (
            <div style={{ marginTop: 8 }}>
              <textarea
                className="context-textarea"
                placeholder={activeAction === 'flag' ? 'Why does this need discussion?'
                  : activeAction === 'research' ? 'What needs to be investigated?'
                  : 'Add your resolution context...'}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                autoFocus
              />
              {noteText.trim() && (
                <button
                  className="btn btn-sm btn-primary"
                  style={{ marginTop: 6 }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? '...'
                    : activeAction === 'flag' ? 'Flag for discussion'
                    : activeAction === 'research' ? 'Mark for research'
                    : 'Resolve now'}
                </button>
              )}
            </div>
          )}
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)', marginTop: 4 }}>{error}</div>
          )}
        </div>
      )}
    </Card>
  );
}
