import React, { useState, useEffect } from 'react';
import Card from './ui/Card.jsx';
import { StatusBadge, IdBadge, WarningBadge, SubtleBadge } from './ui/Badge.jsx';
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

function parseCategory(raw) {
  if (!raw) return { category: '', temporal: 'as-is' };
  const match = raw.match(/^(.+?)\s*\((to-be|future-state|as-is)\)\s*$/);
  if (match) return { category: match[1].trim(), temporal: match[2] };
  return { category: raw.trim(), temporal: 'as-is' };
}

function parseDiscardReason(status) {
  if (!status) return { baseStatus: status, discardReason: null };
  if (status.includes('—')) {
    const [base, ...rest] = status.split('—');
    return { baseStatus: base.trim(), discardReason: rest.join('—').trim() };
  }
  return { baseStatus: status, discardReason: null };
}

const CATEGORY_OPTIONS = ['user-need', 'business', 'constraint', 'technical', 'design-principle'];
const TEMPORAL_OPTIONS = ['as-is', 'to-be', 'future-state'];
const VOICE_OPTIONS = ['user', 'stakeholder', 'document', 'researcher', 'ai'];
const AUTHORITY_OPTIONS = ['direct-quote', 'observation', 'hypothesis', 'vision', 'fact'];

export default function InsightCard({ insight, onNavigate, decision, onDecision, willExitFilter = false }) {
  const [expanded, setExpanded] = useState(false);
  const [refsExpanded, setRefsExpanded] = useState(false);
  const [showDiscardInput, setShowDiscardInput] = useState(false);
  const [discardReason, setDiscardReason] = useState('');
  const [localStatus, setLocalStatus] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editNarrative, setEditNarrative] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTemporal, setEditTemporal] = useState('as-is');
  const [editVoice, setEditVoice] = useState('');
  const [editAuthority, setEditAuthority] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const { execute, loading, error, clearError } = useScriptAction();
  const freshness = getFreshness(insight.last_updated);

  // Reset optimistic state when real data catches up
  useEffect(() => { setLocalStatus(null); }, [insight.status]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const { baseStatus, discardReason: parsedDiscardReason } = parseDiscardReason(insight.status);
  const effectiveStatus = localStatus || baseStatus;

  const handleDiscard = async () => {
    if (!showDiscardInput) {
      setShowDiscardInput(true);
      return;
    }
    if (!discardReason.trim()) return;
    try {
      await execute('verify-insight', { id: insight.id, action: 'discard', reason: discardReason.trim() });
      setLocalStatus('DISCARDED');
      setShowDiscardInput(false);
      setDiscardReason('');
    } catch { /* error shown inline */ }
  };

  const handleFreeze = async () => {
    try {
      await execute('verify-insight', { id: insight.id, action: 'freeze' });
      setLocalStatus('FROZEN');
    } catch { /* error shown inline */ }
  };

  const handleUnfreeze = async () => {
    try {
      await execute('verify-insight', { id: insight.id, action: 'unfreeze' });
      setLocalStatus('VERIFIED');
    } catch { /* error shown inline */ }
  };

  const handleEditStart = () => {
    setEditTitle(insight.title || '');
    setEditNarrative(insight.narrative || '');
    const parsed = parseCategory(insight.category);
    setEditCategory(parsed.category);
    setEditTemporal(parsed.temporal);
    setEditVoice(insight.voice || '');
    setEditAuthority(insight.authority || '');
    setEditing(true);
    setEditError(null);
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError(null);
    try {
      const body = {
        title: editTitle,
        narrative: editNarrative,
        category: editCategory,
        temporal: editTemporal,
        voice: editVoice,
        authority: editAuthority,
      };
      const res = await fetch(`/api/insight/${insight.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }
      setEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditing(false);
    setEditError(null);
  };

  const statusAccent = {
    VERIFIED: 'verified',
    PENDING: 'pending',
    MERGED: 'merged',
    INVALIDATED: 'invalidated',
    DISCARDED: 'discarded',
    FROZEN: 'frozen',
    SUPERSEDED: 'superseded',
  }[effectiveStatus];

  // Category display: strip (as-is), show (to-be) and (future-state) as badges
  const parsedCat = parseCategory(insight.category);
  const displayCategory = parsedCat.category;
  const temporalBadge = parsedCat.temporal !== 'as-is' ? parsedCat.temporal : null;

  // Determine which action buttons to show
  const isActive = effectiveStatus === 'VERIFIED' || effectiveStatus === 'PENDING';
  const isFrozen = effectiveStatus === 'FROZEN';
  const isArchived = effectiveStatus === 'DISCARDED' || effectiveStatus === 'MERGED' || effectiveStatus === 'SUPERSEDED' || effectiveStatus === 'INVALIDATED';

  return (
    <Card accent={statusAccent} className={localStatus && willExitFilter ? 'card-exit' : ''}>
      <div className="card-header">
        <IdBadge id={insight.id} />
        <StatusBadge status={effectiveStatus} />
        {freshness?.warn && (
          <span title={`${freshness.label} — updated ${freshness.days}d ago`} style={{
            display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
            background: freshness.color, flexShrink: 0,
          }} />
        )}
        {insight.ai_generated && <WarningBadge>AI-GENERATED</WarningBadge>}
        {insight.tier && <SubtleBadge>{insight.tier}</SubtleBadge>}
        {temporalBadge && <SubtleBadge>{temporalBadge}</SubtleBadge>}
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
          {insight.edited && (
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Edited: {insight.edited}
            </span>
          )}
          {freshness && (
            <span style={{ fontSize: '0.7rem', color: freshness.warn ? freshness.color : 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Updated {freshness.days}d ago
            </span>
          )}
        </span>
      </div>

      {/* Discard reason for DISCARDED insights */}
      {parsedDiscardReason && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 6, paddingLeft: 4 }}>
          {parsedDiscardReason}
        </div>
      )}

      {editing ? (
        <div style={{ marginBottom: 8 }}>
          <input
            className="form-input"
            style={{ fontSize: '0.85rem', padding: '6px 8px', width: '100%', marginBottom: 6 }}
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Insight title..."
          />
          <textarea
            className="form-input"
            style={{ fontSize: '0.82rem', padding: '6px 8px', width: '100%', minHeight: 60, resize: 'vertical', marginBottom: 6 }}
            value={editNarrative}
            onChange={(e) => setEditNarrative(e.target.value)}
            placeholder="Narrative..."
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 6 }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Category
              <select className="form-input" style={{ fontSize: '0.8rem', padding: '4px 6px', width: '100%', marginTop: 2 }} value={editCategory} onChange={(e) => setEditCategory(e.target.value)}>
                <option value="">—</option>
                {CATEGORY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Temporal
              <select className="form-input" style={{ fontSize: '0.8rem', padding: '4px 6px', width: '100%', marginTop: 2 }} value={editTemporal} onChange={(e) => setEditTemporal(e.target.value)}>
                {TEMPORAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Voice
              <select className="form-input" style={{ fontSize: '0.8rem', padding: '4px 6px', width: '100%', marginTop: 2 }} value={editVoice} onChange={(e) => setEditVoice(e.target.value)}>
                <option value="">—</option>
                {VOICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Authority
              <select className="form-input" style={{ fontSize: '0.8rem', padding: '4px 6px', width: '100%', marginTop: 2 }} value={editAuthority} onChange={(e) => setEditAuthority(e.target.value)}>
                <option value="">—</option>
                {AUTHORITY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sm btn-approve" onClick={handleEditSave} disabled={editLoading}>
              <Icon name={editLoading ? 'loader' : 'check'} size={14} spin={editLoading} /> Save
            </button>
            <button className="btn btn-sm btn-ghost" onClick={handleEditCancel} disabled={editLoading}>
              Cancel
            </button>
          </div>
          {editError && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)', marginTop: 4 }}>{editError}</div>
          )}
        </div>
      ) : (
        <div className="card-title" style={{ marginBottom: 8 }}>
          {insight.concept && <span style={{ color: 'var(--accent-cyan)' }}>"{insight.concept}"</span>}
          {insight.concept && ' — '}
          {insight.title}
        </div>
      )}

      <div className="card-meta">
        {displayCategory && <span><strong>Category:</strong> {displayCategory}</span>}
        {insight.convergence && <span><strong>Convergence:</strong> {insight.convergence}</span>}
        {insight.authority && <span><strong>Authority:</strong> {insight.authority}</span>}
        {insight.voice && <span><strong>Voice:</strong> {insight.voice}</span>}
      </div>


      {!editing && insight.narrative && (
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
              <span key={i} className="badge badge-subtle" style={{ fontSize: '0.65rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' }} title={ref} onClick={() => onNavigate?.(`source:${ref}`)}>
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

      {/* Action buttons for VERIFIED and PENDING insights: Edit + Freeze + Discard */}
      {isActive && !editing && (
        <div className="decision-row" style={{ flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="btn btn-sm btn-ghost" onClick={handleEditStart} disabled={loading}>
              <Icon name="pencil" size={14} /> Edit
            </button>
            <button className="btn btn-sm btn-ghost" onClick={handleFreeze} disabled={loading}>
              <Icon name="snowflake" size={14} /> Freeze
            </button>
            <button className="btn btn-sm btn-reject" onClick={handleDiscard} disabled={loading}>
              <Icon name="x" size={14} /> Discard
            </button>
          </div>
          {showDiscardInput && (
            <div style={{ display: 'flex', gap: 6 }}>
              <input
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
                placeholder="Reason for discarding..."
                value={discardReason}
                onChange={(e) => setDiscardReason(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleDiscard()}
                autoFocus
              />
              <button className="btn btn-sm btn-reject" onClick={handleDiscard} disabled={!discardReason.trim() || loading}>
                Send
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => { setShowDiscardInput(false); setDiscardReason(''); }}>
                Cancel
              </button>
            </div>
          )}
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)' }}>{error}</div>
          )}
        </div>
      )}

      {/* Unfreeze button for FROZEN insights */}
      {isFrozen && !editing && (
        <div className="decision-row">
          <button className="btn btn-sm btn-approve" onClick={handleUnfreeze} disabled={loading}>
            <Icon name="check" size={14} /> Unfreeze
          </button>
          {error && (
            <div style={{ fontSize: '0.75rem', color: 'var(--conflict-fg)', marginLeft: 8 }}>{error}</div>
          )}
        </div>
      )}

      {/* No action buttons for archived statuses (DISCARDED, MERGED, SUPERSEDED, INVALIDATED) */}
    </Card>
  );
}
