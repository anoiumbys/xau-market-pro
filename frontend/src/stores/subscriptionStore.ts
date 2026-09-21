import { create } from 'zustand';
import { subscriptionApi } from '@api';
import type { Subscription, PlanType } from '@types';

interface SubscriptionState {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string | null;

  fetchSubscription: () => Promise<void>;
  subscribe: (planType: PlanType) => Promise<Subscription>;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  subscription: null,
  isLoading: false,
  error: null,

  fetchSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await subscriptionApi.getCurrent();
      set({ subscription: data, isLoading: false });
    } catch (error) {
      if ((error as Error & { status?: number }).status === 404) {
        set({ subscription: null, isLoading: false });
      } else {
        set({ error: (error as Error).message, isLoading: false });
      }
    }
  },

  subscribe: async (planType) => {
    set({ isLoading: true, error: null });
    try {
      const data = await subscriptionApi.subscribe({ plan_type: planType });
      set({ subscription: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const selectSubscription = (state: SubscriptionState) => state.subscription;
export const selectSubscriptionLoading = (state: SubscriptionState) => state.isLoading;
export const selectSubscriptionError = (state: SubscriptionState) => state.error;
export const selectHasActiveSubscription = (state: SubscriptionState) =>
  state.subscription?.is_active ?? false;
export const selectSubscriptionPlan = (state: SubscriptionState) =>
  state.subscription?.plan_type;
export const selectSubscriptionLimits = (state: SubscriptionState) =>
  state.subscription?.limits ?? { alerts: 0, exports: 0 };