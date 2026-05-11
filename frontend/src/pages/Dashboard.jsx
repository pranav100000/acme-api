import { useMemo } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import LoadingState from "../components/LoadingState";
import PageHeader from "../components/PageHeader";
import StatusIndicator from "../components/StatusIndicator";
import { useAsyncData } from "../hooks/useAsyncData";
import { formatDate, formatRole } from "../utils/formatters";

async function loadDashboardData() {
	const [users, teams, health] = await Promise.all([
		api.getUsers(),
		api.getTeams(),
		api.healthCheck(),
	]);
	return { health, teams, users };
}

export default function Dashboard() {
	const { data, loading } = useAsyncData(loadDashboardData, {
		health: null,
		teams: [],
		users: [],
	});

	const { health, teams, users } = data;
	const activeUsers = users.filter((user) => user.status === "active").length;
	const pendingUsers = users.filter((user) => user.status === "pending").length;
	const recentUsers = useMemo(
		() =>
			[...users]
				.sort(
					(left, right) => new Date(right.createdAt) - new Date(left.createdAt),
				)
				.slice(0, 5),
		[users],
	);

	if (loading) {
		return <LoadingState title="Dashboard" />;
	}

	return (
		<>
			<PageHeader
				title="Dashboard"
				actions={<StatusIndicator healthy={health?.status === "ok"} />}
			/>
			<div className="page-body">
				<div className="stats-grid">
					<StatCard
						label="Total Users"
						value={users.length}
						detail={`${activeUsers} active, ${pendingUsers} pending`}
					/>
					<StatCard
						label="Teams"
						value={teams.length}
						detail={`${teams.reduce((sum, team) => sum + team.members.length, 0)} total memberships`}
					/>
					<StatCard
						label="Roles"
						value={new Set(users.map((user) => user.role)).size}
						detail="Unique roles across users"
					/>
					<StatCard
						label="API Status"
						value={health?.status === "ok" ? "✓" : "✗"}
						detail={
							health?.status === "ok"
								? "All systems operational"
								: "Issues detected"
						}
						valueClassName={
							health?.status === "ok" ? "text-success" : "text-danger"
						}
					/>
				</div>

				<div className="split-grid">
					<div className="card">
						<div className="card-header">
							<h3>Recent Users</h3>
							<Link to="/users" className="btn btn-secondary btn-sm">
								View all
							</Link>
						</div>
						<div className="table-container">
							<table>
								<thead>
									<tr>
										<th>Name</th>
										<th>Role</th>
										<th>Status</th>
									</tr>
								</thead>
								<tbody>
									{recentUsers.map((user) => (
										<tr key={user.id}>
											<td>
												<div className="table-primary">{user.name}</div>
												<div className="table-secondary">{user.email}</div>
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
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="card">
						<div className="card-header">
							<h3>Teams Overview</h3>
							<Link to="/teams" className="btn btn-secondary btn-sm">
								View all
							</Link>
						</div>
						<div className="table-container">
							<table>
								<thead>
									<tr>
										<th>Team</th>
										<th>Members</th>
										<th>Created</th>
									</tr>
								</thead>
								<tbody>
									{teams.map((team) => (
										<tr key={team.id}>
											<td className="table-primary">{team.name}</td>
											<td>{team.members.length} members</td>
											<td className="table-secondary">
												{formatDate(team.createdAt)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function StatCard({ label, value, detail, valueClassName = "" }) {
	return (
		<div className="stat-card">
			<div className="stat-label">{label}</div>
			<div className={`stat-value ${valueClassName}`.trim()}>{value}</div>
			<div className="stat-detail">{detail}</div>
		</div>
	);
}
