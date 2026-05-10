import { useState } from "react";
import * as api from "../api";
import Modal from "./Modal";

export default function AddMemberModal({ team, users, currentMembers, onClose, onAdded }) {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const currentMemberIds = currentMembers.filter(Boolean).map((m) => m.id);
	const availableUsers = users.filter(
		(u) => !currentMemberIds.includes(u.id) && u.status === "active",
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedUserId) return;
		setError("");
		setLoading(true);
		try {
			await api.addTeamMember(team.id, selectedUserId);
			onAdded();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title={`Add Member to ${team.name}`} onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			{availableUsers.length === 0 ? (
				<div style={{ textAlign: "center", padding: "24px", color: "#6b7280" }}>
					<p>All active users are already members of this team.</p>
					<div className="form-actions" style={{ justifyContent: "center" }}>
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="team-member-user">Select User</label>
						<select
							id="team-member-user"
							className="form-control"
							value={selectedUserId}
							onChange={(e) => setSelectedUserId(e.target.value)}
							required
						>
							<option value="">Choose a user...</option>
							{availableUsers.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name} ({user.email}) - {user.role.replace("_", " ")}
								</option>
							))}
						</select>
					</div>
					<div className="form-actions">
						<button type="button" className="btn btn-secondary" onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading || !selectedUserId}
						>
							{loading ? "Adding..." : "Add Member"}
						</button>
					</div>
				</form>
			)}
		</Modal>
	);
}
