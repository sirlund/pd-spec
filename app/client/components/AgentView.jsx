import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from './ui/Icon.jsx';

/** Simple inline formatter: converts [IG-XX]/[CF-XX] refs to clickable badges */
function formatText(text) {
  if (!text) return '';
  return text.replace(
    /\[(IG-[A-Za-z0-9-]+|CF-\d+)\]/g,
    (_, ref) => {
      const cls = ref.startsWith('CF-') ? 'badge badge-conflict' : 'badge badge-insight';
      return `<span class="${cls}" data-ref="${ref}" style="cursor:pointer">${ref}</span>`;
    }
  );
}

const SKILLS = [
  { id: 'extract', label: '/extract', icon: 'list-details' },
  { id: 'analyze', label: '/analyze', icon: 'diamond' },
  { id: 'spec', label: '/spec', icon: 'sitemap' },
];

export default function AgentView({ sessionToken, onNavigate }) {
  const [mode, setMode] = useState(null); // null | 'qa' | 'skill'
  const [skill, setSkill] = useState(null);
  const [log, setLog] = useState([]);
  const [interaction, setInteraction] = useState(null);
  const [running, setRunning] = useState(false);
  const [qaInput, setQaInput] = useState('');
  const [qaResponse, setQaResponse] = useState(null);
  const logEndRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log, interaction]);

  const startSSE = useCallback((body) => {
    setRunning(true);
    const controller = new AbortController();
    abortRef.current = controller;

    fetch('/api/claude/run', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Token': sessionToken,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }));
        setLog(prev => [...prev, { type: 'error', content: err.error }]);
        setRunning(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          let event;
          try {
            event = JSON.parse(line.slice(6));
          } catch { continue; }

          switch (event.type) {
            case 'text':
              setLog(prev => [...prev, { type: 'text', content: event.content }]);
              if (mode === 'qa') setQaResponse(prev => (prev || '') + event.content);
              break;
            case 'tool_start':
              setLog(prev => [...prev, { type: 'tool', tool: event.tool, input: event.input, status: 'running' }]);
              break;
            case 'tool_done':
              setLog(prev => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                  if (updated[i].type === 'tool' && updated[i].status === 'running') {
                    updated[i] = { ...updated[i], status: 'done', summary: event.summary };
                    break;
                  }
                }
                return updated;
              });
              break;
            case 'interaction':
              setInteraction({ tool: event.tool, input: event.input, toolUseId: event.toolUseId });
              break;
            case 'waiting':
              setRunning(false);
              break;
            case 'continuing':
              break;
            case 'done':
              setRunning(false);
              setLog(prev => [...prev, { type: 'done', usage: event.usage }]);
              break;
            case 'aborted':
              setRunning(false);
              setLog(prev => [...prev, { type: 'aborted' }]);
              break;
            case 'error':
              setRunning(false);
              setLog(prev => [...prev, { type: 'error', content: event.message }]);
              break;
          }
        }
      }
      setRunning(false);
    }).catch(err => {
      if (err.name !== 'AbortError') {
        setLog(prev => [...prev, { type: 'error', content: err.message }]);
      }
      setRunning(false);
    });
  }, [sessionToken, mode]);

  const handleSkillClick = (skillId) => {
    setMode('skill');
    setSkill(skillId);
    setLog([]);
    setInteraction(null);
    setQaResponse(null);
    startSSE({ message: `/${skillId}` });
  };

  const handleQaSubmit = () => {
    if (!qaInput.trim()) return;
    setMode('qa');
    setLog([]);
    setQaResponse(null);
    setInteraction(null);
    startSSE({ message: qaInput.trim() });
    setQaInput('');
  };

  const handleCancel = async () => {
    abortRef.current?.abort();
    try {
      await fetch('/api/claude/run/cancel', {
        method: 'POST',
        headers: { 'X-Session-Token': sessionToken },
      });
    } catch { /* ok */ }
    setRunning(false);
    setLog(prev => [...prev, { type: 'aborted' }]);
  };

  const handleClear = () => {
    setMode(null);
    setSkill(null);
    setLog([]);
    setInteraction(null);
    setQaResponse(null);
  };

  const respondToInteraction = (value) => {
    setInteraction(null);
    setRunning(true);
    startSSE({ message: typeof value === 'string' ? value : JSON.stringify(value) });
  };

  // Group consecutive same-tool entries
  const groupedLog = [];
  let currentGroup = null;
  for (const entry of log) {
    if (entry.type === 'tool') {
      if (currentGroup && currentGroup.tool === entry.tool) {
        currentGroup.count++;
        currentGroup.items.push(entry);
      } else {
        if (currentGroup) groupedLog.push(currentGroup);
        currentGroup = { type: 'tool_group', tool: entry.tool, count: 1, items: [entry] };
      }
    } else {
      if (currentGroup) {
        groupedLog.push(currentGroup);
        currentGroup = null;
      }
      groupedLog.push(entry);
    }
  }
  if (currentGroup) groupedLog.push(currentGroup);

  if (!sessionToken) {
    return (
      <div style={{ maxWidth: 700 }}>
        <div className="section-header">
          <h1 className="section-title">Agent</h1>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><Icon name="bot" size={40} /></div>
          <div className="empty-state-title">API Key Required</div>
          <div className="empty-state-text">
            Connect your Claude API key in Settings (gear icon) to use the Agent.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-view">
      <div className="section-header">
        <h1 className="section-title">Agent</h1>
        {log.length > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={handleClear} disabled={running}>
            <Icon name="x" size={14} /> Clear
          </button>
        )}
      </div>

      {/* Mode bar */}
      <div className="agent-mode-bar">
        {SKILLS.map(s => (
          <button
            key={s.id}
            className={`btn btn-sm ${skill === s.id ? 'btn-accent' : ''}`}
            onClick={() => handleSkillClick(s.id)}
            disabled={running}
          >
            <Icon name={s.icon} size={14} /> {s.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {running && (
          <button className="btn btn-sm btn-reject" onClick={handleCancel}>
            <Icon name="x" size={14} /> Cancel
          </button>
        )}
      </div>

      {/* Progress Log */}
      {(groupedLog.length > 0 || running) && (
        <div className="agent-log">
          {groupedLog.map((entry, i) => (
            <LogEntry key={i} entry={entry} onNavigate={onNavigate} />
          ))}
          {running && (
            <div className="agent-log-entry agent-log-running">
              <span className="agent-spinner" /> Processing...
            </div>
          )}
          <div ref={logEndRef} />
        </div>
      )}

      {/* Interaction Panel */}
      {interaction && (
        <InteractionPanel
          interaction={interaction}
          onRespond={respondToInteraction}
        />
      )}

      {/* Q&A input */}
      {!running && !interaction && (
        <div className="agent-qa">
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              placeholder="Ask about your project..."
              value={qaInput}
              onChange={(e) => setQaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQaSubmit()}
            />
            <button
              className="btn btn-accent"
              onClick={handleQaSubmit}
              disabled={!qaInput.trim()}
            >
              Ask
            </button>
          </div>
        </div>
      )}

      {/* Q&A Response */}
      {qaResponse && !running && (
        <div className="agent-qa-response card">
          <div
            className="md-content"
            dangerouslySetInnerHTML={{ __html: formatText(qaResponse) }}
            onClick={(e) => {
              const badge = e.target.closest('[data-ref]');
              if (badge) onNavigate?.(badge.dataset.ref);
            }}
          />
        </div>
      )}
    </div>
  );
}

function LogEntry({ entry, onNavigate }) {
  const [expanded, setExpanded] = useState(false);

  if (entry.type === 'tool_group') {
    if (entry.count === 1) {
      return <ToolLogEntry entry={entry.items[0]} />;
    }
    return (
      <div className="agent-log-entry agent-log-group">
        <button className="btn-ghost btn-sm" onClick={() => setExpanded(!expanded)} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Icon name="chevron-down" size={12} style={expanded ? {} : { transform: 'rotate(-90deg)' }} />
          <Icon name="tool" size={12} />
          {entry.tool} ({entry.count} calls)
        </button>
        {expanded && entry.items.map((item, i) => (
          <ToolLogEntry key={i} entry={item} nested />
        ))}
      </div>
    );
  }

  if (entry.type === 'text') {
    return (
      <div
        className="agent-log-entry agent-log-text md-content"
        dangerouslySetInnerHTML={{ __html: formatText(entry.content) }}
        onClick={(e) => {
          const badge = e.target.closest('[data-ref]');
          if (badge) onNavigate?.(badge.dataset.ref);
        }}
      />
    );
  }

  if (entry.type === 'done') {
    const tokens = entry.usage
      ? `${entry.usage.input_tokens + entry.usage.output_tokens} tokens`
      : '';
    return (
      <div className="agent-log-entry agent-log-done">
        <Icon name="check" size={14} /> Done {tokens && <span style={{ color: 'var(--text-muted)' }}>({tokens})</span>}
      </div>
    );
  }

  if (entry.type === 'aborted') {
    return (
      <div className="agent-log-entry agent-log-aborted">
        <Icon name="x" size={14} /> Cancelled
      </div>
    );
  }

  if (entry.type === 'error') {
    return (
      <div className="agent-log-entry agent-log-error">
        <Icon name="alert-triangle" size={14} /> {entry.content}
      </div>
    );
  }

  return null;
}

function ToolLogEntry({ entry, nested }) {
  const icon = entry.status === 'done' ? 'check' : 'loader';
  const inputSummary = entry.input?.path || entry.input?.script || entry.input?.pattern || '';
  return (
    <div className={`agent-log-entry agent-log-tool ${nested ? 'nested' : ''}`}>
      <Icon name={icon} size={12} />
      <span className="agent-tool-name">{entry.tool}</span>
      {inputSummary && <span className="agent-tool-input">{inputSummary}</span>}
    </div>
  );
}

function InteractionPanel({ interaction, onRespond }) {
  const [textValue, setTextValue] = useState('');
  const [selected, setSelected] = useState(interaction.input.multiple ? [] : null);

  if (interaction.tool === 'ask_confirmation') {
    return (
      <div className="interaction-panel card">
        <div className="interaction-message">{interaction.input.message}</div>
        <div className="interaction-buttons">
          {interaction.input.options.map(opt => (
            <button
              key={opt.id}
              className="btn btn-accent"
              onClick={() => onRespond(opt.id)}
              title={opt.description}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (interaction.tool === 'ask_selection') {
    const isMultiple = interaction.input.multiple;
    return (
      <div className="interaction-panel card">
        <div className="interaction-message">{interaction.input.message}</div>
        <div className="radio-group" style={{ borderTop: 'none', marginTop: 0, paddingTop: 0 }}>
          {interaction.input.items.map(item => {
            const isSelected = isMultiple
              ? selected.includes(item.id)
              : selected === item.id;
            return (
              <div
                key={item.id}
                className={`radio-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isMultiple) {
                    setSelected(prev =>
                      prev.includes(item.id)
                        ? prev.filter(x => x !== item.id)
                        : [...prev, item.id]
                    );
                  } else {
                    setSelected(item.id);
                  }
                }}
              >
                <span className="radio-dot" />
                <span>{item.label}</span>
                {item.description && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</span>
                )}
              </div>
            );
          })}
        </div>
        <button
          className="btn btn-accent"
          style={{ marginTop: 8 }}
          onClick={() => onRespond(isMultiple ? selected : selected)}
          disabled={isMultiple ? selected.length === 0 : !selected}
        >
          Confirm
        </button>
      </div>
    );
  }

  if (interaction.tool === 'ask_text') {
    return (
      <div className="interaction-panel card">
        <div className="interaction-message">{interaction.input.message}</div>
        <textarea
          className="context-textarea"
          placeholder={interaction.input.placeholder || 'Type your response...'}
          value={textValue}
          onChange={(e) => setTextValue(e.target.value)}
          autoFocus
        />
        <button
          className="btn btn-accent"
          style={{ marginTop: 8 }}
          onClick={() => onRespond(textValue)}
          disabled={!textValue.trim()}
        >
          Submit
        </button>
      </div>
    );
  }

  return null;
}
