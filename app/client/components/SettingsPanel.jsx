import React, { useState, useEffect } from 'react';
import Icon from './ui/Icon.jsx';

export default function SettingsPanel({ open, onClose, sessionToken, onSessionChange }) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validating, setValidating] = useState(false);
  const [envAvailable, setEnvAvailable] = useState(false);

  // Check if env var API key is available
  useEffect(() => {
    fetch('/api/claude/env-available')
      .then(r => r.json())
      .then(d => setEnvAvailable(d.available))
      .catch(() => {});
  }, [open]);

  // On mount, validate existing session token
  useEffect(() => {
    if (sessionToken && open) {
      setValidating(true);
      fetch('/api/claude/session', {
        headers: { 'X-Session-Token': sessionToken },
      })
        .then(r => r.json())
        .then(d => {
          if (!d.valid) {
            localStorage.removeItem('pd-session-token');
            onSessionChange(null);
          }
        })
        .catch(() => {})
        .finally(() => setValidating(false));
    }
  }, [open]);

  const handleConnectFromEnv = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/claude/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromEnv: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('pd-session-token', data.sessionToken);
      onSessionChange(data.sessionToken);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!apiKey.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/claude/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('pd-session-token', data.sessionToken);
      onSessionChange(data.sessionToken);
      setApiKey('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (sessionToken) {
      await fetch('/api/claude/session', {
        method: 'DELETE',
        headers: { 'X-Session-Token': sessionToken },
      }).catch(() => {});
    }
    localStorage.removeItem('pd-session-token');
    onSessionChange(null);
  };

  if (!open) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel card" onClick={(e) => e.stopPropagation()}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <span className="card-title">Settings</span>
          <button className="btn btn-sm btn-ghost" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="label-mono" style={{ marginBottom: 12 }}>Claude API Key</div>

        {sessionToken ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="settings-dot connected" />
              <span style={{ fontSize: '0.85rem', color: 'var(--verified-fg)' }}>Connected</span>
            </div>
            <button className="btn btn-sm" onClick={handleDisconnect}>
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="settings-dot disconnected" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Not connected</span>
            </div>
            {envAvailable && (
              <button
                className="btn btn-accent"
                onClick={handleConnectFromEnv}
                disabled={loading}
                style={{ marginBottom: 12 }}
              >
                {loading ? 'Validating...' : 'Connect from server env'}
              </button>
            )}
            <div className="form-group">
              <input
                type="password"
                className="form-input"
                placeholder="sk-ant-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
              />
            </div>
            <button
              className="btn btn-accent"
              onClick={handleConnect}
              disabled={loading || !apiKey.trim()}
            >
              {loading ? 'Validating...' : 'Connect'}
            </button>
            {error && (
              <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--conflict-fg)' }}>
                {error}
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
          Your API key is stored in server memory only (never on disk). Session expires after 8 hours.
          Required for Agent features (/extract, /analyze, /spec, Q&A).
        </div>
      </div>
    </div>
  );
}
