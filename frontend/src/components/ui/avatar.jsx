import { cn } from "../../lib/utils";

function Avatar({ className, ...props }) {
	return (
		<div
			className={cn(
				"flex size-10 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-950",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar };
