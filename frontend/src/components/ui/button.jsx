import { cva } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
				secondary:
					"border border-slate-200 bg-white text-slate-900 shadow-sm hover:bg-slate-50",
				destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
				outline:
					"border border-slate-200 bg-transparent text-slate-900 hover:bg-slate-100",
				ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "size-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export function Button({ className, variant, size, asChild = false, ...props }) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			className={cn(buttonVariants({ variant, size }), className)}
			{...props}
		/>
	);
}
