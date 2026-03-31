import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
				<div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
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

	return (
		<>
			<div className="bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between">
				<h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
				<div className="flex items-center gap-2">
					<span
						className={`inline-block w-2 h-2 rounded-full ${health?.status === "ok" ? "bg-green-500" : "bg-red-500"}`}
					/>
					<span className="text-sm text-gray-500">
						API {health?.status === "ok" ? "Healthy" : "Unhealthy"}
					</span>
				</div>
			</div>
			<div className="p-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
					<Card>
						<CardContent className="p-6">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Total Users
							</p>
							<p className="text-3xl font-bold text-gray-900 mt-1">
								{users.length}
							</p>
							<p className="text-sm text-gray-500 mt-1">
								{activeUsers} active, {pendingUsers} pending
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Teams
							</p>
							<p className="text-3xl font-bold text-gray-900 mt-1">
								{teams.length}
							</p>
							<p className="text-sm text-gray-500 mt-1">
								{teams.reduce((sum, t) => sum + t.members.length, 0)} total
								memberships
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								Roles
							</p>
							<p className="text-3xl font-bold text-gray-900 mt-1">
								{new Set(users.map((u) => u.role)).size}
							</p>
							<p className="text-sm text-gray-500 mt-1">
								Unique roles across users
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-6">
							<p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
								API Status
							</p>
							<p
								className={`text-3xl font-bold mt-1 ${health?.status === "ok" ? "text-green-600" : "text-red-600"}`}
							>
								{health?.status === "ok" ? "✓" : "✗"}
							</p>
							<p className="text-sm text-gray-500 mt-1">
								{health?.status === "ok"
									? "All systems operational"
									: "Issues detected"}
							</p>
						</CardContent>
					</Card>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<Card>
						<CardHeader className="flex-row items-center justify-between pb-4">
							<CardTitle className="text-base">Recent Users</CardTitle>
							<Button variant="outline" size="sm" asChild>
								<Link to="/users">View all</Link>
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
											<div className="font-medium">{user.name}</div>
											<div className="text-xs text-gray-500">{user.email}</div>
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
							<Button variant="outline" size="sm" asChild>
								<Link to="/teams">View all</Link>
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
										<TableCell className="font-medium">{team.name}</TableCell>
										<TableCell>{team.members.length} members</TableCell>
										<TableCell className="text-sm text-gray-500">
											{new Date(team.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Card>
				</div>
			</div>
		</>
	);
}
