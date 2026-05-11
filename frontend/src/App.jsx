import AppShell from "./components/AppShell";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
	return (
		<AuthProvider>
			<AppShell />
		</AuthProvider>
	);
}
