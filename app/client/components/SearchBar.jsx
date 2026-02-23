import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from './ui/Icon.jsx';
import { StatusBadge, IdBadge } from './ui/Badge.jsx';

export default function SearchBar({ value, onChange, onNavigate }) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (query) => {
    if (!query || query.length < 2) { setResults([]); return; }

    const idMatch = query.match(/\b(IG-[A-Z0-9-]+|CF-\d+)\b/gi);
    if (idMatch) {
      setResults(idMatch.map(m => ({
        id: m.toUpperCase(),
        type: m.toUpperCase().startsWith('IG') ? 'insight' : 'conflict',
        text: `Go to ${m.toUpperCase()}`,
      })));
      return;
    }

    setSearching(true);
    try {
      const [insightsRes, conflictsRes] = await Promise.all([
        fetch('/api/insights').then(r => r.json()),
        fetch('/api/conflicts').then(r => r.json()),
      ]);

      const q = query.toLowerCase();
      const matches = [];

      for (const ig of (insightsRes.insights || [])) {
        const searchable = [ig.id, ig.title, ig.concept, ig.narrative, ig.category, ig.voice]
          .filter(Boolean).join(' ').toLowerCase();
        if (searchable.includes(q)) {
          matches.push({ id: ig.id, type: 'insight', text: ig.title || ig.concept || ig.id, status: ig.status });
        }
        if (matches.length >= 8) break;
      }

      for (const cf of (conflictsRes.conflicts || [])) {
        const searchable = [cf.id, cf.title, cf.description, cf.claims?.join(' ')]
          .filter(Boolean).join(' ').toLowerCase();
        if (searchable.includes(q)) {
          matches.push({ id: cf.id, type: 'conflict', text: cf.title || cf.description || cf.id, status: cf.status });
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
    <div className="search-container">
      <div style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', display: 'flex',
        }}>
          <Icon name="search" size={14} />
        </span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search insights, conflicts..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {focused && results.length > 0 && (
        <div className="search-dropdown">
          {results.map(r => (
            <div
              key={r.id}
              className="search-result"
              onMouseDown={() => { onNavigate(r.id); onChange(''); }}
            >
              <IdBadge id={r.id} />
              <span style={{
                color: 'var(--text-muted)', flex: 1, minWidth: 0,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {r.text}
              </span>
              {r.status && <StatusBadge status={r.status} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
