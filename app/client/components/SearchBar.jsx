import React, { useState, useRef, useEffect } from 'react';

export default function SearchBar({ value, onChange, onNavigate }) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  // Extract PD-Spec references from input
  useEffect(() => {
    if (!value) { setSuggestions([]); return; }

    const matches = value.match(/\b(IG-[A-Z0-9-]+|CF-\d+)\b/gi);
    if (matches) {
      setSuggestions(matches.map(m => m.toUpperCase()));
    } else {
      setSuggestions([]);
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestions.length > 0) {
      onNavigate(suggestions[0]);
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
          ⌕
        </span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search [IG-XX] or [CF-XX]..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {focused && suggestions.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
          background: 'var(--color-surface)', border: '1px solid var(--color-border)',
          borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10,
          padding: 4,
        }}>
          {suggestions.map(s => (
            <div
              key={s}
              style={{
                padding: '6px 10px', cursor: 'pointer', borderRadius: 4,
                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6,
              }}
              onMouseDown={() => { onNavigate(s); onChange(''); }}
              onMouseOver={(e) => e.currentTarget.style.background = 'var(--color-bg)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span className={`badge ${s.startsWith('IG') ? 'badge-insight' : 'badge-conflict'}`}>
                {s}
              </span>
              <span style={{ color: 'var(--color-text-muted)' }}>Go to {s.startsWith('IG') ? 'insight' : 'conflict'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
