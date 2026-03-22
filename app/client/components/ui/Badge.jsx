import React from 'react';

const STATUS_CLASS = {
  VERIFIED: 'badge-verified',
  PENDING: 'badge-pending',
  MERGED: 'badge-merged',
  INVALIDATED: 'badge-invalidated',
  DISCARDED: 'badge-discarded',
  FROZEN: 'badge-frozen',
  SUPERSEDED: 'badge-superseded',
  RESOLVED: 'badge-resolved',
  FLAGGED: 'badge-flagged',
  RESEARCH: 'badge-research',
  BLOCKED: 'badge-blocked',
  READY: 'badge-ready',
  Critical: 'badge-critical',
  High: 'badge-pending',
};

export function StatusBadge({ status }) {
  const cls = STATUS_CLASS[status] || STATUS_CLASS[status?.toUpperCase()] || 'badge-subtle';
  return <span className={`badge ${cls}`}>{status}</span>;
}

export function IdBadge({ id, onClick }) {
  const isConflict = id.startsWith('CF-');
  return (
    <span
      className={`badge ${isConflict ? 'badge-conflict-id' : 'badge-id'}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {id}
    </span>
  );
}

export function SubtleBadge({ children }) {
  return <span className="badge badge-subtle">{children}</span>;
}

export function WarningBadge({ children }) {
  return <span className="badge badge-ai-warning">{children}</span>;
}
