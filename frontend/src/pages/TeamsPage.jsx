import { useCallback, useState } from "react";
import * as api from "../api";
import AlertStack from "../components/AlertStack";
import LoadingState from "../components/LoadingState";
import Modal from "../components/Modal";
import PageHeader from "../components/PageHeader";
import UserAvatar from "../components/UserAvatar";
import { useAsyncData } from "../hooks/useAsyncData";
import { useFlashMessage } from "../hooks/useFlashMessage";
import { formatDate, formatRole } from "../utils/formatters";

async function loadTeamsData() {
	const [teams, users] = await Promise.all([api.getTeams(), api.getUsers()]);
	const memberEntries = await Promise.all(
		teams.map(async (team) => {
			try {
				return [team.id, await api.getTeamMembers(team.id)];
			} catch {
				return [team.id, []];
			}
		}),
	);

	return {
		teamMembers: Object.fromEntries(memberEntries),
		teams,
		users,
	};
}

export default function TeamsPage() {
	const { data, loading, reload } = useAsyncData(
		loadTeamsData,
		{
			teamMembers: {},
			teams: [],
			users: [],
		},
		"Failed to load teams",
	);
	const error = useFlashMessage();
	const success = useFlashMessage();
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [addMemberTeam, setAddMemberTeam] = useState(null);

	const refreshWithSuccess = useCallback(
		async (message, onComplete) => {
			await reload();
			onComplete();
			success.showMessage(message);
		},
		[reload, success],
	);

	const handleRemoveMember = async (teamId, userId, userName) => {
		if (!window.confirm(`Remove ${userName} from this team?`)) {
			return;
		}
		try {
			await api.removeTeamMember(teamId, userId);
			await refreshWithSuccess(`${userName} removed from team`, () => {});
		} catch (err) {
			error.showMessage(err.message);
		}
	};

	if (loading) {
		return <LoadingState title="Teams" />;
	}

	const { teamMembers, teams, users } = data;

	return (
		<>
			<PageHeader
				title="Teams"
				actions={
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => setShowCreateModal(true)}
					>
						+ Create Team
					</button>
				}
			/>
			<div className="page-body">
				<AlertStack error={error.message} success={success.message} />

				{teams.length === 0 ? (
					<div className="empty-state">
						<div className="empty-icon">🏷️</div>
						<p>No teams yet. Create your first team!</p>
					</div>
				) : (
					<div className="teams-grid">
						{teams.map((team) => {
							const members = teamMembers[team.id] || [];
							return (
								<div key={team.id} className="team-card">
									<div className="team-card-header">
										<h3>{team.name}</h3>
										<span className="table-secondary">
											{members.length} member{members.length !== 1 ? "s" : ""}
										</span>
									</div>
									<div className="team-card-body">
										<div className="team-meta">
											Created {formatDate(team.createdAt)} · Updated{" "}
											{formatDate(team.updatedAt)}
										</div>

										{members.length === 0 ? (
											<div className="empty-copy">No members yet</div>
										) : (
											<div className="member-list">
												{members.map(
													(member) =>
														member && (
															<div key={member.id} className="member-item">
																<div className="member-info">
																	<UserAvatar name={member.name} size="sm" />
																	<div>
																		<div className="table-primary">
																			{member.name}
																		</div>
																		<div className="table-secondary">
																			{formatRole(member.role)}
																		</div>
																	</div>
																</div>
																<button
																	type="button"
																	className="icon-button"
																	title="Remove member"
																	onClick={() =>
																		handleRemoveMember(
																			team.id,
																			member.id,
																			member.name,
																		)
																	}
																>
																	✕
																</button>
															</div>
														),
												)}
											</div>
										)}

										<div className="team-actions">
											<button
												type="button"
												className="btn btn-secondary btn-sm btn-full"
												onClick={() => setAddMemberTeam(team)}
											>
												+ Add Member
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</div>

			{showCreateModal && (
				<CreateTeamModal
					onClose={() => setShowCreateModal(false)}
					onCreated={() =>
						refreshWithSuccess("Team created successfully", () =>
							setShowCreateModal(false),
						)
					}
				/>
			)}

			{addMemberTeam && (
				<AddMemberModal
					team={addMemberTeam}
					users={users}
					currentMembers={teamMembers[addMemberTeam.id] || []}
					onClose={() => setAddMemberTeam(null)}
					onAdded={() =>
						refreshWithSuccess("Member added successfully", () =>
							setAddMemberTeam(null),
						)
					}
				/>
			)}
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
			await onCreated();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title="Create Team" onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="team-name">Team Name</label>
					<input
						id="team-name"
						className="form-control"
						value={name}
						onChange={(event) => setName(event.target.value)}
						required
						placeholder="e.g. Marketing"
					/>
				</div>
				<div className="form-actions">
					<button type="button" className="btn btn-secondary" onClick={onClose}>
						Cancel
					</button>
					<button type="submit" className="btn btn-primary" disabled={loading}>
						{loading ? "Creating..." : "Create Team"}
					</button>
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

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!selectedUserId) return;
		setError("");
		setLoading(true);
		try {
			await api.addTeamMember(team.id, selectedUserId);
			await onAdded();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal title={`Add Member to ${team.name}`} onClose={onClose}>
			{error && <div className="alert alert-error">{error}</div>}
			{availableUsers.length === 0 ? (
				<div className="empty-state compact-empty-state">
					<p>All active users are already members of this team.</p>
					<div className="form-actions centered-actions">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}
						>
							Close
						</button>
					</div>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="team-member-user">Select User</label>
						<select
							id="team-member-user"
							className="form-control"
							value={selectedUserId}
							onChange={(event) => setSelectedUserId(event.target.value)}
							required
						>
							<option value="">Choose a user...</option>
							{availableUsers.map((user) => (
								<option key={user.id} value={user.id}>
									{user.name} ({user.email}) - {formatRole(user.role)}
								</option>
							))}
						</select>
					</div>
					<div className="form-actions">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							type="submit"
							className="btn btn-primary"
							disabled={loading || !selectedUserId}
						>
							{loading ? "Adding..." : "Add Member"}
						</button>
					</div>
				</form>
			)}
		</Modal>
	);
}
