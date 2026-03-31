import { Pencil, Plus, UserMinus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import Modal from "../components/Modal";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Avatar } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

const roleVariant = {
	admin: "info",
	developer: "secondary",
	designer: "pink",
	product_manager: "orange",
};

const statusVariant = {
	active: "success",
	inactive: "danger",
	pending: "warning",
};

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
		filter === "all" ? users : users.filter((u) => u.status === filter);

	return (
		<div className="space-y-6">
			<section className="flex flex-col gap-4 rounded-[1.75rem] border border-white/70 bg-white/80 px-6 py-6 shadow-sm backdrop-blur lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.3em] text-indigo-500">
						Workspace
					</p>
					<h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
						Users
					</h2>
					<p className="mt-2 text-sm text-slate-500">
						Review every teammate, filter by status, and update roles without
						leaving the table.
					</p>
				</div>
				<Button onClick={() => setShowCreateModal(true)}>
					<Plus className="size-4" />
					Add user
				</Button>
			</section>

			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			{success ? (
				<Alert variant="success">
					<AlertDescription>{success}</AlertDescription>
				</Alert>
			) : null}

			<Card className="border-white/70 bg-white/90 backdrop-blur">
				<CardHeader className="gap-4 border-b-0 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<CardTitle>User directory</CardTitle>
						<CardDescription>
							{filteredUsers.length} visible of {users.length} total users
						</CardDescription>
					</div>
					<Tabs value={filter} onValueChange={setFilter}>
						<TabsList className="grid w-full grid-cols-4 lg:w-auto">
							{[
								["all", `All (${users.length})`],
								[
									"active",
									`Active (${users.filter((u) => u.status === "active").length})`,
								],
								[
									"inactive",
									`Inactive (${users.filter((u) => u.status === "inactive").length})`,
								],
								[
									"pending",
									`Pending (${users.filter((u) => u.status === "pending").length})`,
								],
							].map(([value, label]) => (
								<TabsTrigger key={value} value={value}>
									{label}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</CardHeader>
				<CardContent className="pt-0">
					{loading ? (
						<div className="py-12 text-center text-sm text-slate-500">
							Loading users...
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>User</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredUsers.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="py-12 text-center text-sm text-slate-500"
										>
											No users found for this filter.
										</TableCell>
									</TableRow>
								) : (
									filteredUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar>
														{user.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</Avatar>
													<div>
														<div className="font-medium text-slate-900">
															{user.name}
														</div>
														<div className="text-xs text-slate-500">
															{user.email}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant={roleVariant[user.role] || "secondary"}>
													{user.role.replace("_", " ")}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={statusVariant[user.status] || "secondary"}
												>
													{user.status}
												</Badge>
											</TableCell>
											<TableCell>
												{new Date(user.createdAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<div className="flex justify-end gap-2">
													<Button
														variant="secondary"
														size="sm"
														onClick={() => setEditingUser(user)}
													>
														<Pencil className="size-3.5" /> Edit
													</Button>
													{user.status !== "inactive" ? (
														<Button
															variant="destructive"
															size="sm"
															onClick={() => handleDelete(user)}
														>
															<UserMinus className="size-3.5" /> Deactivate
														</Button>
													) : null}
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>

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
		</div>
	);
}

function UserFormFields({ form, setForm, includeStatus = false }) {
	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor={`${includeStatus ? "edit" : "create"}-user-name`}>
					Name
				</Label>
				<Input
					id={`${includeStatus ? "edit" : "create"}-user-name`}
					value={form.name}
					onChange={(e) => setForm({ ...form, name: e.target.value })}
					required
					placeholder="John Doe"
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor={`${includeStatus ? "edit" : "create"}-user-email`}>
					Email
				</Label>
				<Input
					id={`${includeStatus ? "edit" : "create"}-user-email`}
					type="email"
					value={form.email}
					onChange={(e) => setForm({ ...form, email: e.target.value })}
					required
					placeholder="john@acme.com"
				/>
			</div>
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-2">
					<Label htmlFor={`${includeStatus ? "edit" : "create"}-user-role`}>
						Role
					</Label>
					<select
						id={`${includeStatus ? "edit" : "create"}-user-role`}
						className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
						value={form.role}
						onChange={(e) => setForm({ ...form, role: e.target.value })}
					>
						<option value="developer">Developer</option>
						<option value="designer">Designer</option>
						<option value="admin">Admin</option>
						<option value="product_manager">Product Manager</option>
					</select>
				</div>
				{includeStatus ? (
					<div className="space-y-2">
						<Label htmlFor="edit-user-status">Status</Label>
						<select
							id="edit-user-status"
							className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
							value={form.status}
							onChange={(e) => setForm({ ...form, status: e.target.value })}
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="pending">Pending</option>
						</select>
					</div>
				) : null}
			</div>
		</div>
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
		<Modal
			title="Create user"
			description="Invite a new teammate and assign their default role."
			onClose={onClose}
		>
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			<form onSubmit={handleSubmit} className="space-y-5" onReset={onClose}>
				<UserFormFields form={form} setForm={setForm} />
				<div className="flex justify-end gap-3">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Creating..." : "Create user"}
					</Button>
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
		<Modal
			title={`Edit ${user.name}`}
			description="Update profile details, role, and current account status."
			onClose={onClose}
		>
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			<form onSubmit={handleSubmit} className="space-y-5">
				<UserFormFields form={form} setForm={setForm} includeStatus />
				<div className="flex justify-end gap-3">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Saving..." : "Save changes"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}
