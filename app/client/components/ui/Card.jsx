import React, { forwardRef } from 'react';

const Card = forwardRef(function Card({ children, accent, className = '', ...props }, ref) {
  const accentClass = accent ? `card-accent-${accent}` : '';
  return (
    <div ref={ref} className={`card ${accentClass} ${className}`} {...props}>
      {children}
    </div>
  );
});

export default Card;
