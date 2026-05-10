import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import CreateUserModal from "../components/CreateUserModal";
import EditUserModal from "../components/EditUserModal";
import { useFlash } from "../hooks/useFlash";

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [filter, setFilter] = useState("all");
	const [flashError, showFlashError] = useFlash();
	const [success, showSuccess] = useFlash();

	const loadUsers = useCallback(async () => {
		try {
			const data = await api.getUsers();
			setUsers(data);
		} catch {
			setLoadError("Failed to load users");
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
			showSuccess(`${user.name} has been deactivated`);
			loadUsers();
		} catch (err) {
			showFlashError(err.message);
		}
	};

	const filteredUsers =
		filter === "all" ? users : users.filter((u) => u.status === filter);

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
				<h2>Users</h2>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setShowCreateModal(true)}
				>
					+ Add User
				</button>
			</div>
			<div className="page-body">
				{loadError && <div className="alert alert-error">{loadError}</div>}
				{flashError && <div className="alert alert-error">{flashError}</div>}
				{success && <div className="alert alert-success">{success}</div>}

				<div style={{ marginBottom: "16px", display: "flex", gap: "8px" }}>
					{["all", "active", "inactive", "pending"].map((f) => (
						<button
							type="button"
							key={f}
							className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-secondary"}`}
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
							{f !== "all" &&
								` (${users.filter((u) => u.status === f).length})`}
						</button>
					))}
				</div>

				<div className="card">
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
												<div
													style={{
														display: "flex",
														alignItems: "center",
														gap: "12px",
													}}
												>
													<div
														style={{
															width: "36px",
															height: "36px",
															borderRadius: "50%",
															background: "#4f46e5",
															color: "white",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															fontSize: "13px",
															fontWeight: "600",
															flexShrink: 0,
														}}
													>
														{user.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</div>
													<div>
														<div style={{ fontWeight: 500 }}>{user.name}</div>
														<div style={{ fontSize: "12px", color: "#6b7280" }}>
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
				</div>
			</div>

			{showCreateModal && (
				<CreateUserModal
					onClose={() => setShowCreateModal(false)}
					onCreated={() => {
						setShowCreateModal(false);
						loadUsers();
						showSuccess("User created successfully");
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
						showSuccess("User updated successfully");
					}}
				/>
			)}
		</>
	);
}
