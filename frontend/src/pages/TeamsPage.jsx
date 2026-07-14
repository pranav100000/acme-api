import { Plus, UserPlus, X } from "lucide-react";
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

const roleVariant = {
	admin: "info",
	developer: "secondary",
	designer: "pink",
	product_manager: "orange",
};

export default function TeamsPage() {
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const [teamMembers, setTeamMembers] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [addMemberTeam, setAddMemberTeam] = useState(null);

	const loadData = useCallback(async () => {
		try {
			const [teamsData, usersData] = await Promise.all([
				api.getTeams(),
				api.getUsers(),
			]);
			setTeams(teamsData);
			setUsers(usersData);

			const membersMap = {};
			await Promise.all(
				teamsData.map(async (team) => {
					try {
						const members = await api.getTeamMembers(team.id);
						membersMap[team.id] = members;
					} catch {
						membersMap[team.id] = [];
					}
				}),
			);
			setTeamMembers(membersMap);
		} catch {
			setError("Failed to load teams");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const handleRemoveMember = async (teamId, userId, userName) => {
		if (!window.confirm(`Remove ${userName} from this team?`)) return;
		try {
			await api.removeTeamMember(teamId, userId);
			setSuccess(`${userName} removed from team`);
			loadData();
			setTimeout(() => setSuccess(""), 3000);
		} catch (err) {
			setError(err.message);
			setTimeout(() => setError(""), 3000);
		}
	};

	return (
		<div className="space-y-6">
			<section className="flex flex-col gap-4 rounded-[1.75rem] border border-zinc-800 bg-zinc-950/80 px-6 py-6 shadow-sm shadow-black/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
				<div>
					<p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
						Collaboration
					</p>
					<h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
						Teams
					</h2>
					<p className="mt-2 text-sm text-zinc-400">
						Organize members into focused groups and manage access in a more
						polished team workspace.
					</p>
				</div>
				<Button onClick={() => setShowCreateModal(true)}>
					<Plus className="size-4" />
					Create team
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

			{loading ? (
				<Card className="border-zinc-800 bg-zinc-950/90 backdrop-blur">
					<CardContent className="py-12 text-center text-sm text-zinc-400">
						Loading teams...
					</CardContent>
				</Card>
			) : teams.length === 0 ? (
				<Card className="border-dashed border-zinc-700 bg-zinc-950/90">
					<CardContent className="py-16 text-center">
						<div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-zinc-400">
							<Plus className="size-6" />
						</div>
						<p className="mt-4 text-lg font-medium text-zinc-100">
							No teams yet
						</p>
						<p className="mt-2 text-sm text-zinc-400">
							Create your first team to start grouping members.
						</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-6 xl:grid-cols-2">
					{teams.map((team) => {
						const members = teamMembers[team.id] || [];
						return (
							<Card
								key={team.id}
								className="border-zinc-800 bg-zinc-950/90 backdrop-blur"
							>
								<CardHeader className="flex-row items-start justify-between space-y-0">
									<div>
										<CardTitle className="text-xl">{team.name}</CardTitle>
										<CardDescription>
											Created {new Date(team.createdAt).toLocaleDateString()} ·
											Updated {new Date(team.updatedAt).toLocaleDateString()}
										</CardDescription>
									</div>
									<Badge variant="secondary">
										{members.length} member{members.length === 1 ? "" : "s"}
									</Badge>
								</CardHeader>
								<CardContent>
									{members.length === 0 ? (
										<div className="rounded-2xl border border-dashed border-zinc-800 bg-black/60 px-4 py-8 text-center text-sm text-zinc-400">
											No members yet
										</div>
									) : (
										<div className="space-y-3">
											{members.map((member) =>
												member ? (
													<div
														key={member.id}
														className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-black/60 px-4 py-3"
													>
														<div className="flex items-center gap-3">
															<Avatar>
																{member.name
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</Avatar>
															<div>
																<p className="font-medium text-zinc-100">
																	{member.name}
																</p>
																<div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
																	<span>{member.email}</span>
																	<Badge
																		variant={
																			roleVariant[member.role] || "secondary"
																		}
																	>
																		{member.role.replace("_", " ")}
																	</Badge>
																</div>
															</div>
														</div>
														<Button
															variant="ghost"
															size="icon"
															title="Remove member"
															onClick={() =>
																handleRemoveMember(
																	team.id,
																	member.id,
																	member.name,
																)
															}
														>
															<X className="size-4" />
														</Button>
													</div>
												) : null,
											)}
										</div>
									)}

									<Button
										variant="secondary"
										className="mt-5 w-full justify-center"
										onClick={() => setAddMemberTeam(team)}
									>
										<UserPlus className="size-4" />
										Add member
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			{showCreateModal ? (
				<CreateTeamModal
					onClose={() => setShowCreateModal(false)}
					onCreated={() => {
						setShowCreateModal(false);
						loadData();
						setSuccess("Team created successfully");
						setTimeout(() => setSuccess(""), 3000);
					}}
				/>
			) : null}

			{addMemberTeam ? (
				<AddMemberModal
					team={addMemberTeam}
					users={users}
					currentMembers={teamMembers[addMemberTeam.id] || []}
					onClose={() => setAddMemberTeam(null)}
					onAdded={() => {
						setAddMemberTeam(null);
						loadData();
						setSuccess("Member added successfully");
						setTimeout(() => setSuccess(""), 3000);
					}}
				/>
			) : null}
		</div>
	);
}

function CreateTeamModal({ onClose, onCreated }) {
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
		<Modal
			title="Create team"
			description="Set up a new team and start assigning members."
			onClose={onClose}
		>
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			<form onSubmit={handleSubmit} className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor="team-name">Team name</Label>
					<Input
						id="team-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						required
						placeholder="e.g. Marketing"
					/>
				</div>
				<div className="flex justify-end gap-3">
					<Button type="button" variant="secondary" onClick={onClose}>
						Cancel
					</Button>
					<Button type="submit" disabled={loading}>
						{loading ? "Creating..." : "Create team"}
					</Button>
				</div>
			</form>
		</Modal>
	);
}

function AddMemberModal({ team, users, currentMembers, onClose, onAdded }) {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const currentMemberIds = currentMembers
		.filter(Boolean)
		.map((member) => member.id);
	const availableUsers = users.filter(
		(user) => !currentMemberIds.includes(user.id) && user.status === "active",
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
		<Modal
			title={`Add member to ${team.name}`}
			description="Choose an active user who is not already assigned to this team."
			onClose={onClose}
		>
			{error ? (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			) : null}
			{availableUsers.length === 0 ? (
				<div className="space-y-4 rounded-2xl border border-dashed border-zinc-800 bg-black/60 p-5 text-center text-sm text-zinc-400">
					<p>All active users are already members of this team.</p>
					<div className="flex justify-center">
						<Button type="button" variant="secondary" onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="space-y-5">
					<div className="space-y-2">
						<Label htmlFor="team-member-user">Select user</Label>
						<select
							id="team-member-user"
							className="flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 shadow-sm outline-none focus:border-zinc-600 focus:ring-2 focus:ring-zinc-100/10"
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
					<div className="flex justify-end gap-3">
						<Button type="button" variant="secondary" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={loading || !selectedUserId}>
							{loading ? "Adding..." : "Add member"}
						</Button>
					</div>
				</form>
			)}
		</Modal>
	);
}
