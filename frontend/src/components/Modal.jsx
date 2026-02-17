/**
 * @module Modal
 * @description Reusable modal dialog component with overlay backdrop,
 * header with title and close button, and a body for custom content.
 */

import React from 'react';

/**
 * A generic modal dialog with a backdrop overlay.
 * Clicking the overlay closes the modal; clicking inside the modal does not.
 *
 * @param {Object} props
 * @param {string} props.title - The title displayed in the modal header
 * @param {Function} props.onClose - Callback invoked when the modal should close
 * @param {React.ReactNode} props.children - The content to render inside the modal body
 * @returns {JSX.Element} The modal overlay and dialog
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
