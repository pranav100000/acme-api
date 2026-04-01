import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
	if (typeof window === "undefined") {
		return false;
	}

	return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

export default function useIsMobile() {
	const [isMobile, setIsMobile] = useState(getIsMobile);

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

		const handleChange = (event) => {
			setIsMobile(event.matches);
		};

		setIsMobile(mediaQuery.matches);
		mediaQuery.addEventListener("change", handleChange);

		return () => {
			mediaQuery.removeEventListener("change", handleChange);
		};
	}, []);

	return isMobile;
}
