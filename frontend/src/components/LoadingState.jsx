export function LoadingState({ label = "Loading..." }) {
	return (
		<div className="flex min-h-[240px] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white shadow-sm">
			<div className="size-9 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
			<p className="text-sm text-slate-500">{label}</p>
		</div>
	);
}
