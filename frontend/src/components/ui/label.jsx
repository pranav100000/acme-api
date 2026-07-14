import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../../lib/utils";

function Label({ className, ...props }) {
	return (
		<LabelPrimitive.Root
			className={cn(
				"text-sm font-medium leading-none text-zinc-300",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
