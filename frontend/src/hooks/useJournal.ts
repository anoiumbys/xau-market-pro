import {
  useJournalStore,
  selectTrades,
  selectStats,
  selectJournalLoading,
  selectJournalError,
  selectPagination,
  selectFilters,
} from '@stores/journalStore';

export function useTrades() {
  return useJournalStore(selectTrades);
}

export function useTradeStats() {
  return useJournalStore(selectStats);
}

export function useJournalLoading() {
  return useJournalStore(selectJournalLoading);
}

export function useJournalError() {
  return useJournalStore(selectJournalError);
}

export function usePagination() {
  return useJournalStore(selectPagination);
}

export function useJournalFilters() {
  return useJournalStore(selectFilters);
}

export function useJournalActions() {
  const fetchTrades = useJournalStore((state) => state.fetchTrades);
  const fetchStats = useJournalStore((state) => state.fetchStats);
  const createTrade = useJournalStore((state) => state.createTrade);
  const updateTrade = useJournalStore((state) => state.updateTrade);
  const deleteTrade = useJournalStore((state) => state.deleteTrade);
  const closeTrade = useJournalStore((state) => state.closeTrade);
  const setFilters = useJournalStore((state) => state.setFilters);
  const clearFilters = useJournalStore((state) => state.clearFilters);
  const clearError = useJournalStore((state) => state.clearError);
  const setCurrentTrade = useJournalStore((state) => state.setCurrentTrade);

  return {
    fetchTrades,
    fetchStats,
    createTrade,
    updateTrade,
    deleteTrade,
    closeTrade,
    setFilters,
    clearFilters,
    clearError,
    setCurrentTrade,
  };
}
