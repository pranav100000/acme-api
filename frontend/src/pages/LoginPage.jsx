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
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
			<Card className="w-full max-w-md shadow-2xl">
				<CardHeader className="space-y-1 pb-4">
					<CardTitle className="text-2xl font-bold">Acme Corp</CardTitle>
					<CardDescription>Sign in to the admin dashboard</CardDescription>
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
						<Button type="submit" className="w-full" disabled={loading}>
							{loading ? "Signing in..." : "Sign in"}
						</Button>
					</form>

					<div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
						<p className="font-semibold text-gray-700 mb-2">Demo accounts:</p>
						<div className="flex flex-col gap-1">
							<span><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">alice@acme.com</code> (admin)</span>
							<span><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">bob@acme.com</code> (developer)</span>
							<span><code className="text-xs bg-gray-100 px-1 py-0.5 rounded">frank@acme.com</code> (product manager)</span>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
