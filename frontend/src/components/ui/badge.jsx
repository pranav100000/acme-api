import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors",
	{
		variants: {
			variant: {
				default: "border-transparent bg-slate-900 text-white",
				secondary: "border-transparent bg-slate-100 text-slate-700",
				success: "border-emerald-200 bg-emerald-50 text-emerald-700",
				warning: "border-amber-200 bg-amber-50 text-amber-700",
				danger: "border-rose-200 bg-rose-50 text-rose-700",
				info: "border-indigo-200 bg-indigo-50 text-indigo-700",
				pink: "border-pink-200 bg-pink-50 text-pink-700",
				orange: "border-orange-200 bg-orange-50 text-orange-700",
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
