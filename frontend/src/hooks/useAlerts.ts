import {
  useAlertStore,
  selectAlerts,
  selectAlertLoading,
  selectAlertError,
  selectPendingAlerts,
  selectTriggeredAlerts,
} from '@stores/alertStore';

export function useAlerts() {
  return useAlertStore(selectAlerts);
}

export function usePendingAlerts() {
  return useAlertStore(selectPendingAlerts);
}

export function useTriggeredAlerts() {
  return useAlertStore(selectTriggeredAlerts);
}

export function useAlertLoading() {
  return useAlertStore(selectAlertLoading);
}

export function useAlertError() {
  return useAlertStore(selectAlertError);
}

export function useAlertActions() {
  const fetchAlerts = useAlertStore((state) => state.fetchAlerts);
  const createAlert = useAlertStore((state) => state.createAlert);
  const deleteAlert = useAlertStore((state) => state.deleteAlert);
  const clearError = useAlertStore((state) => state.clearError);

  return { fetchAlerts, createAlert, deleteAlert, clearError };
}
