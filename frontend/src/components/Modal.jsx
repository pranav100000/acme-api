/**
 * Reusable modal dialog component.
 *
 * Renders a centered overlay with a titled content panel. Clicking the
 * backdrop or the close button triggers the `onClose` callback.
 *
 * @param {string}   title    - Text displayed in the modal header.
 * @param {Function} onClose  - Called when the user dismisses the modal.
 * @param {React.ReactNode} children - Body content rendered inside the modal.
 */
import React from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    // Clicking the semi-transparent overlay closes the modal
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop propagation so clicks inside the modal don't trigger onClose */}
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
