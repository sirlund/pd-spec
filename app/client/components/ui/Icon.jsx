import React from 'react';

export default function Icon({ name, size = 20, className = '', spin = false }) {
  return (
    <svg
      className={`icon ${className}${spin ? ' icon-spin' : ''}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg?v=3#icon-${name}`} />
    </svg>
  );
}
