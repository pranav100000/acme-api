import {
	Activity,
	ArrowRight,
	Layers3,
	ShieldCheck,
	Users2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as api from "../api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../components/ui/table";

function metricCards({ users, teams, health }) {
	const activeUsers = users.filter((u) => u.status === "active").length;
	const pendingUsers = users.filter((u) => u.status === "pending").length;
	return [
		{
			label: "Total users",
			value: users.length,
			detail: `${activeUsers} active · ${pendingUsers} pending`,
			icon: Users2,
		},
		{
			label: "Teams",
			value: teams.length,
			detail: `${teams.reduce((sum, team) => sum + team.members.length, 0)} memberships`,
			icon: Layers3,
		},
		{
			label: "Unique roles",
			value: new Set(users.map((u) => u.role)).size,
			detail: "Across the organization",
			icon: ShieldCheck,
		},
		{
			label: "API status",
			value: health?.status === "ok" ? "Healthy" : "Issues",
			detail:
				health?.status === "ok"
					? "All systems operational"
					: "Action recommended",
			icon: Activity,
		},
	];
}

const roleVariant = {
	admin: "info",
	developer: "secondary",
	designer: "pink",
	product_manager: "orange",
};

const statusVariant = {
	active: "success",
	inactive: "danger",
	pending: "warning",
};

function LoadingDashboard() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between rounded-3xl border border-zinc-800 bg-zinc-950/80 px-6 py-5 shadow-sm shadow-black/20 backdrop-blur">
				<div className="space-y-2">
					<Skeleton className="h-8 w-40" />
					<Skeleton className="h-4 w-56" />
				</div>
				<Skeleton className="h-10 w-24" />
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{["users", "teams", "roles", "status"].map((item) => (
					<Card key={item}>
						<CardContent className="space-y-3 py-6">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-4 w-32" />
						</CardContent>
					</Card>
				))}
			</div>
		</div>
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
			} catch (err) {
				console.error("Failed to load dashboard data:", err);
			} finally {
				setLoading(false);
			}
		}
		fetchData();
	}, []);

	if (loading) {
		return <LoadingDashboard />;
	}

	const recentUsers = [...users]
		.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
		.slice(0, 5);

	return (
		<div className="space-y-6">
			<section className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/80 px-6 py-6 shadow-sm shadow-black/20 backdrop-blur">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<p className="text-sm font-medium uppercase tracking-[0.3em] text-zinc-500">
							Overview
						</p>
						<h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
							Dashboard
						</h2>
						<p className="mt-2 max-w-2xl text-sm text-zinc-400">
							Quickly review user growth, team coverage, and service health from
							one polished command center.
						</p>
					</div>
					<div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-black px-4 py-3">
						<span
							className={`size-2.5 rounded-full ${health?.status === "ok" ? "bg-zinc-100" : "bg-zinc-600"}`}
						/>
						<div>
							<p className="text-sm font-medium text-zinc-100">
								API {health?.status === "ok" ? "Healthy" : "Unhealthy"}
							</p>
							<p className="text-xs text-zinc-400">
								Latest health check synced live
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{metricCards({ users, teams, health }).map(
					({ label, value, detail, icon: Icon }) => (
						<Card
							key={label}
							className="border-zinc-800 bg-zinc-950/85 backdrop-blur"
						>
							<CardContent className="flex items-start justify-between gap-4 py-6">
								<div>
									<p className="text-sm text-zinc-400">{label}</p>
									<p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-100">
										{value}
									</p>
									<p className="mt-2 text-sm text-zinc-400">{detail}</p>
								</div>
								<div className="rounded-2xl bg-black p-3 text-zinc-300">
									<Icon className="size-5" />
								</div>
							</CardContent>
						</Card>
					),
				)}
			</section>

			<section className="grid gap-6 xl:grid-cols-2">
				<Card className="border-zinc-800 bg-zinc-950/90 backdrop-blur">
					<CardHeader className="flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle>Recent users</CardTitle>
							<CardDescription>
								The newest accounts added to the workspace.
							</CardDescription>
						</div>
						<Button asChild variant="secondary" size="sm">
							<Link to="/users">
								View all <ArrowRight className="size-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="pt-0">
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
											<div className="font-medium text-zinc-100">
												{user.name}
											</div>
											<div className="text-xs text-zinc-400">{user.email}</div>
										</TableCell>
										<TableCell>
											<Badge variant={roleVariant[user.role] || "secondary"}>
												{user.role.replace("_", " ")}
											</Badge>
										</TableCell>
										<TableCell>
											<Badge
												variant={statusVariant[user.status] || "secondary"}
											>
												{user.status}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card className="border-zinc-800 bg-zinc-950/90 backdrop-blur">
					<CardHeader className="flex-row items-center justify-between space-y-0">
						<div>
							<CardTitle>Teams overview</CardTitle>
							<CardDescription>
								Current team coverage and member counts.
							</CardDescription>
						</div>
						<Button asChild variant="secondary" size="sm">
							<Link to="/teams">
								View all <ArrowRight className="size-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent className="pt-0">
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
										<TableCell className="font-medium text-zinc-100">
											{team.name}
										</TableCell>
										<TableCell>{team.members.length} members</TableCell>
										<TableCell>
											{new Date(team.createdAt).toLocaleDateString()}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
