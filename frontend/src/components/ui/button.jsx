import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
	{
		variants: {
			variant: {
				default:
					"bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/25 hover:from-indigo-600 hover:to-indigo-700 active:from-indigo-700 active:to-indigo-800",
				destructive:
					"bg-gradient-to-b from-red-500 to-red-600 text-white shadow-sm shadow-red-500/25 hover:from-red-600 hover:to-red-700",
				outline:
					"border border-gray-200 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-300 text-gray-700",
				secondary:
					"bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200",
				ghost: "hover:bg-gray-100 text-gray-700",
				link: "text-indigo-600 underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-lg px-3 text-xs",
				lg: "h-11 rounded-lg px-8 text-base",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({ className, variant, size, asChild = false, ...props }) {
	const Comp = asChild ? Slot : "button";
	return (
		<Comp
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
