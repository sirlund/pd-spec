import React from 'react';

export default function AccentBox({ children, className = '' }) {
  return (
    <div className={`accent-box ${className}`}>
      {children}
    </div>
  );
}
