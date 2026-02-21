import React, { useEffect, useCallback } from 'react';
import { useLiveData } from '../hooks.js';

export default function MarkdownView({ path, title, parsed, onNavigate }) {
  const { data, loading } = useLiveData(path, ['02_Work/']);

  // Handle clicks on badge elements for navigation
  const handleClick = useCallback((e) => {
    const badge = e.target.closest('[data-ref]');
    if (badge) {
      const ref = badge.getAttribute('data-ref');
      if (ref && onNavigate) onNavigate(ref);
    }
  }, [onNavigate]);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading...</div></div>;
  }

  // Parsed extractions view
  if (parsed && data?.files) {
    if (data.files.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">▤</div>
          <div className="empty-state-title">No extractions yet</div>
          <div className="empty-state-text">
            Run <code>/extract</code> to extract claims from your sources.
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="section-header">
          <h1 className="section-title">{title} ({data.total_claims} claims)</h1>
        </div>
        {data.files.map((file) => (
          <div key={file.path} className="card">
            <div className="card-header">
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{file.path}</span>
              {file.tags.map(t => (
                <span key={t} className="badge badge-ai-warning">{t}</span>
              ))}
              <span className="count" style={{ marginLeft: 'auto' }}>
                {file.claims.length} claims
              </span>
            </div>

            {Object.keys(file.metadata).length > 0 && (
              <div className="card-meta">
                {Object.entries(file.metadata).map(([k, v]) => (
                  <span key={k}><strong>{k}:</strong> {v}</span>
                ))}
              </div>
            )}

            <ol style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', paddingLeft: 20, margin: 0 }}>
              {file.claims.map((claim) => (
                <li key={claim.number} value={claim.number} style={{ marginBottom: 4 }}>
                  {claim.text}
                  {claim.tags.map(t => (
                    <span key={t} className="badge badge-ai-warning" style={{ marginLeft: 4 }}>{t}</span>
                  ))}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }

  // Rendered markdown view
  if (data?.html) {
    return (
      <div>
        <div className="section-header">
          <h1 className="section-title">{title}</h1>
        </div>
        <div
          className="card md-content"
          onClick={handleClick}
          dangerouslySetInnerHTML={{ __html: data.html }}
        />
      </div>
    );
  }

  // Fallback: raw content
  if (data?.raw) {
    return (
      <div>
        <div className="section-header">
          <h1 className="section-title">{title}</h1>
        </div>
        <div className="card">
          <pre style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap', margin: 0 }}>{data.raw}</pre>
        </div>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">▧</div>
      <div className="empty-state-title">File not found</div>
      <div className="empty-state-text">This file hasn't been created yet.</div>
    </div>
  );
}
