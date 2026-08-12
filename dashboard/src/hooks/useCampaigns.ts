import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { CampaignResponse, CampaignCreateRequest, CampaignUpdateRequest } from '../types';

export function useCampaigns() {
  return useQuery<CampaignResponse[]>({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const { data } = await api.get('/api/campaigns');
      return data;
    },
  });
}

export function useCampaign(campaignId: number | undefined) {
  return useQuery<CampaignResponse>({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const { data } = await api.get(`/api/campaigns/${campaignId}`);
      return data;
    },
    enabled: !!campaignId,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CampaignCreateRequest) => {
      const { data } = await api.post('/api/campaigns', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ campaignId, payload }: { campaignId: number; payload: CampaignUpdateRequest }) => {
      const { data } = await api.put(`/api/campaigns/${campaignId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (campaignId: number) => {
      await api.delete(`/api/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
}
