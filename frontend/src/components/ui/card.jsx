import { cn } from "../../lib/utils";

function Card({ className, ...props }) {
	return (
		<div
			className={cn(
				"rounded-xl border border-slate-200 bg-white shadow-sm",
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
				"flex flex-col gap-1.5 border-b border-slate-100 px-6 py-5",
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
				"text-base font-semibold tracking-tight text-slate-950",
				className,
			)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }) {
	return <p className={cn("text-sm text-slate-500", className)} {...props} />;
}

function CardContent({ className, ...props }) {
	return <div className={cn("px-6 py-5", className)} {...props} />;
}

export { Card, CardContent, CardDescription, CardHeader, CardTitle };
