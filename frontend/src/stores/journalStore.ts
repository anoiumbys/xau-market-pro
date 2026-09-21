import { create } from 'zustand';
import { journalApi } from '@api';
import type { TradeJournal, TradeStats, TradeDirection, TradeStatus, PaginatedResponse, TradeJournalCreateForm, TradeJournalUpdateForm } from '@types';

interface JournalState {
  trades: TradeJournal[];
  stats: TradeStats | null;
  currentTrade: TradeJournal | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
  filters: {
    status?: TradeStatus;
    symbol?: string;
    direction?: TradeDirection;
    from?: string;
    to?: string;
  };

  fetchTrades: (page?: number) => Promise<void>;
  fetchStats: (params?: { from?: string; to?: string }) => Promise<void>;
  createTrade: (data: TradeJournalCreateForm) => Promise<TradeJournal>;
  updateTrade: (id: string, data: TradeJournalUpdateForm) => Promise<TradeJournal>;
  deleteTrade: (id: string) => Promise<void>;
  closeTrade: (id: string, exitPrice: number) => Promise<TradeJournal>;
  setFilters: (filters: Partial<JournalState['filters']>) => void;
  clearFilters: () => void;
  clearError: () => void;
  setCurrentTrade: (trade: TradeJournal | null) => void;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  trades: [],
  stats: null,
  currentTrade: null,
  isLoading: false,
  error: null,
  pagination: null,
  filters: {},

  fetchTrades: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const params = { page, per_page: 20, ...get().filters };
      const response = await journalApi.list(params);
      set({
        trades: page === 1 ? response.data : [...get().trades, ...response.data],
        pagination: {
          current_page: response.meta.current_page,
          last_page: response.meta.last_page,
          per_page: response.meta.per_page,
          total: response.meta.total,
        },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchStats: async (params) => {
    try {
      const data = await journalApi.stats(params);
      set({ stats: data });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  },

  createTrade: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const trade = await journalApi.create(data);
      set((state) => ({
        trades: [trade, ...state.trades],
        isLoading: false,
      }));
      return trade;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateTrade: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const trade = await journalApi.update(id, data);
      set((state) => ({
        trades: state.trades.map((t) => (t.id === id ? trade : t)),
        currentTrade: state.currentTrade?.id === id ? trade : state.currentTrade,
        isLoading: false,
      }));
      return trade;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteTrade: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await journalApi.delete(id);
      set((state) => ({
        trades: state.trades.filter((t) => t.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  closeTrade: async (id, exitPrice) => {
    set({ isLoading: true, error: null });
    try {
      const trade = await journalApi.close(id, exitPrice);
      set((state) => ({
        trades: state.trades.map((t) => (t.id === id ? trade : t)),
        currentTrade: state.currentTrade?.id === id ? trade : state.currentTrade,
        isLoading: false,
      }));
      return trade;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      trades: [],
      pagination: null,
    }));
    get().fetchTrades(1);
  },

  clearFilters: () => {
    set({ filters: {}, trades: [], pagination: null });
    get().fetchTrades(1);
  },

  clearError: () => set({ error: null }),

  setCurrentTrade: (trade) => set({ currentTrade: trade }),
}));

export const selectTrades = (state: JournalState) => state.trades;
export const selectStats = (state: JournalState) => state.stats;
export const selectJournalLoading = (state: JournalState) => state.isLoading;
export const selectJournalError = (state: JournalState) => state.error;
export const selectPagination = (state: JournalState) => state.pagination;
export const selectFilters = (state: JournalState) => state.filters;