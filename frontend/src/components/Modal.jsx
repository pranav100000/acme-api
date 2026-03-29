export default function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay">
      <button
        aria-label="Close modal"
        className="modal-backdrop"
        onClick={onClose}
        type="button"
      />
      <div aria-label={title} aria-modal="true" className="modal" role="dialog">
        <div className="modal-header">
          <h3>{title}</h3>
          <button
            className="btn-icon"
            onClick={onClose}
            style={{ fontSize: "20px" }}
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
