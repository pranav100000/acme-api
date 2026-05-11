import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";

const navigation = [
	{ to: "/", label: "Dashboard", icon: "📊", end: true },
	{ to: "/users", label: "Users", icon: "👥" },
	{ to: "/teams", label: "Teams", icon: "🏷️" },
];

export default function Layout({ children }) {
	const { user, logout } = useAuth();

	return (
		<div className="app-layout">
			<aside className="sidebar">
				<div className="sidebar-brand">
					<h1>🏢 Acme Corp</h1>
					<span>Admin Dashboard</span>
				</div>
				<nav className="sidebar-nav">
					{navigation.map((item) => (
						<NavLink key={item.to} to={item.to} end={item.end}>
							<span className="nav-icon">{item.icon}</span>
							{item.label}
						</NavLink>
					))}
				</nav>
				<div className="sidebar-user-panel">
					<div className="sidebar-user-card">
						<UserAvatar name={user?.name} size="sm" />
						<div className="sidebar-user-copy">
							<div className="sidebar-user-name">{user?.name}</div>
							<div className="sidebar-user-email">{user?.email}</div>
						</div>
						<button
							type="button"
							onClick={logout}
							title="Logout"
							className="icon-button sidebar-logout"
						>
							🚪
						</button>
					</div>
				</div>
			</aside>
			<main className="main-content">{children}</main>
		</div>
	);
}
