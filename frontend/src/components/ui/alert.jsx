import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva("rounded-lg border px-4 py-3 text-sm", {
	variants: {
		variant: {
			default: "border-slate-200 bg-white text-slate-700",
			success: "border-emerald-200 bg-emerald-50 text-emerald-700",
			destructive: "border-rose-200 bg-rose-50 text-rose-700",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export function Alert({ className, variant, ...props }) {
	return <div className={cn(alertVariants({ variant }), className)} role="alert" {...props} />;
}
