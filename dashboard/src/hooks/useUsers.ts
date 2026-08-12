import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { UserResponse, UserUpdateRequest } from '../types';

export function useUsers() {
  return useQuery<UserResponse[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/api/admin/users');
      return data;
    },
  });
}

export function useUser(userId: number | undefined) {
  return useQuery<UserResponse>({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await api.get(`/api/admin/users/${userId}`);
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, payload }: { userId: number; payload: UserUpdateRequest }) => {
      const { data } = await api.put(`/api/admin/users/${userId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      await api.delete(`/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
