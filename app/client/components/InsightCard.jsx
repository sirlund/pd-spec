import React, { useState, useEffect } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, WarningBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';
import { useScriptAction } from '../hooks.js';
function getFreshness(lastUpdated) {
  if (!lastUpdated) return null;
  const now = new Date();
  const updated = new Date(lastUpdated);
  const days = Math.floor((now - updated) / (1000 * 60 * 60 * 24));
  if (days <= 14) return { color: null, label: 'Fresh', days, warn: false };
  if (days <= 45) return { color: 'var(--vivid-yellow)', label: 'Aging', days, warn: true };
  return { color: 'var(--vivid-red)', label: 'Stale', days, warn: true };
}

export default function InsightCard({ insight, onNavigate, decision, onDecision }) {
  const [expanded, setExpanded] = useState(false);
  const [refsExpanded, setRefsExpanded] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const { execute, loading, error, clearError } = useScriptAction();
  const freshness = getFreshness(insight.last_updated);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleApprove = async () => {
    try {
      await execute('verify-insight', { id: insight.id, action: 'verify' });
    } catch { /* error shown inline */ }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) return;
    try {
      await execute('verify-insight', { id: insight.id, action: 'invalidate', reason: rejectReason.trim() });
      setShowRejectInput(false);
      setRejectReason('');
    } catch { /* error shown inline */ }
  };

  const statusAccent = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    MERGED: 'merged',
    INVALIDATED: 'invalidated',
    FROZEN: 'frozen',
    SUPERSEDED: 'superseded',
  }[insight.status];

  return (
    <Card accent={statusAccent}>
      <div className="card-header">
        <IdBadge id={insight.id} />
        <StatusBadge status={insight.status} />
        {freshness?.warn && (
          <span title={`${freshness.label} — updated ${freshness.days}d ago`} style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: freshness.color, flexShrink: 0,
          }} />
        )}
        {insight.ai_generated && <WarningBadge>AI-GENERATED</WarningBadge>}
        {freshness && (
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: freshness.warn ? freshness.color : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Updated {freshness.days}d ago
          </span>
        )}
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

      {insight.grounded_in && (
        <div className="card-meta" style={{ marginTop: 6, fontSize: '0.75rem' }}>
          <span><strong>Grounded in:</strong> {insight.grounded_in}</span>
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
            return (
              <span key={i} className="badge badge-subtle" style={{ fontSize: '0.65rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }} title={ref} onClick={() => onNavigate?.('sources')}>
                {filename}
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

      {/* Direct action buttons for PENDING insights */}
      {insight.status === 'PENDING' && (
        <div className="decision-row" style={{ flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-sm btn-approve"
              onClick={handleApprove}
              disabled={loading}
            >
              {loading ? '...' : <><Icon name="check" size={14} /> Approve</>}
            </button>
            <button
              className="btn btn-sm btn-reject"
              onClick={handleReject}
              disabled={loading}
            >
              <Icon name="x" size={14} /> Reject
            </button>
          </div>
          {showRejectInput && (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReject()}
                autoFocus
              />
              <button className="btn btn-sm btn-reject" onClick={handleReject} disabled={!rejectReason.trim() || loading}>
                Send
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => { setShowRejectInput(false); setRejectReason(''); }}>
                Cancel
              </button>
            </div>
          )}
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)' }}>{error}</div>
          )}
        </div>
      )}

      {/* Invalidate button for VERIFIED insights (BL-87 minimal) */}
      {insight.status === 'VERIFIED' && (
        <div className="decision-row" style={{ flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="btn btn-sm btn-reject"
              onClick={handleReject}
              disabled={loading}
            >
              <Icon name="x" size={14} /> Invalidate
            </button>
          </div>
          {showRejectInput && (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                placeholder="Reason for invalidation..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleReject()}
                autoFocus
              />
              <button className="btn btn-sm btn-reject" onClick={handleReject} disabled={!rejectReason.trim() || loading}>
                Send
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => { setShowRejectInput(false); setRejectReason(''); }}>
                Cancel
              </button>
            </div>
          )}
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)' }}>{error}</div>
          )}
        </div>
      )}
    </Card>
  );
}
