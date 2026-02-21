import React, { useState, useCallback } from 'react';
import { useLiveData, useWebSocket } from './hooks.js';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import InsightsView from './components/InsightsView.jsx';
import ConflictsView from './components/ConflictsView.jsx';
import SourceBrowser from './components/SourceBrowser.jsx';
import MarkdownView from './components/MarkdownView.jsx';
import OutputLauncher from './components/OutputLauncher.jsx';
import SearchBar from './components/SearchBar.jsx';

const VIEWS = {
  dashboard: { label: 'Dashboard', icon: '◉' },
  insights: { label: 'Insights', icon: '◆' },
  conflicts: { label: 'Conflicts', icon: '⚡' },
  extractions: { label: 'Extractions', icon: '▤' },
  sources: { label: 'Sources', icon: '◫' },
  'system-map': { label: 'System Map', icon: '⬡' },
  brief: { label: 'Research Brief', icon: '▧' },
  outputs: { label: 'Outputs', icon: '◳' },
};

export default function App() {
  const [view, setView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  const project = useLiveData('/project', ['PROJECT.md']);
  const dashboard = useLiveData('/dashboard', ['02_Work/']);

  // Global WebSocket for connection status
  useWebSocket(useCallback(() => {
    setConnected(true);
  }, []));

  // Navigate to a specific insight/conflict by ID
  const navigateTo = useCallback((id) => {
    if (id.startsWith('IG-')) {
      setView('insights');
      setHighlightId(id);
    } else if (id.startsWith('CF-')) {
      setView('conflicts');
      setHighlightId(id);
    }
  }, []);

  // Counts for sidebar
  const counts = dashboard.data ? {
    insights: dashboard.data.pipeline.insights,
    conflicts: dashboard.data.pipeline.conflicts,
    claims: dashboard.data.pipeline.claims,
    sources: dashboard.data.pipeline.sources,
  } : {};

  return (
    <div className="app-layout">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>
            {project.data?.name || 'PD-Spec'}
          </span>
          {project.data?.version && (
            <span className="badge" style={{ background: '#F0F0F0', color: '#666' }}>
              {project.data.version}
            </span>
          )}
          <div className="live-dot" title="Live — watching for changes" />
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onNavigate={navigateTo} />
      </header>

      <Sidebar
        views={VIEWS}
        activeView={view}
        onNavigate={setView}
        counts={counts}
      />

      <main className="app-main">
        {view === 'dashboard' && (
          <Dashboard data={dashboard.data} loading={dashboard.loading} onNavigate={navigateTo} />
        )}
        {view === 'insights' && (
          <InsightsView
            highlightId={highlightId}
            onHighlightClear={() => setHighlightId(null)}
            onNavigate={navigateTo}
          />
        )}
        {view === 'conflicts' && (
          <ConflictsView
            highlightId={highlightId}
            onHighlightClear={() => setHighlightId(null)}
            onNavigate={navigateTo}
          />
        )}
        {view === 'extractions' && (
          <MarkdownView
            path="/extractions"
            title="Extractions"
            parsed
            onNavigate={navigateTo}
          />
        )}
        {view === 'sources' && <SourceBrowser />}
        {view === 'system-map' && (
          <MarkdownView
            path="/file/02_Work/SYSTEM_MAP.md"
            title="System Map"
            onNavigate={navigateTo}
          />
        )}
        {view === 'brief' && (
          <MarkdownView
            path="/file/02_Work/RESEARCH_BRIEF.md"
            title="Research Brief"
            onNavigate={navigateTo}
          />
        )}
        {view === 'outputs' && <OutputLauncher />}
      </main>
    </div>
  );
}
