import { useCallback, useEffect, useState } from "react";

export function useAsyncData(
	load,
	initialValue,
	onErrorMessage = "Failed to load data",
) {
	const [data, setData] = useState(initialValue);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const reload = useCallback(async () => {
		setLoading(true);
		try {
			const nextData = await load();
			setData(nextData);
			setError("");
			return nextData;
		} catch {
			setError(onErrorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	}, [load, onErrorMessage]);

	useEffect(() => {
		reload();
	}, [reload]);

	return { data, error, loading, reload, setData, setError };
}
