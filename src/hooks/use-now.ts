import { useEffect, useState } from 'react';

/**
 * Devuelve la fecha actual y la refresca cada `intervalMs`.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
