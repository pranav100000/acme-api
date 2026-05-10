import { useCallback, useEffect, useState } from "react";
import * as api from "../api";
import AddMemberModal from "../components/AddMemberModal";
import CreateTeamModal from "../components/CreateTeamModal";
import { useFlash } from "../hooks/useFlash";

export default function TeamsPage() {
	const [teams, setTeams] = useState([]);
	const [users, setUsers] = useState([]);
	const [teamMembers, setTeamMembers] = useState({});
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [addMemberTeam, setAddMemberTeam] = useState(null);
	const [flashError, showFlashError] = useFlash();
	const [success, showSuccess] = useFlash();

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
			setLoadError("Failed to load teams");
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
			showSuccess(`${userName} removed from team`);
			loadData();
		} catch (err) {
			showFlashError(err.message);
		}
	};

	if (loading) {
		return (
			<>
				<div className="page-header">
					<h2>Teams</h2>
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
				<h2>Teams</h2>
				<button
					type="button"
					className="btn btn-primary"
					onClick={() => setShowCreateModal(true)}
				>
					+ Create Team
				</button>
			</div>
			<div className="page-body">
				{loadError && <div className="alert alert-error">{loadError}</div>}
				{flashError && <div className="alert alert-error">{flashError}</div>}
				{success && <div className="alert alert-success">{success}</div>}

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
										<span style={{ fontSize: "13px", color: "#6b7280" }}>
											{members.length} member{members.length !== 1 ? "s" : ""}
										</span>
									</div>
									<div className="team-card-body">
										<div className="team-meta">
											Created {new Date(team.createdAt).toLocaleDateString()} ·
											Updated {new Date(team.updatedAt).toLocaleDateString()}
										</div>

										{members.length === 0 ? (
											<div
												style={{
													padding: "16px",
													textAlign: "center",
													color: "#9ca3af",
													fontSize: "14px",
												}}
											>
												No members yet
											</div>
										) : (
											<div className="member-list">
												{members.map(
													(member) =>
														member && (
															<div key={member.id} className="member-item">
																<div className="member-info">
																	<div className="member-avatar">
																		{member.name
																			.split(" ")
																			.map((n) => n[0])
																			.join("")}
																	</div>
																	<div>
																		<div
																			style={{
																				fontWeight: 500,
																				fontSize: "14px",
																			}}
																		>
																			{member.name}
																		</div>
																		<div
																			style={{
																				fontSize: "12px",
																				color: "#6b7280",
																			}}
																		>
																			{member.role.replace("_", " ")}
																		</div>
																	</div>
																</div>
																<button
																	type="button"
																	className="btn-icon"
																	title="Remove member"
																	onClick={() =>
																		handleRemoveMember(
																			team.id,
																			member.id,
																			member.name,
																		)
																	}
																	style={{ fontSize: "16px" }}
																>
																	✕
																</button>
															</div>
														),
												)}
											</div>
										)}

										<div style={{ marginTop: "16px" }}>
											<button
												type="button"
												className="btn btn-secondary btn-sm"
												style={{ width: "100%", justifyContent: "center" }}
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
					onCreated={() => {
						setShowCreateModal(false);
						loadData();
						showSuccess("Team created successfully");
					}}
				/>
			)}

			{addMemberTeam && (
				<AddMemberModal
					team={addMemberTeam}
					users={users}
					currentMembers={teamMembers[addMemberTeam.id] || []}
					onClose={() => setAddMemberTeam(null)}
					onAdded={() => {
						setAddMemberTeam(null);
						loadData();
						showSuccess("Member added successfully");
					}}
				/>
			)}
		</>
	);
}
