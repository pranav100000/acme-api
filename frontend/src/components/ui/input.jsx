import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
	return (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-sm shadow-sm transition-all duration-150 placeholder:text-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
