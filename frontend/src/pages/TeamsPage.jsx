import { useCallback, useEffect, useState } from "react";
import { Plus, X, Users } from "lucide-react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

	if (loading) {
		return (
			<>
				<div className="px-8 py-8">
					<h2 className="text-2xl font-bold text-gray-900">Teams</h2>
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
						<h2 className="text-2xl font-bold text-gray-900">Teams</h2>
						<p className="text-sm text-gray-500 mt-1">{teams.length} teams in your organization</p>
					</div>
					<Button onClick={() => setShowCreateModal(true)} className="gap-2">
						<Plus className="h-4 w-4" />
						Create Team
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

				{teams.length === 0 ? (
					<div className="text-center py-16">
						<div className="mx-auto h-14 w-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
							<Users className="h-7 w-7 text-gray-400" />
						</div>
						<p className="text-base text-gray-500 font-medium">No teams yet</p>
						<p className="text-sm text-gray-400 mt-1">Create your first team to get started</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
						{teams.map((team) => {
							const members = teamMembers[team.id] || [];
							return (
								<Card key={team.id} className="overflow-hidden">
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<CardTitle className="text-lg">{team.name}</CardTitle>
											<span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
												{members.length} member{members.length !== 1 ? "s" : ""}
											</span>
										</div>
										<p className="text-xs text-gray-400 mt-1">
											Created{" "}
											{new Date(team.createdAt).toLocaleDateString()} ·
											Updated{" "}
											{new Date(team.updatedAt).toLocaleDateString()}
										</p>
									</CardHeader>
									<CardContent className="pt-0">
										{members.length === 0 ? (
											<div className="text-center py-5 text-sm text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
												No members yet
											</div>
										) : (
											<div className="flex flex-col gap-1.5">
												{members.map(
													(member) =>
														member && (
															<div
																key={member.id}
																className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
															>
																<div className="flex items-center gap-3">
																	<Avatar className="h-8 w-8">
																		<AvatarFallback className="text-xs">
																			{member.name
																				.split(" ")
																				.map((n) => n[0])
																				.join("")}
																		</AvatarFallback>
																	</Avatar>
																	<div>
																		<div className="text-sm font-medium text-gray-900">
																			{member.name}
																		</div>
																		<div className="text-xs text-gray-400">
																			{member.role.replace("_", " ")}
																		</div>
																	</div>
																</div>
																<button
																	type="button"
																	title="Remove member"
																	onClick={() =>
																		handleRemoveMember(
																			team.id,
																			member.id,
																			member.name,
																		)
																	}
																	className="text-gray-300 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
																>
																	<X className="h-3.5 w-3.5" />
																</button>
															</div>
														),
												)}
											</div>
										)}

										<Button
											variant="outline"
											size="sm"
											className="w-full mt-4 gap-1.5"
											onClick={() => setAddMemberTeam(team)}
										>
											<Plus className="h-3.5 w-3.5" />
											Add Member
										</Button>
									</CardContent>
								</Card>
							);
						})}
					</div>
				)}
			</div>

			<CreateTeamDialog
				open={showCreateModal}
				onOpenChange={setShowCreateModal}
				onCreated={() => {
					setShowCreateModal(false);
					loadData();
					setSuccess("Team created successfully");
					setTimeout(() => setSuccess(""), 3000);
				}}
			/>

			<AddMemberDialog
				team={addMemberTeam}
				users={users}
				currentMembers={addMemberTeam ? teamMembers[addMemberTeam.id] || [] : []}
				open={!!addMemberTeam}
				onOpenChange={(open) => {
					if (!open) setAddMemberTeam(null);
				}}
				onAdded={() => {
					setAddMemberTeam(null);
					loadData();
					setSuccess("Member added successfully");
					setTimeout(() => setSuccess(""), 3000);
				}}
			/>
		</div>
	);
}

function CreateTeamDialog({ open, onOpenChange, onCreated }) {
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
			setName("");
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
					<DialogTitle>Create Team</DialogTitle>
				</DialogHeader>
				{error && (
					<Alert variant="destructive">{error}</Alert>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="team-name">Team Name</Label>
						<Input
							id="team-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
							placeholder="e.g. Marketing"
						/>
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
							{loading ? "Creating..." : "Create Team"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function AddMemberDialog({
	team,
	users,
	currentMembers,
	open,
	onOpenChange,
	onAdded,
}) {
	const [selectedUserId, setSelectedUserId] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const currentMemberIds = currentMembers.filter(Boolean).map((m) => m.id);
	const availableUsers = users.filter(
		(u) => !currentMemberIds.includes(u.id) && u.status === "active",
	);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedUserId || !team) return;
		setError("");
		setLoading(true);
		try {
			await api.addTeamMember(team.id, selectedUserId);
			onAdded();
			setSelectedUserId("");
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
					<DialogTitle>Add Member to {team?.name}</DialogTitle>
				</DialogHeader>
				{error && (
					<Alert variant="destructive">{error}</Alert>
				)}
				{availableUsers.length === 0 ? (
					<div className="text-center py-6 text-gray-500">
						<p>All active users are already members of this team.</p>
						<DialogFooter className="mt-4 justify-center">
							<Button
								variant="outline"
								onClick={() => onOpenChange(false)}
							>
								Close
							</Button>
						</DialogFooter>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="team-member-user">Select User</Label>
							<Select
								id="team-member-user"
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
							<Button
								type="submit"
								disabled={loading || !selectedUserId}
							>
								{loading ? "Adding..." : "Add Member"}
							</Button>
						</DialogFooter>
					</form>
				)}
			</DialogContent>
		</Dialog>
	);
}
