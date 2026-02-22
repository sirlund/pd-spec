import React from 'react';

export default function ProgressBar({ segments, legend }) {
  // segments: [{ value: number, color: string, label?: string }]
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <div>
      <div className="progress-bar">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="progress-fill"
            style={{
              width: total > 0 ? `${(seg.value / total) * 100}%` : '0%',
              background: seg.color,
            }}
          />
        ))}
      </div>
      {legend && (
        <div className="progress-legend">
          {segments.filter(s => s.label).map((seg, i) => (
            <div key={i} className="progress-legend-item">
              <span className="progress-legend-dot" style={{ background: seg.color }} />
              <span>{seg.label} ({seg.value})</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
