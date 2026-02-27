/**
 * @module Modal
 * @description Reusable modal dialog component with overlay backdrop.
 */

import React from 'react';

/**
 * Modal dialog component with a backdrop overlay.
 * Clicking the overlay closes the modal; clicks inside the modal are stopped from propagating.
 * @param {Object} props
 * @param {string} props.title - Title displayed in the modal header
 * @param {Function} props.onClose - Callback invoked when the modal should close
 * @param {React.ReactNode} props.children - Content to render inside the modal body
 * @returns {React.ReactElement} The rendered modal with overlay
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
