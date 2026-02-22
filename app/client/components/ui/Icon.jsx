import React from 'react';

export default function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}
