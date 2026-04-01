export default function Modal({ title, onClose, children }) {
	return (
		<div className="modal-overlay">
			<button
				type="button"
				aria-label="Close modal"
				onClick={onClose}
				className="modal-backdrop"
			/>
			<div className="modal" role="dialog" aria-modal="true">
				<div className="modal-header">
					<h3>{title}</h3>
					<button
						type="button"
						className="btn-icon"
						onClick={onClose}
						style={{ fontSize: "20px" }}
					>
						✕
					</button>
				</div>
				<div className="modal-body">{children}</div>
			</div>
		</div>
	);
}
