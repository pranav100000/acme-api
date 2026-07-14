import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import Modal from "../components/Modal";
import useIsMobile from "../hooks/useIsMobile";

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [filter, setFilter] = useState("all");
	const isMobile = useIsMobile();

	const loadUsers = useCallback(async () => {
		try {
			const data = await api.getUsers();
			setUsers(data);
		} catch {
			setError("Failed to load users");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadUsers();
	}, [loadUsers]);

	const handleDelete = async (user) => {
		if (
			!window.confirm(
				`Deactivate ${user.name}? This will set their status to inactive.`,
			)
		)
			return;
		try {
			await api.deleteUser(user.id);
			setSuccess(`${user.name} has been deactivated`);
			loadUsers();
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(err.message);
			setTimeout(() => setError(""), 3000);
		}
	};

	const filteredUsers =
		filter === "all" ? users : users.filter((user) => user.status === filter);

	if (loading) {
		return (
			<>
				<div className="page-header">
					<h2>Users</h2>
				</div>
				<div className="page-body">
					<div className="loading">
						<div className="spinner"></div>
					</div>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="page-header">
				<div>
					<h2>Users</h2>
					{isMobile && (
						<p className="page-subtitle">
							Manage people, roles, and account status on the go.
						</p>
					)}
				</div>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setShowCreateModal(true)}
				>
					+ Add User
				</button>
			</div>
			<div className="page-body">
				{error && <div className="alert alert-error">{error}</div>}
				{success && <div className="alert alert-success">{success}</div>}

				<div className="filter-pills">
					{["all", "active", "inactive", "pending"].map((status) => (
						<button
							type="button"
							key={status}
							className={`btn btn-sm ${filter === status ? "btn-primary" : "btn-secondary"}`}
							onClick={() => setFilter(status)}
						>
							{status.charAt(0).toUpperCase() + status.slice(1)}
							{status !== "all" &&
								` (${users.filter((user) => user.status === status).length})`}
						</button>
					))}
				</div>

				<div className="card">
					{isMobile ? (
						<div className="card-body mobile-stack-list">
							{filteredUsers.length === 0 ? (
								<div className="empty-state">
									<p>No users found</p>
								</div>
							) : (
								filteredUsers.map((user) => (
									<div key={user.id} className="mobile-user-card">
										<div className="mobile-user-card-top">
											<div className="mobile-user-identity">
												<div className="member-avatar mobile-user-avatar">
													{user.name
														.split(" ")
														.map((namePart) => namePart[0])
														.join("")}
												</div>
												<div>
													<div className="mobile-data-title">{user.name}</div>
													<div className="mobile-data-subtitle">
														{user.email}
													</div>
												</div>
											</div>
											<span className={`badge badge-${user.status}`}>
												{user.status}
											</span>
										</div>
										<div className="mobile-data-meta-grid">
											<div>
												<span>Role</span>
												<strong>{user.role.replace("_", " ")}</strong>
											</div>
											<div>
												<span>Created</span>
												<strong>
													{new Date(user.createdAt).toLocaleDateString()}
												</strong>
											</div>
										</div>
										<div className="mobile-action-row">
											<button
												type="button"
												className="btn btn-secondary btn-sm"
												onClick={() => setEditingUser(user)}
											>
												Edit
											</button>
											{user.status !== "inactive" && (
												<button
													type="button"
													className="btn btn-danger btn-sm"
													onClick={() => handleDelete(user)}
												>
													Deactivate
												</button>
											)}
										</div>
									</div>
								))
							)}
						</div>
					) : (
						<div className="table-container">
							<table>
								<thead>
									<tr>
										<th>User</th>
										<th>Role</th>
										<th>Status</th>
										<th>Created</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{filteredUsers.length === 0 ? (
										<tr>
											<td colSpan="5">
												<div className="empty-state">
													<p>No users found</p>
												</div>
											</td>
										</tr>
									) : (
										filteredUsers.map((user) => (
											<tr key={user.id}>
												<td>
													<div className="table-user-cell">
														<div className="member-avatar table-user-avatar">
															{user.name
																.split(" ")
																.map((namePart) => namePart[0])
																.join("")}
														</div>
														<div>
															<div style={{ fontWeight: 500 }}>{user.name}</div>
															<div
																style={{ fontSize: "12px", color: "#6b7280" }}
															>
																{user.email}
															</div>
														</div>
													</div>
												</td>
												<td>
													<span className={`badge badge-${user.role}`}>
														{user.role.replace("_", " ")}
													</span>
												</td>
												<td>
													<span className={`badge badge-${user.status}`}>
														{user.status}
													</span>
												</td>
												<td style={{ fontSize: "13px", color: "#6b7280" }}>
													{new Date(user.createdAt).toLocaleDateString()}
												</td>
												<td>
													<div style={{ display: "flex", gap: "4px" }}>
														<button
															type="button"
															className="btn btn-secondary btn-sm"
															onClick={() => setEditingUser(user)}
														>
															Edit
														</button>
														{user.status !== "inactive" && (
															<button
																type="button"
																className="btn btn-danger btn-sm"
																onClick={() => handleDelete(user)}
															>
																Deactivate
															</button>
														)}
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			</div>

			{showCreateModal && (
				<CreateUserModal
					onClose={() => setShowCreateModal(false)}
					onCreated={() => {
						setShowCreateModal(false);
						loadUsers();
						setSuccess("User created successfully");
						setTimeout(() => setSuccess(""), 3000);
					}}
				/>
			)}

			{editingUser && (
				<EditUserModal
					user={editingUser}
					onClose={() => setEditingUser(null)}
					onUpdated={() => {
						setEditingUser(null);
						loadUsers();
						setSuccess("User updated successfully");
						setTimeout(() => setSuccess(""), 3000);
					}}
				/>
			)}
		</>
	);
}

function CreateUserModal({ onClose, onCreated }) {
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

function EditUserModal({ user, onClose, onUpdated }) {
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
