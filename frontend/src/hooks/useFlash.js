import { useCallback, useState } from "react";

export function useFlash(duration = 3000) {
	const [value, setValue] = useState("");
	const show = useCallback(
		(msg) => {
			setValue(msg);
			setTimeout(() => setValue(""), duration);
		},
		[duration],
	);
	return [value, show];
}
