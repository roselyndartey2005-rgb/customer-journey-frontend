import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { CrossJourneyAnalyticsResponse } from '../types';

export function useAnalyticsOverview() {
  return useQuery<CrossJourneyAnalyticsResponse>({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const { data } = await api.get('/api/analytics/overview');
      return data;
    },
  });
}
