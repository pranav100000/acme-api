import { useCallback, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Alert } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

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

	if (loading) {
		return (
			<>
				<div className="px-8 py-8">
					<h2 className="text-2xl font-bold text-gray-900">Users</h2>
				</div>
				<div className="p-8">
					<div className="flex items-center justify-center py-12">
						<div className="spinner" />
					</div>
				</div>
			</>
		);
	}

	return (
		<div className="animate-fade-in">
			<div className="px-8 pt-8 pb-2">
				<div className="flex items-center justify-between mb-6">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Users</h2>
						<p className="text-sm text-gray-500 mt-1">{users.length} total users in your organization</p>
					</div>
					<Button onClick={() => setShowCreateModal(true)} className="gap-2">
						<UserPlus className="h-4 w-4" />
						Add User
					</Button>
				</div>
			</div>
			<div className="px-8 pb-8">
				{error && (
					<Alert variant="destructive" className="mb-4">
						{error}
					</Alert>
				)}
				{success && (
					<Alert variant="success" className="mb-4">
						{success}
					</Alert>
				)}

				<div className="flex gap-2 mb-5">
					{["all", "active", "inactive", "pending"].map((f) => (
						<Button
							key={f}
							variant={filter === f ? "default" : "outline"}
							size="sm"
							onClick={() => setFilter(f)}
						>
							{f.charAt(0).toUpperCase() + f.slice(1)}
							{f !== "all" &&
								` (${users.filter((u) => u.status === f).length})`}
						</Button>
					))}
				</div>

				<Card>
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
									<TableCell colSpan={5}>
										<div className="text-center py-12 text-gray-400">
											<p className="text-sm">No users found</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar>
													<AvatarFallback>
														{user.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium text-gray-900">{user.name}</div>
													<div className="text-xs text-gray-400">
														{user.email}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge variant={user.role}>
												{user.role.replace("_", " ")}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={user.status}>{user.status}</Badge>
										</TableCell>
										<TableCell className="text-sm text-gray-400">
											{new Date(user.createdAt).toLocaleDateString()}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex gap-1.5 justify-end">
												<Button
													variant="outline"
													size="sm"
													onClick={() => setEditingUser(user)}
												>
													Edit
												</Button>
												{user.status !== "inactive" && (
													<Button
														variant="destructive"
														size="sm"
														onClick={() => handleDelete(user)}
													>
														Deactivate
													</Button>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Card>
			</div>

			<CreateUserDialog
				open={showCreateModal}
				onOpenChange={setShowCreateModal}
				onCreated={() => {
					setShowCreateModal(false);
					loadUsers();
					setSuccess("User created successfully");
					setTimeout(() => setSuccess(""), 3000);
				}}
			/>

			<EditUserDialog
				user={editingUser}
				open={!!editingUser}
				onOpenChange={(open) => {
					if (!open) setEditingUser(null);
				}}
				onUpdated={() => {
					setEditingUser(null);
					loadUsers();
					setSuccess("User updated successfully");
					setTimeout(() => setSuccess(""), 3000);
				}}
			/>
		</div>
	);
}

function CreateUserDialog({ open, onOpenChange, onCreated }) {
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
			setForm({ name: "", email: "", role: "developer" });
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create User</DialogTitle>
				</DialogHeader>
				{error && (
					<Alert variant="destructive">{error}</Alert>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="create-user-name">Name</Label>
						<Input
							id="create-user-name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
							placeholder="John Doe"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="create-user-email">Email</Label>
						<Input
							id="create-user-email"
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							required
							placeholder="john@acme.com"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="create-user-role">Role</Label>
						<Select
							id="create-user-role"
							value={form.role}
							onChange={(e) => setForm({ ...form, role: e.target.value })}
						>
							<option value="developer">Developer</option>
							<option value="designer">Designer</option>
							<option value="admin">Admin</option>
							<option value="product_manager">Product Manager</option>
						</Select>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function EditUserDialog({ user, open, onOpenChange, onUpdated }) {
	const [form, setForm] = useState({
		name: "",
		email: "",
		role: "developer",
		status: "active",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) {
			setForm({
				name: user.name,
				email: user.email,
				role: user.role,
				status: user.status,
			});
		}
	}, [user]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!user) return;
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
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit {user?.name}</DialogTitle>
				</DialogHeader>
				{error && (
					<Alert variant="destructive">{error}</Alert>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="edit-user-name">Name</Label>
						<Input
							id="edit-user-name"
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-user-email">Email</Label>
						<Input
							id="edit-user-email"
							type="email"
							value={form.email}
							onChange={(e) => setForm({ ...form, email: e.target.value })}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-user-role">Role</Label>
						<Select
							id="edit-user-role"
							value={form.role}
							onChange={(e) => setForm({ ...form, role: e.target.value })}
						>
							<option value="developer">Developer</option>
							<option value="designer">Designer</option>
							<option value="admin">Admin</option>
							<option value="product_manager">Product Manager</option>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="edit-user-status">Status</Label>
						<Select
							id="edit-user-status"
							value={form.status}
							onChange={(e) => setForm({ ...form, status: e.target.value })}
						>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
							<option value="pending">Pending</option>
						</Select>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading ? "Saving..." : "Save Changes"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
