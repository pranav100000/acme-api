import { Activity, ArrowUpRight, BriefcaseBusiness, ShieldCheck, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { LoadingState } from "../components/LoadingState";
import { PageShell } from "../components/PageShell";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { formatRole } from "../lib/utils";

function StatCard({ icon: Icon, label, value, detail, accent }) {
	return (
		<Card className="overflow-hidden">
			<CardContent className="flex items-start justify-between p-6">
				<div className="space-y-2">
					<p className="text-sm font-medium text-slate-500">{label}</p>
					<p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
					<p className="text-sm text-slate-500">{detail}</p>
				</div>
				<div className={`flex size-11 items-center justify-center rounded-xl ${accent}`}>
					<Icon className="size-5" />
				</div>
			</CardContent>
		</Card>
	);
}

export default function Dashboard() {
	const [users, setUsers] = useState([]);
	const [teams, setTeams] = useState([]);
	const [health, setHealth] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchData() {
			try {
				const [usersData, teamsData, healthData] = await Promise.all([
					api.getUsers(),
					api.getTeams(),
					api.healthCheck(),
				]);
				setUsers(usersData);
				setTeams(teamsData);
				setHealth(healthData);
			} catch (error) {
				console.error("Failed to load dashboard data:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	const activeUsers = useMemo(() => users.filter((user) => user.status === "active").length, [users]);
	const pendingUsers = useMemo(() => users.filter((user) => user.status === "pending").length, [users]);
	const recentUsers = useMemo(
		() => [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
		[users],
	);

	if (loading) {
		return <LoadingState label="Loading dashboard" />;
	}

	return (
		<PageShell
			title="Dashboard"
			description="A quick pulse on identity, staffing, and service health across Acme Corp."
			action={
				<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
					<span className={`size-2 rounded-full ${health?.status === "ok" ? "bg-emerald-500" : "bg-rose-500"}`} />
					API {health?.status === "ok" ? "Healthy" : "Unhealthy"}
				</div>
			}
		>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				<StatCard icon={Users} label="Total Users" value={users.length} detail={`${activeUsers} active • ${pendingUsers} pending`} accent="bg-blue-50 text-blue-600" />
				<StatCard icon={BriefcaseBusiness} label="Teams" value={teams.length} detail={`${teams.reduce((sum, team) => sum + team.members.length, 0)} total memberships`} accent="bg-violet-50 text-violet-600" />
				<StatCard icon={ShieldCheck} label="Roles" value={new Set(users.map((user) => user.role)).size} detail="Unique roles across users" accent="bg-amber-50 text-amber-600" />
				<StatCard icon={Activity} label="API Status" value={health?.status === "ok" ? "✓" : "✕"} detail={health?.status === "ok" ? "All systems operational" : "Issues detected"} accent={health?.status === "ok" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"} />
			</div>

			<div className="grid gap-6 xl:grid-cols-2">
				<Card>
					<CardHeader>
						<div>
							<CardTitle>Recent Users</CardTitle>
							<CardDescription>Newest teammates and their current access level.</CardDescription>
						</div>
						<Button asChild variant="secondary" size="sm">
							<Link to="/users">View all <ArrowUpRight className="size-4" /></Link>
						</Button>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Name</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentUsers.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<div className="font-medium text-slate-900">{user.name}</div>
												<div className="text-xs text-slate-500">{user.email}</div>
											</TableCell>
											<TableCell>
												<Badge variant={roleBadgeVariant(user.role)}>{formatRole(user.role)}</Badge>
											</TableCell>
											<TableCell>
												<Badge variant={statusBadgeVariant(user.status)}>{user.status}</Badge>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<div>
							<CardTitle>Teams Overview</CardTitle>
							<CardDescription>How squads are staffed across the organization.</CardDescription>
						</div>
						<Button asChild variant="secondary" size="sm">
							<Link to="/teams">View all <ArrowUpRight className="size-4" /></Link>
						</Button>
					</CardHeader>
					<CardContent className="p-0">
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Team</TableHead>
										<TableHead>Members</TableHead>
										<TableHead>Created</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{teams.map((team) => (
										<TableRow key={team.id}>
											<TableCell className="font-medium text-slate-900">{team.name}</TableCell>
											<TableCell>{team.members.length} members</TableCell>
											<TableCell className="text-slate-500">{new Date(team.createdAt).toLocaleDateString()}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</PageShell>
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
