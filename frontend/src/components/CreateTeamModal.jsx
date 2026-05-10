import { useState } from "react";
import * as api from "../api";
import Modal from "./Modal";

export default function CreateTeamModal({ onClose, onCreated }) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await api.createTeam({ name });
			onCreated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title="Create Team" onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="team-name">Team Name</label>
					<input
						id="team-name"
						className="form-control"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder="e.g. Marketing"
					/>
				</div>
				<div className="form-actions">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Creating..." : "Create Team"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
