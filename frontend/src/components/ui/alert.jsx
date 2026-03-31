import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva("rounded-lg border px-4 py-3 text-sm", {
	variants: {
		variant: {
			default: "border-zinc-800 bg-zinc-950 text-zinc-200",
			destructive: "border-zinc-700 bg-black text-zinc-100",
			success: "border-zinc-800 bg-zinc-900 text-zinc-100",
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
