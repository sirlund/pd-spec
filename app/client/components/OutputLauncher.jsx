import React from 'react';
import { useLiveData } from '../hooks.js';

const TYPE_ICONS = {
  PRD: '📋', Dashboard: '📊', Presentation: '🎤',
  Personas: '👤', 'Journey Map': '🗺️', 'Lean Canvas': '📐',
  'User Stories': '📖', Benchmark: '📈', Report: '📄',
  Audit: '🔍', Document: '📄',
};

export default function OutputLauncher() {
  const { data, loading } = useLiveData('/outputs', ['03_Outputs/']);

  if (loading) {
    return <div className="empty-state"><div className="empty-state-text">Loading outputs...</div></div>;
  }

  if (!data?.outputs || data.outputs.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">◳</div>
        <div className="empty-state-title">No outputs yet</div>
        <div className="empty-state-text">
          Run <code>/ship [type]</code> to generate deliverables.
        </div>
      </div>
    );
  }

  // Separate main outputs from custom
  const mainOutputs = data.outputs.filter(o => !o.path.includes('_custom/'));
  const customOutputs = data.outputs.filter(o => o.path.includes('_custom/'));

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">Outputs ({data.outputs.length})</h1>
      </div>

      {mainOutputs.length > 0 && (
        <div className="output-grid">
          {mainOutputs.map(output => (
            <OutputCard key={output.path} output={output} />
          ))}
        </div>
      )}

      {customOutputs.length > 0 && (
        <>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-muted)', margin: '24px 0 12px' }}>
            Custom Outputs
          </h3>
          <div className="output-grid">
            {customOutputs.map(output => (
              <OutputCard key={output.path} output={output} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function OutputCard({ output }) {
  const icon = TYPE_ICONS[output.type] || '📄';
  const date = new Date(output.modified);
  const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const sizeStr = output.size > 1024 * 1024
    ? `${(output.size / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(output.size / 1024)} KB`;

  // Open in new tab via the /outputs static route
  const url = '/' + output.path.replace('03_Outputs/', 'outputs/');

  return (
    <div className="output-card">
      <span className="output-icon">{icon}</span>
      <div className="output-info">
        <div className="output-name">{output.name}</div>
        <div className="output-meta">{output.type} · {dateStr} · {sizeStr}</div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="btn">
        Open
      </a>
    </div>
  );
}
