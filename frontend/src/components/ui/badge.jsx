import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
	{
		variants: {
			variant: {
				default: "bg-indigo-100 text-indigo-800",
				active: "bg-green-100 text-green-800",
				inactive: "bg-red-100 text-red-800",
				pending: "bg-yellow-100 text-yellow-800",
				admin: "bg-violet-100 text-violet-800",
				developer: "bg-blue-100 text-blue-800",
				designer: "bg-pink-100 text-pink-800",
				product_manager: "bg-orange-100 text-orange-800",
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
