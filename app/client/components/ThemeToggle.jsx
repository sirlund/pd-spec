import React, { useState, useEffect } from 'react';
import Icon from './ui/Icon.jsx';

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('pd-theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('pd-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <button className="theme-toggle" onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
  );
}
