import { cn } from "@/lib/utils";

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
				"border-b border-gray-100 transition-colors hover:bg-gray-50/50",
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
				"h-10 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wide text-gray-500 bg-gray-50 [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
}

function TableCell({ className, ...props }) {
	return (
		<td
			className={cn(
				"px-4 py-3 align-middle text-sm [&:has([role=checkbox])]:pr-0",
				className,
			)}
			{...props}
		/>
	);
}

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell };
