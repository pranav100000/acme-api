import { cn } from "../../lib/utils";

function Table({ className, ...props }) {
	return (
		<div className="relative w-full overflow-auto">
			<table
				className={cn("w-full caption-bottom text-sm", className)}
				{...props}
			/>
		</div>
	);
}
function TableHeader({ className, ...props }) {
	return <thead className={cn("[&_tr]:border-b", className)} {...props} />;
}
function TableBody({ className, ...props }) {
	return (
		<tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
	);
}
function TableRow({ className, ...props }) {
	return (
		<tr
			className={cn(
				"border-b border-slate-100 transition-colors hover:bg-slate-50/80",
				className,
			)}
			{...props}
		/>
	);
}
function TableHead({ className, ...props }) {
	return (
		<th
			className={cn(
				"h-11 px-4 text-left align-middle text-xs font-semibold uppercase tracking-[0.2em] text-slate-500",
				className,
			)}
			{...props}
		/>
	);
}
function TableCell({ className, ...props }) {
	return (
		<td
			className={cn("p-4 align-middle text-slate-700", className)}
			{...props}
		/>
	);
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
