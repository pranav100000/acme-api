import { useCallback, useEffect, useState } from 'react';

export default function useAsyncData(loader, { errorMessage = 'Failed to load data', initialValue = null } = {}) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loader();
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loader, errorMessage]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return {
    data,
    setData,
    loading,
    error,
    setError,
    reload: load,
  };
}
