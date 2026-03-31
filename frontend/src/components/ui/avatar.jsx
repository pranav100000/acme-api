import { cn } from "../../lib/utils";

function Avatar({ className, ...props }) {
	return (
		<div
			className={cn(
				"flex size-10 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar };
