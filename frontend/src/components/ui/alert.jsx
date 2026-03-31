import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border px-4 py-3 text-sm",
	{
		variants: {
			variant: {
				default: "bg-white text-gray-900 border-gray-200",
				destructive:
					"border-red-200 bg-red-50 text-red-800",
				success:
					"border-green-200 bg-green-50 text-green-800",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function Alert({ className, variant, ...props }) {
	return (
		<div
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Alert, alertVariants };
