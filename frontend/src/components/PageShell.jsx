import { cn } from "../lib/utils";

export function PageShell({ title, description, action, children }) {
	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
				<div className="space-y-1">
					<h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
					{description ? <p className="text-sm text-slate-500">{description}</p> : null}
				</div>
				{action ? <div className="flex items-center gap-3">{action}</div> : null}
			</div>
			<div className={cn("space-y-6")}>{children}</div>
		</div>
	);
}
