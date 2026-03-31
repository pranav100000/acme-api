import {
	BarChart3,
	Building2,
	LogOut,
	ShieldCheck,
	Users,
	UsersRound,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../App";
import { cn } from "../lib/utils";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const navItems = [
	{ to: "/", label: "Dashboard", icon: BarChart3 },
	{ to: "/users", label: "Users", icon: Users },
	{ to: "/teams", label: "Teams", icon: UsersRound },
];

export default function Layout({ children }) {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-transparent lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
			<aside className="border-b border-zinc-800 bg-black px-5 py-6 text-zinc-100 shadow-2xl shadow-black/40 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
				<div className="flex items-center gap-3 px-2">
					<div className="flex size-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-200 ring-1 ring-inset ring-zinc-700">
						<Building2 className="size-5" />
					</div>
					<div>
						<p className="text-lg font-semibold tracking-tight">Acme Corp</p>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-400">
							Admin dashboard
						</p>
					</div>
				</div>

				<div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-3">
					<div className="flex items-center gap-3">
						<Avatar className="size-11 bg-zinc-100 text-sm text-zinc-950">
							{user?.name
								?.split(" ")
								.map((part) => part[0])
								.join("") || "?"}
						</Avatar>
						<div className="min-w-0">
							<p className="truncate font-medium text-zinc-100">{user?.name}</p>
							<p className="truncate text-sm text-slate-400">{user?.email}</p>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-2 rounded-xl border border-zinc-800 bg-black px-3 py-2 text-xs text-zinc-300">
						<ShieldCheck className="size-4" />
						Signed in securely
					</div>
				</div>

				<nav className="mt-8 space-y-2">
					{navItems.map(({ to, label, icon: Icon }) => (
						<NavLink
							key={to}
							to={to}
							end={to === "/"}
							className={({ isActive }) =>
								cn(
									"flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
									isActive
										? "bg-zinc-100 text-zinc-950 shadow-lg"
										: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
								)
							}
						>
							<Icon className="size-4" />
							{label}
						</NavLink>
					))}
				</nav>

				<Separator className="my-6 bg-slate-800" />

				<Button
					variant="ghost"
					className="w-full justify-between text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
					onClick={logout}
				>
					Sign out
					<LogOut className="size-4" />
				</Button>
			</aside>

			<main className="min-w-0 px-4 py-4 lg:px-8 lg:py-6">{children}</main>
		</div>
	);
}
