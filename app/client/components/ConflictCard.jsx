import React, { useState } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, SubtleBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';

const CONFLICT_OPTIONS = [
  { id: 'flag', label: 'Flag for discussion' },
  { id: 'research', label: 'Needs more research' },
  { id: 'context', label: 'I have context' },
];

export default function ConflictCard({ conflict, onNavigate, decision, onDecision }) {
  const [expanded, setExpanded] = useState(false);
  const [contextText, setContextText] = useState('');

  const statusAccent = conflict.status === 'RESOLVED' ? 'verified' : 'conflict';

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
        <StatusBadge status={conflict.status} />
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
      {conflict.status !== 'RESOLVED' && onDecision && (
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
                <textarea
                  className="context-textarea"
                  placeholder="Add your context here..."
                  value={contextText}
                  onChange={(e) => {
                    setContextText(e.target.value);
                    onDecision?.(conflict.id, { type: 'context', text: e.target.value });
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
