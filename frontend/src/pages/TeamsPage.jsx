import { Plus, UserPlus, X } from "lucide-react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input, inputClassName } from "../components/ui/input";
import { formatRole, getInitials } from "../lib/utils";

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
			const [teamsData, usersData] = await Promise.all([api.getTeams(), api.getUsers()]);
			setTeams(teamsData);
			setUsers(usersData);
			const membersMap = {};
			await Promise.all(
				teamsData.map(async (team) => {
					try {
						membersMap[team.id] = await api.getTeamMembers(team.id);
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

	if (loading) {
		return <LoadingState label="Loading teams" />;
	}

	return (
		<>
			<PageShell
				title="Teams"
				description="Track squads, ownership, and membership across the company."
				action={
					<Button type="button" onClick={() => setShowCreateModal(true)}>
						<Plus className="size-4" />
						Create Team
					</Button>
				}
			>
				{error ? <Alert variant="destructive">{error}</Alert> : null}
				{success ? <Alert variant="success">{success}</Alert> : null}

				{teams.length === 0 ? (
					<EmptyState icon="🏷️" title="No teams yet" description="Create your first team to begin organizing members." action={<Button onClick={() => setShowCreateModal(true)}>Create Team</Button>} />
				) : (
					<div className="grid gap-6 xl:grid-cols-2">
						{teams.map((team) => {
							const members = teamMembers[team.id] || [];
							return (
								<Card key={team.id} className="overflow-hidden">
									<CardHeader>
										<div>
											<CardTitle>{team.name}</CardTitle>
											<CardDescription>
												Created {new Date(team.createdAt).toLocaleDateString()} • Updated {new Date(team.updatedAt).toLocaleDateString()}
											</CardDescription>
										</div>
										<Badge variant="outline">{members.length} member{members.length !== 1 ? "s" : ""}</Badge>
									</CardHeader>
									<CardContent className="space-y-4">
										{members.length === 0 ? (
											<div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">No members yet</div>
										) : (
											<div className="space-y-3">
												{members.filter(Boolean).map((member) => (
													<div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3">
														<div className="flex items-center gap-3">
															<Avatar>{getInitials(member.name)}</Avatar>
															<div>
																<div className="font-medium text-slate-900">{member.name}</div>
																<div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
																	<span>{member.email}</span>
																	<Badge variant={roleBadgeVariant(member.role)}>{formatRole(member.role)}</Badge>
																</div>
															</div>
														</div>
														<Button type="button" variant="ghost" size="icon" title="Remove member" onClick={() => handleRemoveMember(team.id, member.id, member.name)}>
															<X className="size-4" />
															<span className="sr-only">Remove {member.name}</span>
														</Button>
													</div>
												))}
											</div>
										)}

										<Button type="button" variant="secondary" className="w-full" onClick={() => setAddMemberTeam(team)}>
											<UserPlus className="size-4" />
											Add Member
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</PageShell>

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
		</>
	);
}

function CreateTeamModal({ onClose, onCreated }) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		<AppDialog open onOpenChange={(open) => (open ? null : onClose())} title="Create team" description="Add a new team so you can manage membership and ownership.">
			{error ? <Alert variant="destructive">{error}</Alert> : null}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="space-y-2">
					<label className="text-sm font-medium text-slate-700" htmlFor="team-name">Team Name</label>
					<Input id="team-name" value={name} onChange={(event) => setName(event.target.value)} required placeholder="e.g. Marketing" />
				</div>
				<div className="flex justify-end gap-3 pt-2">
					<Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
					<Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Team"}</Button>
				</div>
			</form>
		</AppDialog>
	);
}

function AddMemberModal({ team, users, currentMembers, onClose, onAdded }) {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const currentMemberIds = currentMembers.filter(Boolean).map((member) => member.id);
	const availableUsers = users.filter((user) => !currentMemberIds.includes(user.id) && user.status === "active");

	const handleSubmit = async (event) => {
		event.preventDefault();
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
		<AppDialog open onOpenChange={(open) => (open ? null : onClose())} title={`Add member to ${team.name}`} description="Choose an active teammate to join this team.">
			{error ? <Alert variant="destructive">{error}</Alert> : null}
			{availableUsers.length === 0 ? (
				<div className="space-y-4 text-center">
					<div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-sm text-slate-500">All active users are already members of this team.</div>
					<div className="flex justify-center">
						<Button type="button" variant="secondary" onClick={onClose}>Close</Button>
					</div>
				</div>
			) : (
				<form className="space-y-4" onSubmit={handleSubmit}>
					<div className="space-y-2">
						<label className="text-sm font-medium text-slate-700" htmlFor="team-member-user">Select User</label>
						<select id="team-member-user" className={inputClassName} value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)} required>
							<option value="">Choose a user...</option>
							{availableUsers.map((user) => (
								<option key={user.id} value={user.id}>{user.name} ({user.email}) - {formatRole(user.role)}</option>
							))}
						</select>
					</div>
					<div className="flex justify-end gap-3 pt-2">
						<Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
						<Button type="submit" disabled={loading || !selectedUserId}>{loading ? "Adding..." : "Add Member"}</Button>
					</div>
				</form>
			)}
		</AppDialog>
	);
}

function roleBadgeVariant(role) {
	if (role === "admin") return "purple";
	if (role === "developer") return "info";
	if (role === "designer") return "pink";
	if (role === "product_manager") return "orange";
	return "outline";
}
