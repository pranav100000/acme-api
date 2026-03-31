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
			<aside className="border-b border-white/60 bg-slate-950 px-5 py-6 text-slate-100 shadow-2xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:border-slate-800">
				<div className="flex items-center gap-3 px-2">
					<div className="flex size-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/30">
						<Building2 className="size-5" />
					</div>
					<div>
						<p className="text-lg font-semibold tracking-tight">Acme Corp</p>
						<p className="text-xs uppercase tracking-[0.3em] text-slate-400">
							Admin dashboard
						</p>
					</div>
				</div>

				<div className="mt-8 rounded-2xl border border-slate-800 bg-white/5 p-3">
					<div className="flex items-center gap-3">
						<Avatar className="size-11 bg-indigo-500 text-sm">
							{user?.name
								?.split(" ")
								.map((part) => part[0])
								.join("") || "?"}
						</Avatar>
						<div className="min-w-0">
							<p className="truncate font-medium text-white">{user?.name}</p>
							<p className="truncate text-sm text-slate-400">{user?.email}</p>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200">
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
										? "bg-white text-slate-950 shadow-lg"
										: "text-slate-300 hover:bg-white/10 hover:text-white",
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
					className="w-full justify-between text-slate-300 hover:bg-white/10 hover:text-white"
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
