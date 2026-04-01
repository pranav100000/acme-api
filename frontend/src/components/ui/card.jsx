import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
	return (
		<div
			className={cn(
				"rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}

export function CardHeader({ className, ...props }) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 border-b border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
			{...props}
		/>
	);
}

export function CardTitle({ className, ...props }) {
	return (
		<h3
			className={cn("text-base font-semibold tracking-tight text-slate-950", className)}
			{...props}
		/>
	);
}

export function CardDescription({ className, ...props }) {
	return (
		<p className={cn("text-sm text-slate-500", className)} {...props} />
	);
}

export function CardContent({ className, ...props }) {
	return <div className={cn("p-6", className)} {...props} />;
}
