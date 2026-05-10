import { useState } from "react";
import * as api from "../api";
import Modal from "./Modal";

export default function CreateUserModal({ onClose, onCreated }) {
	const [form, setForm] = useState({ name: "", email: "", role: "developer" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await api.createUser(form);
			onCreated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title="Create User" onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="create-user-name">Name</label>
					<input
						id="create-user-name"
						className="form-control"
						value={form.name}
						onChange={(e) => setForm({ ...form, name: e.target.value })}
						required
						placeholder="John Doe"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="create-user-email">Email</label>
					<input
						id="create-user-email"
						className="form-control"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						required
						placeholder="john@acme.com"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="create-user-role">Role</label>
					<select
						id="create-user-role"
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
				<div className="form-actions">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Creating..." : "Create User"}
					</button>
				</div>
			</form>
		</Modal>
	);
}
