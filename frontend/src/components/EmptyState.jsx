export function EmptyState({ icon, title, description, action }) {
	return (
		<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
			<div className="mb-4 flex size-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
				{icon}
			</div>
			<h3 className="text-lg font-semibold text-slate-950">{title}</h3>
			<p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
			{action ? <div className="mt-6">{action}</div> : null}
		</div>
	);
}
