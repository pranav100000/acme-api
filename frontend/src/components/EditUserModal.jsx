import { useState } from "react";
import * as api from "../api";
import Modal from "./Modal";

export default function EditUserModal({ user, onClose, onUpdated }) {
	const [form, setForm] = useState({
		name: user.name,
		email: user.email,
		role: user.role,
		status: user.status,
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await api.updateUser(user.id, form);
			onUpdated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title={`Edit ${user.name}`} onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="edit-user-name">Name</label>
					<input
						id="edit-user-name"
						className="form-control"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="edit-user-email">Email</label>
					<input
						id="edit-user-email"
						className="form-control"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
					/>
				</div>
				<div className="form-group">
					<label htmlFor="edit-user-role">Role</label>
					<select
						id="edit-user-role"
						className="form-control"
						value={form.role}
						onChange={(e) => setForm({ ...form, role: e.target.value })}
					>
						<option value="developer">Developer</option>
						<option value="designer">Designer</option>
						<option value="admin">Admin</option>
						<option value="product_manager">Product Manager</option>
					</select>
				</div>
				<div className="form-group">
					<label htmlFor="edit-user-status">Status</label>
					<select
						id="edit-user-status"
						className="form-control"
						value={form.status}
						onChange={(e) => setForm({ ...form, status: e.target.value })}
					>
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
						<option value="pending">Pending</option>
					</select>
				</div>
				<div className="form-actions">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
