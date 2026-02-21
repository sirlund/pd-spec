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

/** Hook: WebSocket connection for live updates */
export function useWebSocket(onMessage) {
  const wsRef = useRef(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch { /* ignore parse errors */ }
    };

    ws.onclose = () => {
      // Reconnect after 2 seconds
      setTimeout(() => {
        if (wsRef.current === ws) {
          wsRef.current = null;
        }
      }, 2000);
    };

    return () => {
      ws.close();
    };
  }, []);

  return wsRef;
}

/** Hook: live data that refetches on file changes */
export function useLiveData(path, watchPatterns = []) {
  const api = useApi(path);
  const patternsRef = useRef(watchPatterns);
  patternsRef.current = watchPatterns;

  useWebSocket(useCallback((msg) => {
    if (msg.type === 'file-change') {
      const patterns = patternsRef.current;
      if (patterns.length === 0 || patterns.some(p => msg.path.includes(p))) {
        api.refetch();
      }
    }
  }, [api.refetch]));

  return api;
}
