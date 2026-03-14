import React from 'react';

export default function PageHeader({ title, actions, children }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      {actions || children || null}
    </div>
  );
}
