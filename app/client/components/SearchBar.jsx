import React, { useState, useRef, useEffect, useCallback } from 'react';
import Icon from './ui/Icon.jsx';
import { StatusBadge, IdBadge } from './ui/Badge.jsx';

const CATEGORIES = [
  { key: 'insights', label: 'Insights', icon: 'diamond', nav: (r) => r.id },
  { key: 'conflicts', label: 'Conflicts', icon: 'bolt', nav: (r) => r.id },
  { key: 'modules', label: 'System Map', icon: 'sitemap', nav: () => 'system-map' },
  { key: 'claims', label: 'Extractions', icon: 'list-details', nav: () => 'extractions' },
  { key: 'sources', label: 'Sources', icon: 'folders', nav: () => 'sources' },
];

export default function SearchBar({ value, onChange, onNavigate }) {
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const doSearch = useCallback(async (query) => {
    if (!query || query.length < 2) { setResults(null); return; }

    // Direct ID navigation
    const idMatch = query.match(/\b(IG-[A-Z0-9-]+|CF-\d+)\b/gi);
    if (idMatch) {
      setResults({
        insights: idMatch.filter(m => m.toUpperCase().startsWith('IG')).map(m => ({
          id: m.toUpperCase(), text: `Go to ${m.toUpperCase()}`,
        })),
        conflicts: idMatch.filter(m => m.toUpperCase().startsWith('CF')).map(m => ({
          id: m.toUpperCase(), text: `Go to ${m.toUpperCase()}`,
        })),
        modules: [], claims: [], sources: [],
      });
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      setResults(await res.json());
    } catch {
      setResults(null);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 200);
    return () => clearTimeout(debounceRef.current);
  }, [value, doSearch]);

  // Flatten results for keyboard navigation
  const flatResults = results
    ? CATEGORIES.flatMap(cat =>
        (results[cat.key] || []).map(r => ({ ...r, category: cat }))
      )
    : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && flatResults.length > 0) {
      const first = flatResults[0];
      onNavigate(first.category.nav(first));
      onChange('');
      inputRef.current?.blur();
    }
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  const hasResults = flatResults.length > 0;

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
          placeholder="Search insights, conflicts, sources..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {focused && hasResults && (
        <div className="search-dropdown">
          {CATEGORIES.map(cat => {
            const items = results?.[cat.key] || [];
            if (items.length === 0) return null;
            return (
              <div key={cat.key}>
                <div className="search-category">
                  <Icon name={cat.icon} size={12} />
                  {cat.label}
                </div>
                {items.map((r, i) => (
                  <div
                    key={`${cat.key}-${i}`}
                    className="search-result"
                    onMouseDown={() => { onNavigate(cat.nav(r)); onChange(''); }}
                  >
                    {(cat.key === 'insights' || cat.key === 'conflicts') && r.id
                      ? <IdBadge id={r.id} />
                      : <Icon name={cat.icon} size={14} />
                    }
                    <span style={{
                      color: 'var(--text-muted)', flex: 1, minWidth: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {r.text}
                    </span>
                    {r.source && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {r.source.split('/').pop()}
                      </span>
                    )}
                    {r.status && <StatusBadge status={r.status} />}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
