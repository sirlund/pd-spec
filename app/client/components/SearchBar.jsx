import React, { useState, useRef, useEffect, useCallback } from 'react';

export default function SearchBar({ value, onChange, onNavigate }) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Search across all API data
  const doSearch = useCallback(async (query) => {
    if (!query || query.length < 2) { setResults([]); return; }

    // Check for direct ID references first
    const idMatch = query.match(/\b(IG-[A-Z0-9-]+|CF-\d+)\b/gi);
    if (idMatch) {
      setResults(idMatch.map(m => ({
        id: m.toUpperCase(),
        type: m.toUpperCase().startsWith('IG') ? 'insight' : 'conflict',
        text: `Go to ${m.toUpperCase()}`,
      })));
      return;
    }

    // Full-text search across insights and conflicts
    setSearching(true);
    try {
      const [insightsRes, conflictsRes] = await Promise.all([
        fetch('/api/insights').then(r => r.json()),
        fetch('/api/conflicts').then(r => r.json()),
      ]);

      const q = query.toLowerCase();
      const matches = [];

      // Search insights
      for (const ig of (insightsRes.insights || [])) {
        const searchable = [ig.id, ig.title, ig.concept, ig.narrative, ig.category, ig.voice]
          .filter(Boolean).join(' ').toLowerCase();
        if (searchable.includes(q)) {
          matches.push({
            id: ig.id,
            type: 'insight',
            text: ig.title || ig.concept || ig.id,
            status: ig.status,
          });
        }
        if (matches.length >= 8) break;
      }

      // Search conflicts
      for (const cf of (conflictsRes.conflicts || [])) {
        const searchable = [cf.id, cf.title, cf.description, cf.claims?.join(' ')]
          .filter(Boolean).join(' ').toLowerCase();
        if (searchable.includes(q)) {
          matches.push({
            id: cf.id,
            type: 'conflict',
            text: cf.title || cf.description || cf.id,
            status: cf.status,
          });
        }
        if (matches.length >= 10) break;
      }

      setResults(matches);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 200);
    return () => clearTimeout(debounceRef.current);
  }, [value, doSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && results.length > 0) {
      onNavigate(results[0].id);
      onChange('');
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: '0.85rem', color: 'var(--color-text-muted)',
        }}>
          {searching ? '...' : '⌕'}
        </span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search insights, conflicts, or type [IG-XX]..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {focused && results.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
          padding: 4, maxHeight: 300, overflowY: 'auto',
        }}>
          {results.map(r => (
            <div
              key={r.id}
              style={{
                padding: '6px 10px', cursor: 'pointer', borderRadius: 4,
                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseDown={() => { onNavigate(r.id); onChange(''); }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span className={`badge ${r.type === 'insight' ? 'badge-insight' : 'badge-conflict'}`}>
                {r.id}
              </span>
              <span style={{
                color: 'var(--color-text-secondary)', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {r.text}
              </span>
              {r.status && (
                <span className={`badge badge-${r.status.toLowerCase()}`} style={{ fontSize: '0.6rem' }}>
                  {r.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
