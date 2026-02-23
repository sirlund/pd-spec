import React, { useState, useCallback } from 'react';
import { useLiveData, useApi } from '../hooks.js';
import Icon from './ui/Icon.jsx';
import { StatusBadge } from './ui/Badge.jsx';

const FORMAT_ICONS = {
  md: 'file-text', pdf: 'file', docx: 'file', pptx: 'file', xlsx: 'file',
  png: 'photo', jpg: 'photo', jpeg: 'photo', heic: 'photo', gif: 'photo', webp: 'photo',
  svg: 'photo', txt: 'file', csv: 'file', mp4: 'file', mov: 'file',
  html: 'file-export', css: 'file', js: 'file', json: 'file',
};

const IMAGE_EXTS = new Set(['png', 'jpg', 'jpeg', 'heic', 'gif', 'webp', 'svg']);
const MD_EXTS = new Set(['md', 'txt', 'csv']);
const OPENABLE_EXTS = new Set(['html']);

// Map root prop to API path prefix
const ROOT_PREFIX = {
  '01_Sources': '01_Sources/',
  '02_Work': '02_Work/',
  '03_Outputs': '',
};

export default function FileBrowser({ root, title }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const isSources = root === '01_Sources';
  const isWork = root === '02_Work';
  const isOutputs = root === '03_Outputs';

  const apiEndpoint = isSources ? '/source-files' : isWork ? '/work-files' : '/outputs';
  const watchKey = isSources ? '01_Sources/' : isWork ? '02_Work/' : '03_Outputs/';

  const files = useLiveData(apiEndpoint, [watchKey]);
  const sourceMap = useLiveData('/sources', ['SOURCE_MAP']);

  // Build status lookup (normalized paths for matching)
  const statusMap = {};
  if (isSources && sourceMap.data?.sources) {
    for (const s of sourceMap.data.sources) {
      statusMap[s.path.normalize('NFC').trim()] = s;
    }
  }

  // Build folder tree — separate root files (folder=null) from real folders
  const rootFiles = [];
  const folders = {};
  const fileList = isSources ? files.data?.files : isWork ? files.data?.files : files.data?.outputs;
  if (fileList) {
    for (const f of fileList) {
      let folder;
      if (isOutputs) {
        // For outputs, derive folder from path (strip 03_Outputs/ prefix)
        const parts = f.path.replace('03_Outputs/', '').split('/');
        folder = parts.length > 1 ? parts.slice(0, -1).join('/') : null;
      } else {
        folder = f.folder;
      }

      if (folder === null || folder === undefined) {
        rootFiles.push(f);
      } else {
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(f);
      }
    }
  }

  const toggleFolder = (folder) => {
    setCollapsedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const getFilePath = useCallback((file) => {
    if (isOutputs) return file.path;
    const prefix = isSources ? '01_Sources/' : '02_Work/';
    return `${prefix}${file.path}`;
  }, [isSources, isOutputs]);

  const handleFileClick = useCallback(async (file) => {
    const path = getFilePath(file);
    const ext = (file.format || file.name?.split('.').pop() || '').toLowerCase();

    setSelectedFile(path);
    setPreview(null);
    setPreviewLoading(true);

    try {
      if (MD_EXTS.has(ext)) {
        const res = await fetch(`/api/file/${path}`);
        const data = await res.json();
        setPreview({ type: 'markdown', data });
      } else if (IMAGE_EXTS.has(ext)) {
        setPreview({ type: 'image', path: `/api/raw/${path}` });
      } else if (OPENABLE_EXTS.has(ext)) {
        if (isOutputs) {
          const url = '/' + file.path.replace('03_Outputs/', 'outputs/');
          setPreview({ type: 'external', url, name: file.name });
        } else {
          setPreview({ type: 'external', url: `/api/raw/${path}`, name: file.name });
        }
      } else {
        setPreview({ type: 'binary', name: file.name, ext, path });
      }
    } catch {
      setPreview({ type: 'error' });
    } finally {
      setPreviewLoading(false);
    }
  }, [getFilePath, isOutputs]);

  const handleOpenExternal = async (path) => {
    try {
      await fetch('/api/open', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path }),
      });
    } catch { /* ignore */ }
  };

  const totalFiles = fileList?.length || 0;
  const processedCount = isSources ? (sourceMap.data?.summary?.processed || 0) : 0;

  if (files.loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading files...</div></div>;
  }

  if (totalFiles === 0) {
    const emptyMsg = isSources
      ? <>Add research files to <code>01_Sources/</code> to begin.</>
      : isWork
        ? <>Run <code>/extract</code> to generate work layer files.</>
        : <>Run <code>/ship [type]</code> to generate deliverables.</>;

    return (
      <div className="empty-state">
        <Icon name={isSources ? 'folders' : isWork ? 'flask' : 'file-export'} size={48} className="empty-state-icon" />
        <div className="empty-state-title">No {isSources ? 'source' : isWork ? 'work' : 'output'} files</div>
        <div className="empty-state-text">{emptyMsg}</div>
      </div>
    );
  }

  // Render a single file row
  const renderFileRow = (file) => {
    const path = getFilePath(file);
    const ext = (file.format || file.name?.split('.').pop() || '').toLowerCase();
    const normalizedPath = file.path.normalize('NFC').trim();
    const mapEntry = isSources ? statusMap[normalizedPath] : null;
    const status = mapEntry?.status || '';
    const statusClass = status === 'processed' ? 'processed' :
      status.startsWith('pending') ? 'pending' : 'unsupported';
    const iconName = FORMAT_ICONS[ext] || 'file';

    return (
      <div
        key={path}
        className={`file-item ${selectedFile === path ? 'active' : ''}`}
        onClick={() => handleFileClick(file)}
      >
        {isSources && <span className={`file-status-dot ${statusClass}`} title={status} />}
        <Icon name={iconName} size={14} />
        <span className="file-item-name">{file.name}</span>
        <span className="file-item-meta">{ext}</span>
      </div>
    );
  };

  return (
    <div className="file-browser-view">
      <div className="section-header">
        <h1 className="section-title">{title} ({totalFiles})</h1>
        {isSources && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {processedCount} extracted
          </span>
        )}
      </div>

      <div className="file-browser">
        {/* Left: File tree */}
        <div className="file-tree">
          <div className="file-tree-header">
            <Icon name="folder" size={14} />
            {root}
          </div>

          {/* Root-level files (flat, no collapsible container) */}
          {rootFiles.map(renderFileRow)}

          {/* Sorted folder groups */}
          {Object.entries(folders).sort(([a], [b]) => a.localeCompare(b)).map(([folder, folderFiles]) => {
            const isCollapsed = collapsedFolders[folder];
            return (
              <div key={folder} className="file-folder">
                <div
                  className={`file-folder-name ${isCollapsed ? 'collapsed' : ''}`}
                  onClick={() => toggleFolder(folder)}
                >
                  <Icon name="chevron-down" size={14} />
                  <Icon name={isCollapsed ? 'folder' : 'folder-open'} size={14} />
                  <span style={{ flex: 1 }}>{folder}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {folderFiles.length}
                  </span>
                </div>

                {!isCollapsed && folderFiles.map(renderFileRow)}
              </div>
            );
          })}
        </div>

        {/* Right: Preview pane */}
        <div className="file-preview">
          {!selectedFile && (
            <div className="file-preview-empty">
              <div style={{ textAlign: 'center' }}>
                <Icon name="eye" size={32} />
                <p style={{ marginTop: 8 }}>Select a file to preview</p>
              </div>
            </div>
          )}

          {previewLoading && (
            <div className="file-preview-empty">Loading preview...</div>
          )}

          {preview && !previewLoading && (() => {
            // Lookup extraction status for current file
            const selNorm = selectedFile?.replace('01_Sources/', '').normalize('NFC').trim();
            const mapEntry = isSources && selNorm ? statusMap[selNorm] : null;
            return (
            <>
              <div className="file-preview-header">
                <span className="file-preview-title">{selectedFile?.split('/').pop()}</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {isSources && mapEntry?.status === 'processed' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--verified-fg)' }}>
                      <span className="file-status-dot processed" />
                      Processed — {mapEntry.claims || 0} claim{mapEntry.claims !== 1 ? 's' : ''}
                    </span>
                  )}
                  {isSources && !mapEntry && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      <span className="file-status-dot unsupported" />
                      Not extracted
                    </span>
                  )}
                  {isSources && mapEntry && mapEntry.status !== 'processed' && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--pending-fg)' }}>
                      <span className="file-status-dot pending" />
                      {mapEntry.status}
                    </span>
                  )}
                  {preview.type === 'external' && (
                    <a
                      href={preview.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm"
                    >
                      <Icon name="external-link" size={14} /> Open in Browser
                    </a>
                  )}
                </div>
              </div>

              {preview.type === 'markdown' && preview.data?.html && (
                <div className="md-content" dangerouslySetInnerHTML={{ __html: preview.data.html }} />
              )}

              {preview.type === 'markdown' && !preview.data?.html && preview.data?.raw && (
                <pre style={{ fontSize: '0.82rem', whiteSpace: 'pre-wrap', color: 'var(--text-muted)' }}>
                  {preview.data.raw}
                </pre>
              )}

              {preview.type === 'image' && (
                <img src={preview.path} alt="" className="file-preview-image" />
              )}

              {preview.type === 'external' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Icon name="external-link" size={32} />
                  <p style={{ marginTop: 8 }}>
                    This file opens in your browser.
                  </p>
                  <a href={preview.url} target="_blank" rel="noopener noreferrer" className="btn btn-accent" style={{ marginTop: 12 }}>
                    Open {preview.name}
                  </a>
                </div>
              )}

              {preview.type === 'binary' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <Icon name="file" size={32} />
                  <p style={{ marginTop: 8 }}>
                    <strong>{preview.name}</strong> ({preview.ext.toUpperCase()})
                  </p>
                  <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
                    This file type can't be previewed in the browser.
                  </p>
                  <button
                    className="btn btn-accent"
                    style={{ marginTop: 12 }}
                    onClick={() => handleOpenExternal(preview.path)}
                  >
                    <Icon name="external-link" size={14} /> Open with System App
                  </button>
                </div>
              )}

              {preview.type === 'error' && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--conflict-fg)' }}>
                  <Icon name="alert-triangle" size={32} />
                  <p style={{ marginTop: 8 }}>Failed to load preview.</p>
                </div>
              )}
            </>
          );
          })()}
        </div>
      </div>
    </div>
  );
}
