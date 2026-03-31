import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
	{
		variants: {
			variant: {
				default: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20",
				active: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
				inactive: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
				pending: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
				admin: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-600/20",
				developer: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
				designer: "bg-pink-50 text-pink-700 ring-1 ring-inset ring-pink-600/20",
				product_manager: "bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-600/20",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Badge({ className, variant, ...props }) {
	return (
		<span className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
