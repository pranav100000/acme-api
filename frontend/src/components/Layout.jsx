import { BarChart3, Building2, LogOut, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../App";
import { Avatar } from "./ui/avatar";
import { Button } from "./ui/button";
import { cn, getInitials } from "../lib/utils";

const navItems = [
	{ to: "/", label: "Dashboard", icon: BarChart3 },
	{ to: "/users", label: "Users", icon: Users },
	{ to: "/teams", label: "Teams", icon: Building2 },
];

export default function Layout({ children }) {
	const { user, logout } = useAuth();

	return (
		<div className="min-h-screen bg-slate-100 text-slate-950">
			<div className="mx-auto flex min-h-screen max-w-[1600px] flex-col lg:flex-row">
				<aside className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
					<div className="flex items-center gap-3 px-2">
						<div className="flex size-11 items-center justify-center rounded-xl bg-violet-500/15 text-violet-200 ring-1 ring-inset ring-violet-400/20">
							<Building2 className="size-5" />
						</div>
						<div>
							<p className="text-lg font-semibold tracking-tight">Acme Corp</p>
							<p className="text-sm text-slate-400">Admin Dashboard</p>
						</div>
					</div>

					<nav className="mt-6 grid gap-1.5">
						{navItems.map(({ to, label, icon: Icon }) => (
							<NavLink
								key={to}
								to={to}
								end={to === "/"}
								className={({ isActive }) =>
									cn(
										"flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
										isActive
											? "bg-white text-slate-950 shadow-sm"
											: "text-slate-300 hover:bg-white/10 hover:text-white",
									)
								}
							>
								<Icon className="size-4" />
								<span>{label}</span>
							</NavLink>
						))}
					</nav>

					<div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 lg:mt-auto">
						<Avatar className="bg-white text-slate-950">{getInitials(user?.name)}</Avatar>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-white">{user?.name}</p>
							<p className="truncate text-xs text-slate-400">{user?.email}</p>
						</div>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							onClick={logout}
							className="text-slate-300 hover:bg-white/10 hover:text-white"
							title="Logout"
						>
							<LogOut className="size-4" />
							<span className="sr-only">Logout</span>
						</Button>
					</div>
				</aside>

				<main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
