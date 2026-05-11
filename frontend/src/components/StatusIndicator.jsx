export default function StatusIndicator({ healthy }) {
	return (
		<div className="status-indicator">
			<span
				className={`status-dot ${healthy ? "status-dot-healthy" : "status-dot-unhealthy"}`}
			></span>
			<span className="status-label">
				API {healthy ? "Healthy" : "Unhealthy"}
			</span>
		</div>
	);
}
