'use client';

import { useCallback } from 'react';

type RouterOptions = {
  scroll?: boolean;
};

export function useRouter() {
  const push = useCallback((href: string, options?: RouterOptions) => {
    window.history.pushState({}, '', href);
    if (options?.scroll !== false) {
      window.scrollTo(0, 0);
    }
  }, []);

  const replace = useCallback((href: string, options?: RouterOptions) => {
    window.history.replaceState({}, '', href);
    if (options?.scroll !== false) {
      window.scrollTo(0, 0);
    }
  }, []);

  const back = useCallback(() => {
    window.history.back();
  }, []);

  const forward = useCallback(() => {
    window.history.forward();
  }, []);

  const refresh = useCallback(() => {
    window.location.reload();
  }, []);

  const prefetch = useCallback((href: string) => {
    // No-op in this implementation
    console.log('Prefetching:', href);
  }, []);

  return {
    push,
    replace,
    back,
    forward,
    refresh,
    prefetch,
  };
}
