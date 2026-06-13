import { useCallback, useEffect, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  status: Status;
  isLoading: boolean;
  /** Re-run the async function (e.g. from a "Retry" button). */
  reload: () => void;
}

/**
 * Minimal data-fetching hook: runs an async function, tracks loading/error/data,
 * and exposes `reload`. Cancels stale updates if the inputs change or the
 * component unmounts, preventing "set state on unmounted component" warnings.
 *
 * Deliberately small — for v2, swap to TanStack Query without touching callers'
 * mental model (data / isLoading / error / reload).
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setError(null);

    fn()
      .then((result) => {
        if (!active) return;
        setData(result);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setStatus('error');
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  return { data, error, status, isLoading: status === 'loading', reload };
}
