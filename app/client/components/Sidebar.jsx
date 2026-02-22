import React from 'react';
import Icon from './ui/Icon.jsx';

const SECTION_LABELS = {
  research: 'Research',
  structure: 'Structure',
  tools: 'Tools',
  deliverables: 'Deliverables',
};

const SECTION_ORDER = ['research', 'structure', 'tools', 'deliverables'];

export default function Sidebar({ views, activeView, onNavigate, counts, decisionCount }) {
  const grouped = {};
  for (const v of views) {
    if (!grouped[v.section]) grouped[v.section] = [];
    grouped[v.section].push(v);
  }

  return (
    <aside className="app-sidebar">
      {SECTION_ORDER.map((sectionId, si) => {
        const items = grouped[sectionId];
        if (!items) return null;
        return (
          <div key={sectionId}>
            {si > 0 && <div className="nav-divider" />}
            <div className="nav-section">
              <div className="nav-section-title">{SECTION_LABELS[sectionId]}</div>
              {items.map((v) => {
                const count = v.countKey ? counts[v.countKey] : undefined;
                return (
                  <div
                    key={v.id}
                    className={`nav-item ${activeView === v.id ? 'active' : ''}`}
                    onClick={() => onNavigate(v.id)}
                  >
                    <Icon name={v.icon} size={16} />
                    <span>{v.label}</span>
                    {count != null && count > 0 && (
                      <span className="count">{count}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {decisionCount > 0 && (
        <div className="nav-footer">
          <Icon name="check" size={14} />
          <span>{decisionCount} decision{decisionCount !== 1 ? 's' : ''} pending</span>
        </div>
      )}
    </aside>
  );
}
