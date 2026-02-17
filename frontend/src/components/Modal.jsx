import React from 'react';

/**
 * Reusable modal dialog with a backdrop overlay.
 * Clicking the overlay closes the modal; clicking inside the modal does not
 * (thanks to stopPropagation).
 *
 * @param {string}   title eee   - Heading displayed at the top of the modal.
 * @param {function} onClose  - Callback invoked when the user dismisses the modal.
 * @param {React.ReactNode} children - Body content rendered inside the modal.
 */
export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
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
