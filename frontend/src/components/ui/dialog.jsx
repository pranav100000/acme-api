import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({ className, ...props }) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm",
				className,
			)}
			{...props}
		/>
	);
}

function DialogContent({ className, children, ...props }) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogPrimitive.Content
				className={cn(
					"fixed left-1/2 top-1/2 z-50 grid w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl duration-200",
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm text-slate-400 transition-colors hover:text-slate-900 focus:outline-none">
					<X className="size-4" />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</DialogPortal>
	);
}

function DialogHeader({ className, ...props }) {
	return (
		<div
			className={cn("flex flex-col space-y-1.5 text-left", className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, ...props }) {
	return (
		<DialogPrimitive.Title
			className={cn("text-lg font-semibold text-slate-950", className)}
			{...props}
		/>
	);
}

function DialogDescription({ className, ...props }) {
	return (
		<DialogPrimitive.Description
			className={cn("text-sm text-slate-500", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
