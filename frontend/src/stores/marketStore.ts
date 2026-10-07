import { create } from 'zustand';
import type { Market, MarketData, MarketParameter } from '@types';
import { marketApi } from '@api';

interface MarketState {
  currentMarket: MarketData | null;
  markets: Market[];
  parameters: MarketParameter | null;
  isLoading: boolean;
  error: string | null;
  priceHistory: Map<string, { price: number; timestamp: number }[]>;

  fetchMarket: (symbol: string) => Promise<void>;
  fetchParameters: (symbol: string) => Promise<void>;
  updatePrice: (symbol: string, price: number, change24h: number, changePct24h: number) => void;
  clearError: () => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  currentMarket: null,
  markets: [],
  parameters: null,
  isLoading: false,
  error: null,
  priceHistory: new Map(),

  fetchMarket: async (symbol: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await marketApi.getMarket(symbol);
      set({ currentMarket: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  fetchParameters: async (symbol: string) => {
    try {
      const data = await marketApi.getParameters(symbol);
      set({ parameters: data });
    } catch (error) {
      console.error('Failed to fetch market parameters:', error);
    }
  },

  updatePrice: (symbol: string, price: number, change24h: number, changePct24h: number) => {
    set((state) => {
      const newHistory = new Map(state.priceHistory);
      const history = newHistory.get(symbol) || [];
      history.push({ price, timestamp: Date.now() });
      // Keep last 1000 points
      if (history.length > 1000) history.shift();
      newHistory.set(symbol, history);

      return {
        currentMarket:
          state.currentMarket?.symbol === symbol
            ? {
                ...state.currentMarket,
                spot_price: price,
                change_24h: change24h,
                change_pct_24h: changePct24h,
              }
            : state.currentMarket,
        priceHistory: newHistory,
      };
    });
  },

  clearError: () => set({ error: null }),
}));

export const selectCurrentMarket = (state: MarketState) => state.currentMarket;
export const selectMarkets = (state: MarketState) => state.markets;
export const selectParameters = (state: MarketState) => state.parameters;
export const selectMarketLoading = (state: MarketState) => state.isLoading;
export const selectMarketError = (state: MarketState) => state.error;
