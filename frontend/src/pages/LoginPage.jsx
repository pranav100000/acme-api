import { ArrowRight, Building2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../App";
import * as api from "../api";
import { Alert } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-950">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.18),_transparent_25%)]" />
			<Card className="relative w-full max-w-5xl overflow-hidden border-white/10 bg-white/95 shadow-2xl backdrop-blur">
				<CardContent className="grid gap-0 p-0 lg:grid-cols-[1.05fr_0.95fr]">
					<div className="hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
						<div>
							<div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-violet-200 ring-1 ring-inset ring-white/10">
								<Building2 className="size-6" />
							</div>
							<h1 className="mt-8 text-4xl font-semibold tracking-tight">Operate every team from one command center.</h1>
							<p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
								A refreshed shadcn-inspired admin experience for keeping users, roles, and team membership aligned.
							</p>
						</div>
						<div className="rounded-2xl border border-white/10 bg-white/5 p-5">
							<p className="text-sm font-medium text-white">Demo accounts</p>
							<div className="mt-4 space-y-3 text-sm text-slate-300">
								{demoAccounts.map((account) => (
									<div key={account.email} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
										<code className="font-mono text-xs text-white">{account.email}</code>
										<span className="capitalize text-slate-400">{account.role}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="p-8 sm:p-10 lg:p-12">
						<div className="mx-auto flex max-w-md flex-col justify-center">
							<div className="mb-8 space-y-2">
								<p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600">Acme Corp</p>
								<h2 className="text-3xl font-semibold tracking-tight">Sign in to the admin dashboard</h2>
								<p className="text-sm text-slate-500">Use any seeded team member email to explore the workspace.</p>
							</div>

							{error ? <Alert variant="destructive" className="mb-6">{error}</Alert> : null}

							<form className="space-y-5" onSubmit={handleSubmit}>
								<div className="space-y-2">
									<label className="text-sm font-medium text-slate-700" htmlFor="email">Email address</label>
									<Input
										id="email"
										type="email"
										placeholder="alice@acme.com"
										value={email}
										onChange={(event) => setEmail(event.target.value)}
										required
									/>
								</div>

								<Button type="submit" className="w-full" disabled={loading}>
									{loading ? "Signing in..." : "Sign in"}
									{loading ? null : <ArrowRight className="size-4" />}
								</Button>
							</form>

							<div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:hidden">
								<p className="text-sm font-medium text-slate-900">Demo accounts</p>
								<div className="mt-3 space-y-2 text-sm text-slate-500">
									{demoAccounts.map((account) => (
										<div key={account.email} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
											<code className="font-mono text-xs text-slate-900">{account.email}</code>
											<span className="capitalize">{account.role}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
