import React from 'react';
import { useLiveData } from '../hooks.js';

const FORMAT_ICONS = {
  md: '📝', pdf: '📕', docx: '📘', pptx: '📙', xlsx: '📗',
  png: '🖼️', jpg: '🖼️', jpeg: '🖼️', heic: '🖼️',
  txt: '📄', mp4: '🎬', mov: '🎬', csv: '📊',
};

export default function SourceBrowser() {
  const sources = useLiveData('/sources', ['SOURCE_MAP']);
  const files = useLiveData('/source-files', ['01_Sources/']);

  const sourceMap = sources.data;
  const sourceFiles = files.data;

  if (sources.loading || files.loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading sources...</div></div>;
  }

  // Merge source file listing with extraction status from SOURCE_MAP
  const statusMap = {};
  if (sourceMap?.sources) {
    for (const s of sourceMap.sources) {
      statusMap[s.path] = s;
    }
  }

  // Group files by folder
  const folders = {};
  if (sourceFiles?.files) {
    for (const f of sourceFiles.files) {
      const folder = f.folder || '(root)';
      if (!folders[folder]) folders[folder] = [];
      folders[folder].push(f);
    }
  }

  const totalFiles = sourceFiles?.files?.length || 0;
  const processedCount = sourceMap?.summary?.processed || 0;

  if (totalFiles === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">◫</div>
        <div className="empty-state-title">No source files</div>
        <div className="empty-state-text">
          Add research files to <code>01_Sources/</code> to begin.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Sources ({totalFiles})</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          {processedCount} extracted · {sourceMap?.summary?.total_claims || 0} claims
        </span>
      </div>

      {/* Summary */}
      {sourceMap?.summary && (
        <div className="stat-grid" style={{ marginBottom: 16 }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--color-verified-fg)' }}>{sourceMap.summary.processed}</div>
            <div className="stat-label">Processed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--color-pending-fg)' }}>{sourceMap.summary.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--color-text-muted)' }}>{sourceMap.summary.unsupported}</div>
            <div className="stat-label">Unsupported</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{sourceMap.summary.total_claims}</div>
            <div className="stat-label">Total Claims</div>
          </div>
        </div>
      )}

      {/* File browser */}
      {Object.entries(folders).sort(([a], [b]) => a.localeCompare(b)).map(([folder, folderFiles]) => (
        <div key={folder} className="source-folder">
          <div className="source-folder-name">{folder}</div>
          {folderFiles.map((file) => {
            const mapEntry = statusMap[file.path];
            const status = mapEntry?.status || 'unknown';
            const claims = mapEntry?.claims || 0;
            const icon = FORMAT_ICONS[file.format] || '📄';
            const statusClass = status === 'processed' ? 'processed' :
                                status.startsWith('pending') ? 'pending' : 'unsupported';

            return (
              <div key={file.path} className="source-file">
                <div className={`source-file-status ${statusClass}`} title={status} />
                <span>{icon}</span>
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  {file.format}
                </span>
                {claims > 0 && (
                  <span className="count">{claims}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
