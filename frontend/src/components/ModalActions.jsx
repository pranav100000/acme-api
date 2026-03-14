import React from 'react';

export default function ModalActions({
  onCancel,
  cancelLabel = 'Cancel',
  submitLabel,
  loadingLabel,
  isLoading = false,
  submitDisabled = false,
  align = 'flex-end',
}) {
  return (
    <div className="form-actions" style={{ justifyContent: align }}>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        {cancelLabel}
      </button>
      {submitLabel && (
        <button type="submit" className="btn btn-primary" disabled={isLoading || submitDisabled}>
          {isLoading ? loadingLabel : submitLabel}
        </button>
      )}
    </div>
  );
}
