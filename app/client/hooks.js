import { useState, useEffect, useCallback, useRef } from 'react';

const API_BASE = '/api';

/** Fetch JSON from API with error handling */
async function fetchApi(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

/** Hook: fetch data from API endpoint, refetch on invalidation */
export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchApi(path);
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}

// --- Singleton WebSocket with auto-reconnect ---

let ws = null;
let reconnectTimer = null;
const subscribers = new Set();

function connectWs() {
  if (ws || reconnectTimer) return;
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      for (const fn of subscribers) fn(data);
    } catch { /* ignore parse errors */ }
  };

  socket.onclose = () => {
    ws = null;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (subscribers.size > 0) connectWs();
    }, 2000);
  };

  ws = socket;
}

// Debug surface for QA observability (Playwright MCP) — stripped in production builds
if (import.meta.env.DEV) {
  window.__pdDebug = {
    get wsState() { return ws?.readyState ?? -1; },
    get wsUrl() { return ws?.url ?? null; },
    get subscriberCount() { return subscribers.size; },
  };
}

function subscribe(fn) {
  subscribers.add(fn);
  if (!ws && !reconnectTimer) connectWs();
  return () => { subscribers.delete(fn); };
}

/** Hook: subscribe to WebSocket messages (singleton connection) */
export function useWebSocket(onMessage) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    return subscribe((data) => onMessageRef.current(data));
  }, []);
}

/** Hook: execute script actions (verify-insight, resolve-conflict) */
export function useScriptAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (endpoint, body) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/scripts/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { execute, loading, error, clearError };
}

/** Hook: live data that refetches on file changes (debounced) */
export function useLiveData(path, watchPatterns = []) {
  const api = useApi(path);
  const patternsRef = useRef(watchPatterns);
  patternsRef.current = watchPatterns;
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useWebSocket(useCallback((msg) => {
    if (msg.type === 'file-change') {
      const patterns = patternsRef.current;
      if (patterns.length === 0 || patterns.some(p => msg.path.includes(p))) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => api.refetch(), 300);
      }
    }
  }, [api.refetch]));

  return api;
}
