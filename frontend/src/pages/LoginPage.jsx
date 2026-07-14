import { ArrowRight, Building2, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../App";
import * as api from "../api";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const accounts = [
	["alice@acme.com", "Admin"],
	["bob@acme.com", "Developer"],
	["frank@acme.com", "Product Manager"],
];

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
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_28%),linear-gradient(180deg,#000_0%,#09090b_45%,#18181b_100%)]" />
			<div className="relative grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
				<div className="hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/80 p-10 text-zinc-100 shadow-2xl shadow-black/30 backdrop-blur lg:flex lg:flex-col lg:justify-between">
					<div>
						<div className="flex size-14 items-center justify-center rounded-2xl bg-zinc-900 ring-1 ring-inset ring-zinc-700">
							<Building2 className="size-6" />
						</div>
						<h1 className="mt-8 max-w-md text-4xl font-semibold tracking-tight">
							A cleaner admin experience powered by shadcn-inspired UI
							primitives.
						</h1>
						<p className="mt-4 max-w-lg text-base text-zinc-300">
							Manage users, teams, and health status from a polished workspace
							built for demos and day-to-day operations.
						</p>
					</div>
					<div className="grid gap-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-zinc-800 bg-black/60 p-5">
							<Sparkles className="size-5 text-zinc-200" />
							<p className="mt-3 font-medium">Modernized UI kit</p>
							<p className="mt-1 text-sm text-zinc-400">
								Cards, dialogs, badges, and tables now share a consistent design
								language.
							</p>
						</div>
						<div className="rounded-2xl border border-zinc-800 bg-black/60 p-5">
							<ShieldCheck className="size-5 text-zinc-200" />
							<p className="mt-3 font-medium">Fast demo login</p>
							<p className="mt-1 text-sm text-zinc-400">
								Use one of the seeded accounts to explore users, teams, and API
								status instantly.
							</p>
						</div>
					</div>
				</div>

				<Card className="relative overflow-hidden border-zinc-800 bg-zinc-950/95 shadow-2xl shadow-black/40 backdrop-blur">
					<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-zinc-700 via-zinc-500 to-zinc-700" />
					<CardHeader className="border-b-0 px-8 pt-8">
						<div className="flex items-center gap-3">
							<div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-950 shadow-lg">
								<Building2 className="size-5" />
							</div>
							<div>
								<CardTitle className="text-3xl">Welcome back</CardTitle>
								<CardDescription>
									Sign in to the Acme Corp admin dashboard
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6 px-8 pb-8 pt-2">
						{error ? (
							<Alert variant="destructive">
								<AlertTitle>Sign-in failed</AlertTitle>
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						) : null}

						<form onSubmit={handleSubmit} className="space-y-5">
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
							<Button
								type="submit"
								className="w-full justify-center"
								disabled={loading}
							>
								{loading ? "Signing in..." : "Sign in"}
								<ArrowRight className="size-4" />
							</Button>
						</form>

						<div className="rounded-2xl border border-zinc-800 bg-black/60 p-5">
							<p className="text-sm font-medium text-zinc-100">Demo accounts</p>
							<div className="mt-4 space-y-3">
								{accounts.map(([accountEmail, role]) => (
									<button
										key={accountEmail}
										type="button"
										className="flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left transition hover:border-zinc-700 hover:bg-zinc-900"
										onClick={() => setEmail(accountEmail)}
									>
										<div>
											<p className="font-medium text-zinc-100">
												{accountEmail}
											</p>
											<p className="text-sm text-zinc-400">{role}</p>
										</div>
										<ArrowRight className="size-4 text-zinc-500" />
									</button>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
