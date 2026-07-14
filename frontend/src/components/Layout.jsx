import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../App";
import useIsMobile from "../hooks/useIsMobile";

const navItems = [
	{ to: "/", label: "Dashboard", icon: "📊" },
	{ to: "/users", label: "Users", icon: "👥" },
	{ to: "/teams", label: "Teams", icon: "🏷️" },
];

function SidebarContent({ user, logout, onNavigate }) {
	return (
		<>
			<div className="sidebar-brand">
				<h1>🏢 Acme Corp</h1>
				<span>Admin Dashboard</span>
			</div>
			<nav className="sidebar-nav">
				{navItems.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.to === "/"}
						onClick={onNavigate}
					>
						<span className="nav-icon">{item.icon}</span>
						{item.label}
					</NavLink>
				))}
			</nav>
			<div className="sidebar-user-section">
				<div className="sidebar-user-card">
					<div className="sidebar-user-avatar">
						{user?.name
							?.split(" ")
							.map((namePart) => namePart[0])
							.join("") || "?"}
					</div>
					<div className="sidebar-user-copy">
						<div className="sidebar-user-name">{user?.name}</div>
						<div className="sidebar-user-email">{user?.email}</div>
					</div>
					<button
						type="button"
						onClick={logout}
						title="Logout"
						className="sidebar-logout-button"
					>
						🚪
					</button>
				</div>
			</div>
		</>
	);
}

export default function Layout({ children }) {
	const { user, logout } = useAuth();
	const isMobile = useIsMobile();
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	useEffect(() => {
		if (!isMobile) {
			setMobileNavOpen(false);
		}
	}, [isMobile]);

	return (
		<div className={`app-layout${isMobile ? " is-mobile-layout" : ""}`}>
			{isMobile ? (
				<>
					<header className="mobile-topbar">
						<button
							type="button"
							className="mobile-menu-button"
							onClick={() => setMobileNavOpen(true)}
							aria-label="Open navigation menu"
						>
							☰
						</button>
						<div className="mobile-topbar-copy">
							<span className="mobile-topbar-eyebrow">Acme Corp</span>
							<strong>Admin Dashboard</strong>
						</div>
						<button
							type="button"
							className="mobile-profile-pill"
							onClick={logout}
							title="Logout"
						>
							{user?.name?.[0] || "?"}
						</button>
					</header>

					{mobileNavOpen && (
						<div className="mobile-nav-shell">
							<button
								type="button"
								className="mobile-nav-backdrop"
								onClick={() => setMobileNavOpen(false)}
								aria-label="Close navigation menu"
							/>
							<aside className="sidebar mobile-sidebar">
								<div className="mobile-sidebar-header">
									<span>Navigation</span>
									<button
										type="button"
										className="btn-icon mobile-close-button"
										onClick={() => setMobileNavOpen(false)}
									>
										✕
									</button>
								</div>
								<SidebarContent
									user={user}
									logout={logout}
									onNavigate={() => setMobileNavOpen(false)}
								/>
							</aside>
						</div>
					)}
				</>
			) : (
				<aside className="sidebar">
					<SidebarContent user={user} logout={logout} />
				</aside>
			)}
			<main className="main-content">{children}</main>
		</div>
	);
}
