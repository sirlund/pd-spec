import React, { useState } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, WarningBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';
import ProgressBar from './ui/ProgressBar.jsx';

export default function InsightCard({ insight, onNavigate, decision, onDecision }) {
  const [expanded, setExpanded] = useState(false);
  const [refsExpanded, setRefsExpanded] = useState(false);

  const statusAccent = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    MERGED: 'merged',
    INVALIDATED: 'invalidated',
  }[insight.status];

  return (
    <Card accent={statusAccent}>
      <div className="card-header">
        <IdBadge id={insight.id} />
        <StatusBadge status={insight.status} />
        {insight.ai_generated && <WarningBadge>AI-GENERATED</WarningBadge>}
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>
        {insight.concept && <span style={{ color: 'var(--accent-cyan)' }}>"{insight.concept}"</span>}
        {insight.concept && ' — '}
        {insight.title}
      </div>

      <div className="card-meta">
        {insight.category && <span><strong>Category:</strong> {insight.category}</span>}
        {insight.convergence && <span><strong>Convergence:</strong> {insight.convergence}</span>}
        {insight.authority && <span><strong>Authority:</strong> {insight.authority}</span>}
        {insight.voice && <span><strong>Voice:</strong> {insight.voice}</span>}
      </div>

      {insight.convergence_ratio && (
        <div style={{ marginBottom: 8 }}>
          <ProgressBar segments={[
            {
              value: insight.convergence_ratio.matched,
              color: insight.convergence_ratio.total <= 1 ? 'var(--pending-fg)' : 'var(--accent-cyan)',
            },
            { value: insight.convergence_ratio.total - insight.convergence_ratio.matched, color: 'transparent' },
          ]} />
          {insight.convergence_ratio.total <= 1 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--pending-fg)', marginTop: 2 }}>
              Single source — consider cross-referencing
            </div>
          )}
        </div>
      )}

      {insight.narrative && (
        <div className="card-body">
          <p style={{
            overflow: 'hidden',
            maxHeight: expanded ? 'none' : '3.2em',
            lineHeight: '1.6',
          }}>
            {insight.narrative}
          </p>
          {insight.narrative.length > 150 && (
            <button className="btn-ghost btn-sm" onClick={() => setExpanded(!expanded)} style={{ marginTop: 4 }}>
              <Icon name="chevron-down" size={14} style={expanded ? { transform: 'rotate(180deg)' } : {}} />
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {expanded && insight.evidence.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
          <div className="label-mono" style={{ marginBottom: 6 }}>Evidence Trail</div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: 16, margin: 0 }}>
            {insight.evidence.map((e, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {insight.refs.length > 0 && (
        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {(refsExpanded ? insight.refs : insight.refs.slice(0, 3)).map((ref, i) => {
            const filename = ref.split('/').pop();
            const folder = ref.includes('/') ? ref.split('/')[0] : null;
            return (
              <span key={i} className="badge badge-subtle" style={{ fontSize: '0.65rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }} title={ref}>
                {folder && <span style={{ opacity: 0.6 }}>{folder}/</span>}{filename}
              </span>
            );
          })}
          {!refsExpanded && insight.refs.length > 3 && (
            <button className="btn-ghost btn-sm" onClick={() => setRefsExpanded(true)} style={{ fontSize: '0.65rem' }}>
              +{insight.refs.length - 3} more
            </button>
          )}
          {refsExpanded && insight.refs.length > 3 && (
            <button className="btn-ghost btn-sm" onClick={() => setRefsExpanded(false)} style={{ fontSize: '0.65rem' }}>
              show less
            </button>
          )}
        </div>
      )}

      {/* Decision buttons for PENDING insights */}
      {insight.status === 'PENDING' && onDecision && (
        <div className="decision-row">
          <button
            className={`btn btn-sm btn-approve ${decision === 'approve' ? 'active' : ''}`}
            onClick={() => onDecision(insight.id, 'approve')}
          >
            <Icon name="check" size={14} /> Approve
          </button>
          <button
            className={`btn btn-sm btn-reject ${decision === 'reject' ? 'active' : ''}`}
            onClick={() => onDecision(insight.id, 'reject')}
          >
            <Icon name="x" size={14} /> Reject
          </button>
        </div>
      )}
    </Card>
  );
}
