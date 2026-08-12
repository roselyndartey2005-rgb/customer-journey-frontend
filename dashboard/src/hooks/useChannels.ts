import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { ChannelResponse, ChannelCreateRequest, ChannelUpdateRequest } from '../types';

export function useChannels() {
  return useQuery<ChannelResponse[]>({
    queryKey: ['channels'],
    queryFn: async () => {
      const { data } = await api.get('/api/channels');
      return data;
    },
  });
}

export function useChannel(channelId: number | undefined) {
  return useQuery<ChannelResponse>({
    queryKey: ['channel', channelId],
    queryFn: async () => {
      const { data } = await api.get(`/api/channels/${channelId}`);
      return data;
    },
    enabled: !!channelId,
  });
}

export function useCreateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ChannelCreateRequest) => {
      const { data } = await api.post('/api/channels', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}

export function useUpdateChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ channelId, payload }: { channelId: number; payload: ChannelUpdateRequest }) => {
      const { data } = await api.put(`/api/channels/${channelId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}

export function useDeleteChannel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (channelId: number) => {
      await api.delete(`/api/channels/${channelId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['channels'] });
    },
  });
}
