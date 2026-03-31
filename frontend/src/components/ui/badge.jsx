import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-zinc-100 text-zinc-950",
				secondary: "border-zinc-800 bg-zinc-900 text-zinc-200",
				success: "border-zinc-700 bg-zinc-800 text-zinc-100",
				warning: "border-zinc-700 bg-zinc-900 text-zinc-300",
				danger: "border-zinc-800 bg-black text-zinc-200",
				info: "border-zinc-700 bg-zinc-800 text-zinc-100",
				pink: "border-zinc-800 bg-zinc-900 text-zinc-300",
				orange: "border-zinc-800 bg-zinc-950 text-zinc-400",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<span className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
