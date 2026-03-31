import { cn } from "@/lib/utils";

function Avatar({ className, ...props }) {
	return (
		<div
			className={cn(
				"relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

function AvatarFallback({ className, ...props }) {
	return (
		<div
			className={cn(
				"flex h-full w-full items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-semibold",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarFallback };
