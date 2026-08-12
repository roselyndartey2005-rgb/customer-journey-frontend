import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { CustomerResponse, CustomerUpdateRequest } from '../types';

export function useCustomers() {
  return useQuery<CustomerResponse[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data } = await api.get('/api/customers');
      return data;
    },
  });
}

export function useCustomer(customerId: number | undefined) {
  return useQuery<CustomerResponse>({
    queryKey: ['customer', customerId],
    queryFn: async () => {
      const { data } = await api.get(`/api/customers/${customerId}`);
      return data;
    },
    enabled: !!customerId,
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ customerId, payload }: { customerId: number; payload: CustomerUpdateRequest }) => {
      const { data } = await api.put(`/api/customers/${customerId}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}
