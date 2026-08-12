import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerInfo } from '../types';

interface CustomerState {
  customer: CustomerInfo | null;
  setCustomer: (customer: CustomerInfo) => void;
  clearCustomer: () => void;
  isLoggedIn: () => boolean;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      customer: null,

      setCustomer: (customer: CustomerInfo) => set({ customer }),

      clearCustomer: () => set({ customer: null }),

      isLoggedIn: () => get().customer !== null && get().customer!.customerId !== null,
    }),
    { name: 'customer-storage' }
  )
);
