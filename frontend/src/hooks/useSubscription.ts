import { useSubscriptionStore, selectSubscription, selectSubscriptionLoading, selectSubscriptionError, selectHasActiveSubscription, selectSubscriptionPlan, selectSubscriptionLimits } from '@stores/subscriptionStore';

export function useSubscription() {
  return useSubscriptionStore(selectSubscription);
}

export function useHasSubscription() {
  return useSubscriptionStore(selectHasActiveSubscription);
}

export function useSubscriptionPlan() {
  return useSubscriptionStore(selectSubscriptionPlan);
}

export function useSubscriptionLimits() {
  return useSubscriptionStore(selectSubscriptionLimits);
}

export function useSubscriptionLoading() {
  return useSubscriptionStore(selectSubscriptionLoading);
}

export function useSubscriptionError() {
  return useSubscriptionStore(selectSubscriptionError);
}

export function useSubscriptionActions() {
  const fetchSubscription = useSubscriptionStore((state) => state.fetchSubscription);
  const subscribe = useSubscriptionStore((state) => state.subscribe);
  const clearError = useSubscriptionStore((state) => state.clearError);

  return { fetchSubscription, subscribe, clearError };
}