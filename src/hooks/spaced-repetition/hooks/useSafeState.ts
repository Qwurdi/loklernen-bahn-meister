
import { useState, useCallback, useRef } from 'react';

/**
 * Hook for safe state updates that prevents memory leaks
 * when the component is unmounted
 */
export function useSafeState<T>(initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const isMounted = useRef(true);

  // Clean up function to set isMounted to false when component unmounts
  const cleanup = useCallback(() => {
    isMounted.current = false;
  }, []);

  // Safe setState that only updates state if component is still mounted
  const safeSetState = useCallback((value: T | ((prev: T) => T)) => {
    if (isMounted.current) {
      setState(value);
    }
  }, []);

  return {
    state,
    safeSetState,
    cleanup
  };
}
