import React, { useState, useCallback } from 'react';
import { useLiveData, useWebSocket } from './hooks.js';
import Icon from './components/ui/Icon.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import InsightsView from './components/InsightsView.jsx';
import ConflictsView from './components/ConflictsView.jsx';
import MarkdownView from './components/MarkdownView.jsx';
import SystemMapView from './components/SystemMapView.jsx';
import EvidenceGapsView from './components/EvidenceGapsView.jsx';
import AddContextView from './components/AddContextView.jsx';
import ActionsView from './components/ActionsView.jsx';
import FileBrowser from './components/FileBrowser.jsx';
import SearchBar from './components/SearchBar.jsx';

export const VIEW_REGISTRY = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', section: 'research' },
  { id: 'insights', label: 'Insights', icon: 'diamond', section: 'research', countKey: 'insights' },
  { id: 'conflicts', label: 'Conflicts', icon: 'bolt', section: 'research', countKey: 'conflicts' },
  { id: 'extractions', label: 'Extractions', icon: 'list-details', section: 'research' },
  { id: 'evidence-gaps', label: 'Evidence Gaps', icon: 'alert-triangle', section: 'research', countKey: 'gaps' },
  { id: 'system-map', label: 'System Map', icon: 'sitemap', section: 'structure' },
  { id: 'brief', label: 'Research Brief', icon: 'file-text', section: 'structure' },
  { id: 'add-context', label: 'Add Context', icon: 'pencil-plus', section: 'tools' },
  { id: 'actions', label: 'Actions', icon: 'send', section: 'tools' },
  { id: 'sources', label: 'Sources', icon: 'folders', section: 'browse' },
  { id: 'work', label: 'Work', icon: 'flask', section: 'browse' },
  { id: 'outputs', label: 'Outputs', icon: 'file-export', section: 'browse' },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  // Decision state (ephemeral — lost on refresh)
  const [insightDecisions, setInsightDecisions] = useState({});
  const [conflictDecisions, setConflictDecisions] = useState({});

  const project = useLiveData('/project', ['PROJECT.md']);
  const dashboard = useLiveData('/dashboard', ['02_Work/']);

  useWebSocket(useCallback(() => { setConnected(true); }, []));

  const navigateTo = useCallback((id) => {
    if (!id) return;
    if (id.startsWith('IG-')) {
      setView('insights');
      setHighlightId(id);
    } else if (id.startsWith('CF-')) {
      setView('conflicts');
      setHighlightId(id);
    } else if (VIEW_REGISTRY.some(v => v.id === id)) {
      setView(id);
    }
  }, []);

  const counts = dashboard.data ? {
    insights: dashboard.data.pipeline.insights,
    conflicts: dashboard.data.pipeline.conflicts,
    gaps: dashboard.data.evidence_gap_count || 0,
  } : {};

  const decisionCount = Object.keys(insightDecisions).length + Object.keys(conflictDecisions).length;

  const handleInsightDecision = useCallback((id, decision) => {
    setInsightDecisions(prev => {
      if (prev[id] === decision) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: decision };
    });
  }, []);

  const handleConflictDecision = useCallback((id, decision) => {
    setConflictDecisions(prev => ({ ...prev, [id]: decision }));
  }, []);

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard data={dashboard.data} loading={dashboard.loading} onNavigate={navigateTo} setView={setView} />;
      case 'insights':
        return (
          <InsightsView
            highlightId={highlightId}
            onHighlightClear={() => setHighlightId(null)}
            onNavigate={navigateTo}
            decisions={insightDecisions}
            onDecision={handleInsightDecision}
          />
        );
      case 'conflicts':
        return (
          <ConflictsView
            highlightId={highlightId}
            onHighlightClear={() => setHighlightId(null)}
            onNavigate={navigateTo}
            decisions={conflictDecisions}
            onDecision={handleConflictDecision}
          />
        );
      case 'extractions':
        return <MarkdownView path="/extractions" title="Extractions" parsed onNavigate={navigateTo} />;
      case 'evidence-gaps':
        return <EvidenceGapsView onNavigate={navigateTo} />;
      case 'system-map':
        return <SystemMapView onNavigate={navigateTo} />;
      case 'brief':
        return <MarkdownView path="/file/02_Work/RESEARCH_BRIEF.md" title="Research Brief" onNavigate={navigateTo} />;
      case 'add-context':
        return <AddContextView projectName={project.data?.name} />;
      case 'actions':
        return (
          <ActionsView
            insightDecisions={insightDecisions}
            conflictDecisions={conflictDecisions}
            decisionCount={decisionCount}
          />
        );
      case 'sources':
        return <FileBrowser key="sources" root="01_Sources" title="Sources" />;
      case 'work':
        return <FileBrowser key="work" root="02_Work" title="Work" />;
      case 'outputs':
        return <FileBrowser key="outputs" root="03_Outputs" title="Outputs" />;
      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {project.data?.name || 'PD-Spec'}
          </span>
          {project.data?.version && (
            <span className="badge badge-id" style={{ cursor: 'default' }}>
              {project.data.version}
            </span>
          )}
          <div className="live-dot" title="Live — watching for changes" />
          <ThemeToggle />
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onNavigate={navigateTo} />
      </header>

      <Sidebar
        views={VIEW_REGISTRY}
        activeView={view}
        onNavigate={setView}
        counts={counts}
        decisionCount={decisionCount}
      />

      <main className="app-main">
        {renderView()}
      </main>
    </div>
  );
}
