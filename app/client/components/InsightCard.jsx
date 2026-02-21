import React, { useState } from 'react';

export default function InsightCard({ insight, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  const statusClass = `badge-${insight.status.toLowerCase()}`;

  return (
    <div className="card">
      <div className="card-header">
        <span className="badge badge-insight" style={{ cursor: 'default' }}>
          {insight.id}
        </span>
        <span className={`badge ${statusClass}`}>{insight.status}</span>
        {insight.ai_generated && (
          <span className="badge badge-ai-warning">AI-GENERATED</span>
        )}
      </div>

      <div className="card-title" style={{ marginBottom: 8 }}>
        {insight.concept && `"${insight.concept}" — `}
        {insight.title}
      </div>

      <div className="card-meta">
        {insight.category && (
          <span><strong>Category:</strong> {insight.category}</span>
        )}
        {insight.convergence && (
          <span><strong>Convergence:</strong> {insight.convergence}</span>
        )}
        {insight.authority && (
          <span><strong>Authority:</strong> {insight.authority}</span>
        )}
        {insight.voice && (
          <span><strong>Voice:</strong> {insight.voice}</span>
        )}
      </div>

      {/* Convergence bar */}
      {insight.convergence_ratio && (
        <div style={{ marginBottom: 8 }}>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${Math.round((insight.convergence_ratio.matched / insight.convergence_ratio.total) * 100)}%`,
                background: 'var(--color-accent)',
              }}
            />
          </div>
        </div>
      )}

      {/* Narrative (expandable) */}
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
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                padding: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      {/* Evidence (expandable) */}
      {expanded && insight.evidence.length > 0 && (
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--color-border-light)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
            Evidence Trail
          </div>
          <ul style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', paddingLeft: 16, margin: 0 }}>
            {insight.evidence.map((e, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Refs */}
      {insight.refs.length > 0 && (
        <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Ref: {insight.refs.join(', ')}
        </div>
      )}
    </div>
  );
}
