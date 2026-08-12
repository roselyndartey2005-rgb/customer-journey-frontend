import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../lib/tracker';

export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    track('PAGE_VIEW', {
      path: location.pathname,
      search: location.search,
    });
  }, [location.pathname, location.search]);
}
