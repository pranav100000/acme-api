/**
 * Reusable modal dialog component.
 * Renders a centered overlay with a titled content panel. Clicking the
 * backdrop (overlay) or the close button dismisses the modal via `onClose`.
 *
 * @param {string} title - Header text displayed at the top of the modal
 * @param {Function} onClose - Callback fired when the modal should close
 * @param {React.ReactNode} children - Modal body content
 */
import React from 'react';

export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* Stop propagation so clicks inside the modal don't trigger the overlay's onClose */}
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
