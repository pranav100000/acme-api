import { useCallback, useRef, useState } from "react";

export function useFlashMessage(duration = 3000) {
	const timeoutRef = useRef(null);
	const [message, setMessage] = useState("");

	const clearMessage = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setMessage("");
	}, []);

	const showMessage = useCallback(
		(value) => {
			clearMessage();
			setMessage(value);
			timeoutRef.current = window.setTimeout(clearMessage, duration);
		},
		[clearMessage, duration],
	);

	return { clearMessage, message, showMessage };
}
