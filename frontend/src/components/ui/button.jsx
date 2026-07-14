import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-100/20 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0",
	{
		variants: {
			variant: {
				default: "bg-zinc-100 text-zinc-950 shadow-sm hover:bg-zinc-200",
				secondary:
					"border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-sm hover:bg-zinc-900",
				outline:
					"border border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900",
				ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
				destructive: "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-11 rounded-md px-6",
				icon: "size-9",
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
