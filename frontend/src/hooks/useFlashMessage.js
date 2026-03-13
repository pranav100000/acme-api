import { useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_DURATION = 3000;

export function useFlashMessage(duration = DEFAULT_DURATION) {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef(null);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setMessage('');
  }, []);

  const show = useCallback(
    (value) => {
      clear();
      setMessage(value);
      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = null;
        setMessage('');
      }, duration);
    },
    [clear, duration]
  );

  useEffect(() => clear, [clear]);

  return { message, show, clear };
}
