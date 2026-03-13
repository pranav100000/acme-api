import React from 'react';
import { getInitials } from '../utils/formatters';

export default function Avatar({ name, size = 36, fontSize = 13 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: '#4f46e5',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${fontSize}px`,
        fontWeight: '600',
        flexShrink: 0,
      }}
    >
      {getInitials(name) || '?'}
    </div>
  );
}
