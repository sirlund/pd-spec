import React, { useState } from 'react';

export default function ConflictCard({ conflict, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card">
      <div className="card-header">
        <span className="badge badge-conflict" style={{ cursor: 'default' }}>
          {conflict.id}
        </span>
        <span className={`badge badge-${conflict.status.toLowerCase()}`}>
          {conflict.status}
        </span>
        {conflict.type && (
          <span className="badge" style={{ background: '#F0F0F0', color: '#666' }}>
            {conflict.type}
          </span>
        )}
        {conflict.priority && (
          <span className="badge" style={{
            background: conflict.priority === 'Critical' ? 'var(--color-blocked-bg)' :
                         conflict.priority === 'High' ? 'var(--color-pending-bg)' : '#F0F0F0',
            color: conflict.priority === 'Critical' ? 'var(--color-blocked-fg)' :
                   conflict.priority === 'High' ? 'var(--color-pending-fg)' : '#666',
          }}>
            {conflict.priority}
          </span>
        )}
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>
        {conflict.title && `${conflict.title} — `}{conflict.description}
      </div>

      {/* Related insights */}
      {conflict.related_insights.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Related: </span>
          {conflict.related_insights.map(ref => (
            <span
              key={ref}
              className="badge badge-insight"
              onClick={() => onNavigate?.(ref)}
              style={{ marginRight: 4, cursor: 'pointer' }}
            >
              {ref}
            </span>
          ))}
        </div>
      )}

      {/* Source claims */}
      {conflict.claims.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <button
            onClick={() => setExpanded(!expanded)}
            style={{
              background: 'none', border: 'none', color: 'var(--color-accent)',
              cursor: 'pointer', fontSize: '0.8rem', padding: 0, fontFamily: 'Inter, sans-serif',
            }}
          >
            {expanded ? 'Hide' : 'Show'} source claims ({conflict.claims.length})
          </button>

          {expanded && (
            <ul style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', paddingLeft: 16, marginTop: 6 }}>
              {conflict.claims.map((claim, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{claim}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Resolution */}
      {conflict.resolution && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border-light)',
          fontSize: '0.85rem', color: 'var(--color-text-secondary)',
        }}>
          <strong style={{ color: 'var(--color-verified-fg)' }}>Resolution:</strong> {conflict.resolution}
        </div>
      )}

      {/* Action needed */}
      {conflict.action && (
        <div style={{
          marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border-light)',
          fontSize: '0.85rem', color: 'var(--color-text-secondary)',
        }}>
          <strong style={{ color: 'var(--color-pending-fg)' }}>Action needed:</strong> {conflict.action}
        </div>
      )}
    </div>
  );
}
