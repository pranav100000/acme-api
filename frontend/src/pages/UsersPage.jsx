import { Pencil, Plus, UserMinus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import AppDialog from "../components/AppDialog";
import { EmptyState } from "../components/EmptyState";
import { LoadingState } from "../components/LoadingState";
import { PageShell } from "../components/PageShell";
import { Alert } from "../components/ui/alert";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input, inputClassName } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatRole, getInitials } from "../lib/utils";

const filters = ["all", "active", "inactive", "pending"];
const roles = [
	{ value: "developer", label: "Developer" },
	{ value: "designer", label: "Designer" },
	{ value: "admin", label: "Admin" },
	{ value: "product_manager", label: "Product Manager" },
];
const statuses = ["active", "inactive", "pending"];

export default function UsersPage() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [editingUser, setEditingUser] = useState(null);
	const [filter, setFilter] = useState("all");

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
		if (!window.confirm(`Deactivate ${user.name}? This will set their status to inactive.`)) {
			return;
		}
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

	const filteredUsers = filter === "all" ? users : users.filter((user) => user.status === filter);

	if (loading) {
		return <LoadingState label="Loading users" />;
	}

	return (
		<>
			<PageShell
				title="Users"
				description="Manage everyone who can access the Acme admin workspace."
				action={
					<Button type="button" onClick={() => setShowCreateModal(true)}>
						<Plus className="size-4" />
						Add User
					</Button>
				}
			>
				{error ? <Alert variant="destructive">{error}</Alert> : null}
				{success ? <Alert variant="success">{success}</Alert> : null}

				<div className="flex flex-wrap gap-2">
					{filters.map((value) => (
						<Button
							key={value}
							type="button"
							variant={filter === value ? "default" : "secondary"}
							size="sm"
							onClick={() => setFilter(value)}
						>
							{value.charAt(0).toUpperCase() + value.slice(1)}
							{value !== "all" ? ` (${users.filter((user) => user.status === value).length})` : ""}
						</Button>
					))}
				</div>

				<Card>
					<CardContent className="p-0">
						{filteredUsers.length === 0 ? (
							<div className="p-6">
								<EmptyState icon="👥" title="No users found" description="Try another filter or invite a new teammate." />
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>User</TableHead>
											<TableHead>Role</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Created</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredUsers.map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar>{getInitials(user.name)}</Avatar>
														<div>
															<div className="font-medium text-slate-900">{user.name}</div>
															<div className="text-xs text-slate-500">{user.email}</div>
														</div>
													</div>
												</TableCell>
												<TableCell><Badge variant={roleBadgeVariant(user.role)}>{formatRole(user.role)}</Badge></TableCell>
												<TableCell><Badge variant={statusBadgeVariant(user.status)}>{user.status}</Badge></TableCell>
												<TableCell className="text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
												<TableCell>
													<div className="flex flex-wrap gap-2">
														<Button type="button" variant="secondary" size="sm" onClick={() => setEditingUser(user)}>
															<Pencil className="size-4" />
															Edit
														</Button>
														{user.status !== "inactive" ? (
															<Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(user)}>
																<UserMinus className="size-4" />
																Deactivate
															</Button>
														) : null}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</PageShell>

			{showCreateModal ? (
				<CreateUserModal
					onClose={() => setShowCreateModal(false)}
					onCreated={() => {
						setShowCreateModal(false);
						loadUsers();
						setSuccess("User created successfully");
						setTimeout(() => setSuccess(""), 3000);
					}}
				/>
			) : null}

			{editingUser ? (
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
			) : null}
		</>
	);
}

function CreateUserModal({ onClose, onCreated }) {
	const [form, setForm] = useState({ name: "", email: "", role: "developer" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		<AppDialog open onOpenChange={(open) => (open ? null : onClose())} title="Create user" description="Add a new teammate and assign their default role.">
			{error ? <Alert variant="destructive">{error}</Alert> : null}
			<UserForm
				form={form}
				setForm={setForm}
				onClose={onClose}
				onSubmit={handleSubmit}
				submitLabel={loading ? "Creating..." : "Create User"}
				loading={loading}
			/>
		</AppDialog>
	);
}

function EditUserModal({ user, onClose, onUpdated }) {
	const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role, status: user.status });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		<AppDialog open onOpenChange={(open) => (open ? null : onClose())} title={`Edit ${user.name}`} description="Update user details, role, and lifecycle status.">
			{error ? <Alert variant="destructive">{error}</Alert> : null}
			<UserForm
				form={form}
				setForm={setForm}
				onClose={onClose}
				onSubmit={handleSubmit}
				submitLabel={loading ? "Saving..." : "Save Changes"}
				loading={loading}
				includeStatus
			/>
		</AppDialog>
	);
}

function UserForm({ form, setForm, onClose, onSubmit, submitLabel, loading, includeStatus = false }) {
	return (
		<form className="space-y-4" onSubmit={onSubmit}>
			<FormField label="Name" htmlFor="user-name">
				<Input id="user-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required placeholder="John Doe" />
			</FormField>
			<FormField label="Email" htmlFor="user-email">
				<Input id="user-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required placeholder="john@acme.com" />
			</FormField>
			<FormField label="Role" htmlFor="user-role">
				<select id="user-role" className={inputClassName} value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
					{roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}
				</select>
			</FormField>
			{includeStatus ? (
				<FormField label="Status" htmlFor="user-status">
					<select id="user-status" className={inputClassName} value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
						{statuses.map((status) => <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>)}
					</select>
				</FormField>
			) : null}
			<div className="flex justify-end gap-3 pt-2">
				<Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
				<Button type="submit" disabled={loading}>{submitLabel}</Button>
			</div>
		</form>
	);
}

function FormField({ label, htmlFor, children }) {
	return (
		<div className="space-y-2">
			<label className="text-sm font-medium text-slate-700" htmlFor={htmlFor}>{label}</label>
			{children}
		</div>
	);
}

function statusBadgeVariant(status) {
	if (status === "active") return "success";
	if (status === "pending") return "warning";
	return "destructive";
}

function roleBadgeVariant(role) {
	if (role === "admin") return "purple";
	if (role === "developer") return "info";
	if (role === "designer") return "pink";
	if (role === "product_manager") return "orange";
	return "outline";
}
