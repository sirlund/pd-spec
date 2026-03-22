import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLiveData, useWebSocket } from './hooks.js';
import Icon from './components/ui/Icon.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './components/Dashboard.jsx';
import InsightsView from './components/InsightsView.jsx';
import ConflictsView from './components/ConflictsView.jsx';
import MarkdownView from './components/MarkdownView.jsx';
import StrategicVisionView from './components/StrategicVisionView.jsx';
import ProposalsView from './components/ProposalsView.jsx';
import EvidenceGapsView from './components/EvidenceGapsView.jsx';
import AddContextView from './components/AddContextView.jsx';
import AgentView from './components/AgentView.jsx';
import SettingsPanel from './components/SettingsPanel.jsx';
import FileBrowser from './components/FileBrowser.jsx';
import SearchBar from './components/SearchBar.jsx';

export const VIEW_REGISTRY = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard', section: 'research' },
  { id: 'insights', label: 'Insights', icon: 'diamond', section: 'research', countKey: 'insights' },
  { id: 'conflicts', label: 'Conflicts', icon: 'bolt', section: 'research', countKey: 'conflicts' },
  { id: 'extractions', label: 'Extractions', icon: 'list-details', section: 'research' },
  { id: 'evidence-gaps', label: 'Evidence Gaps', icon: 'alert-triangle', section: 'research', countKey: 'gaps' },
  { id: 'strategic-vision', label: 'Strategic Vision', icon: 'sitemap', section: 'structure' },
  { id: 'proposals', label: 'Proposals', icon: 'layout-list', section: 'structure' },
  { id: 'brief', label: 'Analysis', icon: 'file-text', section: 'structure' },
  { id: 'add-context', label: 'Add Context', icon: 'pencil-plus', section: 'tools' },
  { id: 'agent', label: 'Agent', icon: 'bot', section: 'tools' },
  { id: 'sources', label: 'Sources', icon: 'folders', section: 'browse' },
  { id: 'work', label: 'Work', icon: 'flask', section: 'browse' },
  { id: 'outputs', label: 'Outputs', icon: 'file-export', section: 'browse' },
];

export default function App() {
  const [view, setViewRaw] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [connected, setConnected] = useState(false);
  const [highlightId, setHighlightId] = useState(null);
  const [highlightPath, setHighlightPath] = useState(null);
  const [sessionToken, setSessionToken] = useState(() => localStorage.getItem('pd-session-token'));
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [agentNotification, setAgentNotification] = useState(false);

  // FileBrowser state preservation (BL-90: back/forward memory)
  const viewContextRef = useRef(null); // current FileBrowser's selectedFile
  const [restoredFile, setRestoredFile] = useState(null);

  // Scroll persistence across back/forward navigation
  const pendingScrollRef = useRef(null);

  // Decision state (ephemeral — lost on refresh)
  const [insightDecisions, setInsightDecisions] = useState({});
  const [conflictDecisions, setConflictDecisions] = useState({});

  const project = useLiveData('/project', ['PROJECT.md']);
  const dashboard = useLiveData('/dashboard', ['02_Work/']);

  useWebSocket(useCallback(() => { setConnected(true); }, []));

  const handleFileSelect = useCallback((filePath) => {
    viewContextRef.current = filePath;
  }, []);

  // --- Browser navigation (BL-90): pushState with state objects, NO URL changes ---
  const setView = useCallback((newView, opts = {}) => {
    if (!opts.fromPopState) {
      // Snapshot current view's selectedFile and scroll position into the current history entry
      const scrollTop = document.querySelector('.app-main')?.scrollTop || 0;
      history.replaceState({ view, highlightId, selectedFile: viewContextRef.current, scrollTop }, '');
      viewContextRef.current = null;
      setRestoredFile(null);
    }
    setViewRaw(newView);
    if (newView === 'agent') setAgentNotification(false);
    if (!opts.fromPopState) {
      history.pushState({ view: newView, highlightId: opts.highlightId || null }, '');
    }
  }, [view, highlightId]);

  useEffect(() => {
    // Set initial state
    history.replaceState({ view: 'dashboard', highlightId: null }, '');

    const onPopState = (e) => {
      if (e.state?.view) {
        setViewRaw(e.state.view);
        setHighlightId(e.state.highlightId || null);
        setRestoredFile(e.state.selectedFile || null);
        viewContextRef.current = null;
        // Restore scroll position after render
        if (e.state.scrollTop != null) {
          pendingScrollRef.current = e.state.scrollTop;
          requestAnimationFrame(() => {
            const main = document.querySelector('.app-main');
            if (main && pendingScrollRef.current != null) {
              main.scrollTop = pendingScrollRef.current;
              pendingScrollRef.current = null;
            }
          });
        }
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = useCallback((id) => {
    if (!id) return;
    if (id.startsWith('IG-')) {
      setHighlightId(id);
      setView('insights', { highlightId: id });
    } else if (id.startsWith('CF-')) {
      setHighlightId(id);
      setView('conflicts', { highlightId: id });
    } else if (id.startsWith('source:')) {
      const filePath = id.replace('source:', '');
      setHighlightPath(filePath);
      setView('extractions');
      setTimeout(() => setHighlightPath(null), 3000);
    } else if (VIEW_REGISTRY.some(v => v.id === id)) {
      setView(id);
    }
  }, [setView]);

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
        return <MarkdownView path="/extractions" title="Extractions" parsed onNavigate={navigateTo} highlightPath={highlightPath} />;
      case 'evidence-gaps':
        return <EvidenceGapsView onNavigate={navigateTo} />;
      case 'strategic-vision':
        return <StrategicVisionView onNavigate={navigateTo} />;
      case 'proposals':
        return <ProposalsView onNavigate={navigateTo} />;
      case 'brief':
        return <MarkdownView path="/file/02_Work/ANALYSIS.md" title="Analysis" onNavigate={navigateTo} />;
      case 'add-context':
        return <AddContextView projectName={project.data?.name} />;
      case 'agent':
        return null; // AgentView always mounted outside renderView()
      case 'sources':
        return <FileBrowser key="sources" root="01_Sources" title="Sources" onNavigate={navigateTo} onFileSelect={handleFileSelect} initialFile={restoredFile} />;
      case 'work':
        return <FileBrowser key="work" root="02_Work" title="Work" onNavigate={navigateTo} onFileSelect={handleFileSelect} initialFile={restoredFile} />;
      case 'outputs':
        return <FileBrowser key="outputs" root="03_Outputs" title="Outputs" onNavigate={navigateTo} onFileSelect={handleFileSelect} initialFile={restoredFile} />;
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
          <button
            className="theme-toggle"
            onClick={() => setSettingsOpen(true)}
            title="Settings"
            style={sessionToken ? { borderColor: 'var(--verified-fg)' } : {}}
          >
            <Icon name="settings" size={16} />
          </button>
        </div>
        <SearchBar value={searchQuery} onChange={setSearchQuery} onNavigate={navigateTo} />
      </header>

      <Sidebar
        views={VIEW_REGISTRY}
        activeView={view}
        onNavigate={setView}
        counts={counts}
        decisionCount={decisionCount}
        agentNotification={agentNotification}
      />

      <main className="app-main">
        {renderView()}
        <AgentView
          sessionToken={sessionToken}
          onNavigate={navigateTo}
          visible={view === 'agent'}
          onStatusChange={(status) => {
            if (status === 'done' && view !== 'agent') setAgentNotification(true);
          }}
        />
      </main>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        sessionToken={sessionToken}
        onSessionChange={setSessionToken}
      />
    </div>
  );
}
