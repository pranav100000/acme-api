import { cn } from "../../lib/utils";

export function Avatar({ className, children, ...props }) {
	return (
		<div
			className={cn(
				"flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
