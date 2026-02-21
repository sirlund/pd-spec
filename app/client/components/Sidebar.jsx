import React from 'react';

const SECTIONS = [
  {
    title: 'Research',
    items: ['dashboard', 'insights', 'conflicts', 'extractions'],
  },
  {
    title: 'Structure',
    items: ['sources', 'system-map', 'brief'],
  },
  {
    title: 'Deliverables',
    items: ['outputs'],
  },
];

export default function Sidebar({ views, activeView, onNavigate, counts }) {
  return (
    <aside className="app-sidebar">
      {SECTIONS.map((section) => (
        <div key={section.title} className="nav-section">
          <div className="nav-section-title">{section.title}</div>
          {section.items.map((key) => {
            const v = views[key];
            const count = counts[key];
            return (
              <div
                key={key}
                className={`nav-item ${activeView === key ? 'active' : ''}`}
                onClick={() => onNavigate(key)}
              >
                <span>{v.icon}</span>
                <span>{v.label}</span>
                {count != null && count > 0 && (
                  <span className="count">{count}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
