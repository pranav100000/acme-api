import React from 'react';

/**
 * Reusable modal dialog component.
 * Renders a centered overlay that closes when clicking outside the modal body.
 *
 * @param {string}    title    - Heading displayed in the modal header
 * @param {function}  onClose  - Callback fired when the overlay or close button is clicked
 * @param {ReactNode} children - Content rendered inside the modal body
 */
export default function Modal({ title, onClose, children }) {
  return (
    // Clicking the overlay backdrop dismisses the modal
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
