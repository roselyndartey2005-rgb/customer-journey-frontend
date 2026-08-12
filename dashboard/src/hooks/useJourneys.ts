import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type {
  JourneyResponse,
  JourneyMapResponse,
  TouchpointSummaryResponse,
  ConversionFunnelResponse,
  RawEventResponse,
  JourneyStageResponse,
  JourneyCreateRequest,
  JourneyUpdateRequest,
  TouchpointCreateRequest,
  JourneyStageCreateRequest,
  JourneyStageUpdateRequest,
} from '../types';

export function useJourneys() {
  return useQuery<JourneyResponse[]>({
    queryKey: ['journeys'],
    queryFn: async () => {
      const { data } = await api.get('/api/journeys');
      return data;
    },
  });
}

export function useJourneyMap(journeyId: number | undefined) {
  return useQuery<JourneyMapResponse>({
    queryKey: ['journeyMap', journeyId],
    queryFn: async () => {
      const { data } = await api.get(`/api/journeys/${journeyId}/map`);
      return data;
    },
    enabled: !!journeyId,
  });
}

export function useTouchpointSummary(journeyId: number | undefined) {
  return useQuery<TouchpointSummaryResponse>({
    queryKey: ['touchpointSummary', journeyId],
    queryFn: async () => {
      const { data } = await api.get(`/api/journeys/${journeyId}/touchpoint-summary`);
      return data;
    },
    enabled: !!journeyId,
  });
}

export function useConversionFunnel(journeyId: number | undefined) {
  return useQuery<ConversionFunnelResponse>({
    queryKey: ['conversionFunnel', journeyId],
    queryFn: async () => {
      const { data } = await api.get(`/api/journeys/${journeyId}/conversion-funnel`);
      return data;
    },
    enabled: !!journeyId,
  });
}

export function useRawEvents(journeyId: number | undefined) {
  return useQuery<RawEventResponse[]>({
    queryKey: ['rawEvents', journeyId],
    queryFn: async () => {
      const { data } = await api.get(`/api/journeys/${journeyId}/raw-events`);
      return data;
    },
    enabled: !!journeyId,
  });
}

export function useCustomerJourneys(customerId: number | undefined) {
  return useQuery<JourneyResponse[]>({
    queryKey: ['customerJourneys', customerId],
    queryFn: async () => {
      const { data } = await api.get(`/api/journeys/customer/${customerId}`);
      return data;
    },
    enabled: !!customerId,
  });
}

export function useJourneyStages() {
  return useQuery<JourneyStageResponse[]>({
    queryKey: ['journeyStages'],
    queryFn: async () => {
      const { data } = await api.get('/api/journey-stages');
      return data;
    },
  });
}

export function useCreateJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: JourneyCreateRequest) => {
      const { data } = await api.post('/api/journeys', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });
}

export function useUpdateJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ journeyId, payload }: { journeyId: number; payload: JourneyUpdateRequest }) => {
      const { data } = await api.put(`/api/journeys/${journeyId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });
}

export function useDeleteJourney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (journeyId: number) => {
      await api.delete(`/api/journeys/${journeyId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
    },
  });
}

export function useCreateTouchpoint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ journeyId, payload }: { journeyId: number; payload: TouchpointCreateRequest }) => {
      const { data } = await api.post(`/api/journeys/${journeyId}/touchpoints`, payload);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['journeyMap', variables.journeyId] });
      queryClient.invalidateQueries({ queryKey: ['touchpointSummary', variables.journeyId] });
    },
  });
}

// Admin - Stage Management
export function useCreateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: JourneyStageCreateRequest) => {
      const { data } = await api.post('/api/admin/journey-stages', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeyStages'] });
    },
  });
}

export function useUpdateStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ stageId, payload }: { stageId: number; payload: JourneyStageUpdateRequest }) => {
      const { data } = await api.put(`/api/admin/journey-stages/${stageId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeyStages'] });
    },
  });
}

export function useDeleteStage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (stageId: number) => {
      await api.delete(`/api/admin/journey-stages/${stageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journeyStages'] });
    },
  });
}
