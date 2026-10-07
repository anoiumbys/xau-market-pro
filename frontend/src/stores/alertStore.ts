import { create } from 'zustand';
import { alertApi } from '@api';
import type { PriceAlert, PriceAlertCreateForm } from '@types';

interface AlertState {
  alerts: PriceAlert[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;

  fetchAlerts: () => Promise<void>;
  createAlert: (data: PriceAlertCreateForm) => Promise<PriceAlert>;
  deleteAlert: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  isLoading: false,
  error: null,
  pagination: null,

  fetchAlerts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await alertApi.list();
      set({ alerts: response.data, pagination: response.meta, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  createAlert: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const alert = await alertApi.create(data);
      set((state) => ({
        alerts: [alert, ...state.alerts],
        isLoading: false,
      }));
      return alert;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteAlert: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await alertApi.delete(id);
      set((state) => ({
        alerts: state.alerts.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export const selectAlerts = (state: AlertState) => state.alerts;
export const selectAlertLoading = (state: AlertState) => state.isLoading;
export const selectAlertError = (state: AlertState) => state.error;
export const selectPendingAlerts = (state: AlertState) =>
  state.alerts.filter((a) => !a.is_triggered);
export const selectTriggeredAlerts = (state: AlertState) =>
  state.alerts.filter((a) => a.is_triggered);
