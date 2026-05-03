import { createContext, useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import TeamsPage from "./pages/TeamsPage";
import UsersPage from "./pages/UsersPage";

export const AuthContext = createContext(null);

export function useAuth() {
	return useContext(AuthContext);
}

export default function App() {
	const [user, setUser] = useState(() => {
		const saved = localStorage.getItem("acme_user");
		return saved ? JSON.parse(saved) : null;
	});

	const handleLogin = (userData) => {
		setUser(userData);
		localStorage.setItem("acme_user", JSON.stringify(userData));
	};

	const handleLogout = () => {
		setUser(null);
		localStorage.removeItem("acme_user");
	};

	if (!user) {
		return (
			<AuthContext.Provider
				value={{ user, login: handleLogin, logout: handleLogout }}
			>
				<LoginPage />
			</AuthContext.Provider>
		);
	}

	return (
		<AuthContext.Provider
			value={{ user, login: handleLogin, logout: handleLogout }}
		>
			<Layout>
				<Routes>
					<Route path="/" element={<Dashboard />} />
					<Route path="/users" element={<UsersPage />} />
					<Route path="/teams" element={<TeamsPage />} />
					<Route path="/notifications" element={<NotificationsPage />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Routes>
			</Layout>
		</AuthContext.Provider>
	);
}
