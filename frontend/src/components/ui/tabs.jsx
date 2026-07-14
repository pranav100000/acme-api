import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

function Tabs({ className, ...props }) {
	return (
		<TabsPrimitive.Root
			className={cn("flex flex-col gap-4", className)}
			{...props}
		/>
	);
}
function TabsList({ className, ...props }) {
	return (
		<TabsPrimitive.List
			className={cn(
				"inline-flex h-10 items-center justify-center rounded-lg bg-black p-1 text-zinc-500",
				className,
			)}
			{...props}
		/>
	);
}
function TabsTrigger({ className, ...props }) {
	return (
		<TabsPrimitive.Trigger
			className={cn(
				"inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 data-[state=active]:shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}
function TabsContent({ className, ...props }) {
	return (
		<TabsPrimitive.Content
			className={cn("outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
