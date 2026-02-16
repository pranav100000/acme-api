import React from 'react';

/**
 * Reusable modal dialog component.
 *
 * Renders a centered overlay with a content panel. Clicking outside the panel
 * (on the overlay backdrop) triggers `onClose`. Event propagation is stopped
 * on the inner panel so clicks inside it don't dismiss the modal.
 *
 * @param {string}   title    - Text displayed in the modal header.
 * @param {Function} onClose  - Callback invoked when the modal should close.
 * @param {React.ReactNode} children - Body content rendered inside the modal.
 */
export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* stopPropagation prevents clicks inside the modal from closing it */}
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: '20px' }}>✕</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
