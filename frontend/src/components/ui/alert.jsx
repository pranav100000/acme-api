import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva("rounded-lg border px-4 py-3 text-sm", {
	variants: {
		variant: {
			default: "border-slate-200 bg-white text-slate-700",
			destructive: "border-rose-200 bg-rose-50 text-rose-700",
			success: "border-emerald-200 bg-emerald-50 text-emerald-700",
		},
	},
	defaultVariants: { variant: "default" },
});

function Alert({ className, variant, ...props }) {
	return (
		<div
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	);
}

function AlertTitle({ className, ...props }) {
	return <h5 className={cn("mb-1 font-medium", className)} {...props} />;
}

function AlertDescription({ className, ...props }) {
	return <div className={cn("text-sm", className)} {...props} />;
}

export { Alert, AlertDescription, AlertTitle };
