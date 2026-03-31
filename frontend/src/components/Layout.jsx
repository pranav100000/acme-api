import { NavLink } from "react-router-dom";
import { BarChart3, Users, Tags, LogOut } from "lucide-react";
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
		<div className="flex min-h-screen">
			<aside className="w-60 bg-gray-900 text-white flex flex-col fixed top-0 left-0 bottom-0 z-10">
				<div className="px-6 py-5 border-b border-gray-700">
					<h1 className="text-xl font-bold tracking-tight">Acme Corp</h1>
					<span className="text-xs text-gray-400 uppercase tracking-widest">
						Admin Dashboard
					</span>
				</div>
				<nav className="flex-1 p-3 flex flex-col gap-1">
					{navItems.map(({ to, icon: Icon, label, end }) => (
						<NavLink
							key={to}
							to={to}
							end={end}
							className={({ isActive }) =>
								`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
									isActive
										? "bg-indigo-600 text-white"
										: "text-gray-300 hover:bg-gray-800 hover:text-white"
								}`
							}
						>
							<Icon className="h-5 w-5" />
							{label}
						</NavLink>
					))}
				</nav>
				<div className="p-3 border-t border-gray-700">
					<div className="flex items-center gap-3 px-3 py-2">
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
							className="text-gray-400 hover:text-white transition-colors cursor-pointer"
						>
							<LogOut className="h-4 w-4" />
						</button>
					</div>
				</div>
			</aside>
			<main className="ml-60 flex-1 min-h-screen">{children}</main>
		</div>
	);
}
