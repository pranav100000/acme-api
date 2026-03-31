import { useState } from "react";
import { useAuth } from "../App";
import * as api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

export default function LoginPage() {
	const { login } = useAuth();
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
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
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
			{/* Background decoration */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl" />
				<div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl" />
			</div>

			<Card className="w-full max-w-md shadow-2xl border-gray-200/20 relative z-10 animate-fade-in">
				<CardHeader className="space-y-1 pb-6 text-center">
					<div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
						A
					</div>
					<CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
					<CardDescription className="text-gray-500">Sign in to the Acme Corp admin dashboard</CardDescription>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mb-4">
							{error}
						</Alert>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email address</Label>
							<Input
								id="email"
								type="email"
								placeholder="alice@acme.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<Button type="submit" className="w-full h-10" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="mt-6 rounded-xl bg-gray-50 border border-gray-100 p-4 text-sm text-gray-500">
						<p className="font-semibold text-gray-700 mb-2.5">Demo accounts</p>
						<div className="flex flex-col gap-1.5">
							<span><code className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded-md font-mono">alice@acme.com</code> <span className="text-gray-400">admin</span></span>
							<span><code className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded-md font-mono">bob@acme.com</code> <span className="text-gray-400">developer</span></span>
							<span><code className="text-xs bg-white border border-gray-200 px-1.5 py-0.5 rounded-md font-mono">frank@acme.com</code> <span className="text-gray-400">product manager</span></span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
