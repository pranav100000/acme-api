import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";
import TeamsPage from "../pages/TeamsPage";
import UsersPage from "../pages/UsersPage";
import Layout from "./Layout";

export default function AppShell() {
	const { user } = useAuth();

	if (!user) {
		return <LoginPage />;
	}

	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Dashboard />} />
				<Route path="/users" element={<UsersPage />} />
				<Route path="/teams" element={<TeamsPage />} />
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</Layout>
	);
}
