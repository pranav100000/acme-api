import { NavLink } from "react-router-dom";
import { BarChart3, Users, Tags, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../App";
import { Avatar, AvatarFallback } from "./ui/avatar";

const navItems = [
	{ to: "/", icon: BarChart3, label: "Dashboard", end: true },
	{ to: "/users", icon: Users, label: "Users" },
	{ to: "/teams", icon: Tags, label: "Teams" },
];

export default function Layout({ children }) {
	const { user, logout } = useAuth();

	return (
		<div className="flex min-h-screen bg-gray-50">
			<aside className="w-64 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10">
				<div className="px-6 py-6">
					<div className="flex items-center gap-3">
						<div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-indigo-500/30">
							A
						</div>
						<div>
							<h1 className="text-base font-bold tracking-tight">Acme Corp</h1>
							<span className="text-[11px] text-gray-400 font-medium uppercase tracking-widest">
								Admin
							</span>
						</div>
					</div>
				</div>
				<div className="px-3 mb-2">
					<div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
				</div>
				<nav className="flex-1 px-3 py-2 flex flex-col gap-0.5">
					{navItems.map(({ to, icon: Icon, label, end }) => (
						<NavLink
							key={to}
							to={to}
							end={end}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
									isActive
										? "bg-gradient-to-r from-indigo-600/90 to-indigo-500/80 text-white shadow-lg shadow-indigo-500/20"
										: "text-gray-400 hover:text-white hover:bg-white/5"
								}`
							}
						>
							<Icon className="h-[18px] w-[18px]" />
							<span className="flex-1">{label}</span>
							<ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-150" />
						</NavLink>
					))}
				</nav>
				<div className="px-3 mb-2">
					<div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
				</div>
				<div className="p-3 pb-4">
					<div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5">
						<Avatar className="h-8 w-8">
							<AvatarFallback className="text-xs">
								{user?.name
									?.split(" ")
									.map((n) => n[0])
									.join("") || "?"}
							</AvatarFallback>
						</Avatar>
						<div className="flex-1 min-w-0">
							<div className="text-sm font-medium text-white truncate">
								{user?.name}
							</div>
							<div className="text-xs text-gray-400 truncate">
								{user?.email}
							</div>
						</div>
						<button
							type="button"
							onClick={logout}
							title="Logout"
							className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10 cursor-pointer"
						>
							<LogOut className="h-4 w-4" />
						</button>
					</div>
				</div>
			</aside>
			<main className="ml-64 flex-1 min-h-screen">{children}</main>
		</div>
	);
}
