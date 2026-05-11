import { useState } from "react";
import * as api from "../api";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
	{ email: "alice@acme.com", role: "admin" },
	{ email: "bob@acme.com", role: "developer" },
	{ email: "frank@acme.com", role: "product manager" },
];

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");
		setLoading(true);
		try {
			const data = await api.login(email);
			login(data.user);
		} catch (err) {
			setError(err.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="login-page">
			<div className="login-card">
				<h1>🏢 Acme Corp</h1>
				<p className="login-subtitle">Sign in to the admin dashboard</p>

				{error && <div className="alert alert-error">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email address</label>
						<input
							id="email"
							type="email"
							className="form-control"
							placeholder="alice@acme.com"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>
					<button
						type="submit"
						className="btn btn-primary btn-block"
						disabled={loading}
					>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</form>

				<div className="demo-accounts">
					<strong className="demo-accounts-title">Demo accounts:</strong>
					<div className="demo-accounts-list">
						{demoAccounts.map((account) => (
							<div key={account.email}>
								<code>{account.email}</code> ({account.role})
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
