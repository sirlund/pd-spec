import React from 'react';

export default function Card({ children, accent, className = '', ...props }) {
  const accentClass = accent ? `card-accent-${accent}` : '';
  return (
    <div className={`card ${accentClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
