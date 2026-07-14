import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
	return (
		<div
			className={cn(
				"rounded-xl border border-zinc-800 bg-zinc-950 shadow-sm shadow-black/20",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }) {
	return (
		<div
			className={cn(
				"flex flex-col gap-1.5 border-b border-zinc-900 px-6 py-5",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }) {
	return (
		<h3
			className={cn(
				"text-base font-semibold tracking-tight text-zinc-50",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }) {
	return <p className={cn("text-sm text-zinc-400", className)} {...props} />;
}

function CardContent({ className, ...props }) {
	return <div className={cn("px-6 py-5", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
