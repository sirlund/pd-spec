import React, { useCallback } from 'react';
import { useLiveData } from '../hooks.js';
import Card from './ui/Card.jsx';
import { WarningBadge, IdBadge } from './ui/Badge.jsx';
import Icon from './ui/Icon.jsx';

// Render text with inline [IG-XX] / [CF-XX] as clickable badges
function InlineRefs({ text, onNavigate }) {
  const parts = text.split(/(\[(?:IG-[A-Z0-9-]+|CF-\d+)\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const match = part.match(/^\[(IG-[A-Z0-9-]+|CF-\d+)\]$/);
        if (match) {
          return <IdBadge key={i} id={match[1]} onClick={() => onNavigate?.(match[1])} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function MarkdownView({ path, title, parsed, onNavigate }) {
  const { data, loading } = useLiveData(path, ['02_Work/']);

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
          <Icon name="list-details" size={48} className="empty-state-icon" />
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
          <Card key={file.path}>
            <div className="card-header">
              <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{file.path}</span>
              {file.tags.map(t => (
                <WarningBadge key={t}>{t}</WarningBadge>
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

            <ol style={{ fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: 20, margin: 0 }}>
              {file.claims.map((claim) => (
                <li key={claim.number} value={claim.number} style={{ marginBottom: 4 }}>
                  <InlineRefs text={claim.text} onNavigate={onNavigate} />
                  {claim.tags.map(t => (
                    <WarningBadge key={t}>{t}</WarningBadge>
                  ))}
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    );
  }

  // Rendered markdown view
  if (data?.html) {
    // Strip duplicate h1 if it matches the view title
    const html = data.html.replace(/^<h1[^>]*>.*?<\/h1>\s*/, '');
    return (
      <div>
        <div className="section-header">
          <h1 className="section-title">{title}</h1>
        </div>
        <Card>
          <div className="md-content" onClick={handleClick} dangerouslySetInnerHTML={{ __html: html }} />
        </Card>
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
        <Card>
          <pre style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', margin: 0, color: 'var(--text-muted)' }}>{data.raw}</pre>
        </Card>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <Icon name="file-text" size={48} className="empty-state-icon" />
      <div className="empty-state-title">File not found</div>
      <div className="empty-state-text">This file hasn't been created yet.</div>
    </div>
  );
}
