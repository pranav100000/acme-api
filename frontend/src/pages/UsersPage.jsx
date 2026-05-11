import { useMemo, useState } from "react";
import * as api from "../api";
import AlertStack from "../components/AlertStack";
import LoadingState from "../components/LoadingState";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import UserAvatar from "../components/UserAvatar";
import { useAsyncData } from "../hooks/useAsyncData";
import { useFlashMessage } from "../hooks/useFlashMessage";
import { formatDate, formatRole } from "../utils/formatters";

const ROLE_OPTIONS = [
	{ value: "developer", label: "Developer" },
	{ value: "designer", label: "Designer" },
	{ value: "admin", label: "Admin" },
	{ value: "product_manager", label: "Product Manager" },
];

const STATUS_OPTIONS = [
	{ value: "active", label: "Active" },
	{ value: "inactive", label: "Inactive" },
	{ value: "pending", label: "Pending" },
];

export default function UsersPage() {
	const {
		data: users,
		loading,
		reload,
	} = useAsyncData(api.getUsers, [], "Failed to load users");
	const error = useFlashMessage();
	const success = useFlashMessage();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [filter, setFilter] = useState("all");

	const filteredUsers = useMemo(
		() =>
			filter === "all" ? users : users.filter((user) => user.status === filter),
		[filter, users],
	);

	const handleDelete = async (user) => {
		if (
			!window.confirm(
				`Deactivate ${user.name}? This will set their status to inactive.`,
			)
		) {
			return;
		}

		try {
			await api.deleteUser(user.id);
			success.showMessage(`${user.name} has been deactivated`);
			await reload();
		} catch (err) {
			error.showMessage(err.message);
		}
	};

	if (loading) {
		return <LoadingState title="Users" />;
	}

	return (
		<>
			<PageHeader
				title="Users"
				actions={
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setShowCreateModal(true)}
					>
						+ Add User
					</button>
				}
			/>
			<div className="page-body">
				<AlertStack error={error.message} success={success.message} />

				<div className="filter-row">
					{["all", "active", "inactive", "pending"].map((value) => (
						<button
							type="button"
							key={value}
							className={`btn btn-sm ${filter === value ? "btn-primary" : "btn-secondary"}`}
							onClick={() => setFilter(value)}
						>
							{value.charAt(0).toUpperCase() + value.slice(1)}
							{value !== "all" &&
								` (${users.filter((user) => user.status === value).length})`}
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
												<div className="entity-summary">
													<UserAvatar name={user.name} />
													<div>
														<div className="table-primary">{user.name}</div>
														<div className="table-secondary">{user.email}</div>
													</div>
												</div>
											</td>
											<td>
												<span className={`badge badge-${user.role}`}>
													{formatRole(user.role)}
												</span>
											</td>
											<td>
												<span className={`badge badge-${user.status}`}>
													{user.status}
												</span>
											</td>
											<td className="table-secondary">
												{formatDate(user.createdAt)}
											</td>
											<td>
												<div className="action-row">
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
				<UserModal
					title="Create User"
					initialForm={{ name: "", email: "", role: "developer" }}
					submitLabel="Create User"
					onClose={() => setShowCreateModal(false)}
					onSubmit={api.createUser}
					onSuccess={async () => {
						setShowCreateModal(false);
						await reload();
						success.showMessage("User created successfully");
					}}
				/>
			)}

			{editingUser && (
				<UserModal
					title={`Edit ${editingUser.name}`}
					initialForm={{
						name: editingUser.name,
						email: editingUser.email,
						role: editingUser.role,
						status: editingUser.status,
					}}
					submitLabel="Save Changes"
					showStatus
					onClose={() => setEditingUser(null)}
					onSubmit={(form) => api.updateUser(editingUser.id, form)}
					onSuccess={async () => {
						setEditingUser(null);
						await reload();
						success.showMessage("User updated successfully");
					}}
				/>
			)}
		</>
	);
}

function UserModal({
	title,
	initialForm,
	submitLabel,
	showStatus = false,
	onClose,
	onSubmit,
	onSuccess,
}) {
	const [form, setForm] = useState(initialForm);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleChange = (field) => (event) => {
		setForm((current) => ({ ...current, [field]: event.target.value }));
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			await onSubmit(form);
			await onSuccess();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title={title} onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<FormField label="Name" id="user-name">
					<input
						id="user-name"
						className="form-control"
						value={form.name}
						onChange={handleChange("name")}
						required
					/>
				</FormField>
				<FormField label="Email" id="user-email">
					<input
						id="user-email"
						className="form-control"
						type="email"
						value={form.email}
						onChange={handleChange("email")}
						required
					/>
				</FormField>
				<FormField label="Role" id="user-role">
					<select
						id="user-role"
						className="form-control"
						value={form.role}
						onChange={handleChange("role")}
					>
						{ROLE_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</FormField>
				{showStatus && (
					<FormField label="Status" id="user-status">
						<select
							id="user-status"
							className="form-control"
							value={form.status}
							onChange={handleChange("status")}
						>
							{STATUS_OPTIONS.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</FormField>
				)}
				<div className="form-actions">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Saving..." : submitLabel}
					</button>
				</div>
			</form>
		</Modal>
	);
}

function FormField({ id, label, children }) {
	return (
		<div className="form-group">
			<label htmlFor={id}>{label}</label>
			{children}
		</div>
	);
}
