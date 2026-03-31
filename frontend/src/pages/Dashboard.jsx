import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Tags, Shield, Activity, ArrowRight } from "lucide-react";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const statCardStyles = [
	{ icon: Users, gradient: "from-indigo-500 to-indigo-600", shadow: "shadow-indigo-500/20" },
	{ icon: Tags, gradient: "from-violet-500 to-violet-600", shadow: "shadow-violet-500/20" },
	{ icon: Shield, gradient: "from-sky-500 to-sky-600", shadow: "shadow-sky-500/20" },
	{ icon: Activity, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
];

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
			} catch (err) {
				console.error("Failed to load dashboard data:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return (
			<>
				<div className="px-8 py-8">
					<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
				</div>
				<div className="p-8">
					<div className="flex items-center justify-center py-12">
						<div className="spinner" />
					</div>
				</div>
			</>
		);
	}

	const activeUsers = users.filter((u) => u.status === "active").length;
	const pendingUsers = users.filter((u) => u.status === "pending").length;
	const recentUsers = [...users]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	const statCards = [
		{ label: "Total Users", value: users.length, sub: `${activeUsers} active, ${pendingUsers} pending` },
		{ label: "Teams", value: teams.length, sub: `${teams.reduce((sum, t) => sum + t.members.length, 0)} total memberships` },
		{ label: "Roles", value: new Set(users.map((u) => u.role)).size, sub: "Unique roles across users" },
		{ label: "API Status", value: health?.status === "ok" ? "Live" : "Down", sub: health?.status === "ok" ? "All systems operational" : "Issues detected" },
	];

	return (
		<div className="animate-fade-in">
			<div className="px-8 pt-8 pb-2">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
						<p className="text-sm text-gray-500 mt-1">Overview of your workspace</p>
					</div>
					<div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm">
						<span
							className={`inline-block w-2 h-2 rounded-full ${health?.status === "ok" ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-red-500"}`}
						/>
						<span className="text-sm text-gray-600 font-medium">
							{health?.status === "ok" ? "Healthy" : "Unhealthy"}
						</span>
					</div>
				</div>
			</div>
			<div className="px-8 pb-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
					{statCards.map((stat, i) => {
						const { icon: Icon, gradient, shadow } = statCardStyles[i];
						return (
							<Card key={stat.label} className="overflow-hidden">
								<CardContent className="p-5">
									<div className="flex items-start justify-between mb-3">
										<div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md ${shadow}`}>
											<Icon className="h-5 w-5 text-white" />
										</div>
									</div>
									<p className="text-2xl font-bold text-gray-900">
										{stat.value}
									</p>
									<p className="text-xs font-medium text-gray-500 mt-0.5">
										{stat.label}
									</p>
									<p className="text-xs text-gray-400 mt-1">
										{stat.sub}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<Card>
						<CardHeader className="flex-row items-center justify-between pb-4">
							<CardTitle className="text-base">Recent Users</CardTitle>
							<Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
								<Link to="/users">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
							</Button>
						</CardHeader>
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
											<div className="font-medium text-gray-900">{user.name}</div>
											<div className="text-xs text-gray-400">{user.email}</div>
										</TableCell>
										<TableCell>
											<Badge variant={user.role}>
												{user.role.replace("_", " ")}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge variant={user.status}>{user.status}</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>

					<Card>
						<CardHeader className="flex-row items-center justify-between pb-4">
							<CardTitle className="text-base">Teams Overview</CardTitle>
							<Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1">
								<Link to="/teams">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
							</Button>
						</CardHeader>
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
										<TableCell className="font-medium text-gray-900">{team.name}</TableCell>
										<TableCell>
											<span className="inline-flex items-center gap-1.5 text-gray-600">
												<Users className="h-3.5 w-3.5 text-gray-400" />
												{team.members.length}
											</span>
										</TableCell>
										<TableCell className="text-sm text-gray-400">
											{new Date(team.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</div>
			</div>
		</div>
	);
}
