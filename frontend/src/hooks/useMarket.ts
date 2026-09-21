import { useMarketStore, selectCurrentMarket, selectMarkets, selectParameters, selectMarketLoading, selectMarketError } from '@stores/marketStore';

export function useMarket() {
  return useMarketStore(selectCurrentMarket);
}

export function useMarkets() {
  return useMarketStore(selectMarkets);
}

export function useMarketParameters() {
  return useMarketStore(selectParameters);
}

export function useMarketLoading() {
  return useMarketStore(selectMarketLoading);
}

export function useMarketError() {
  return useMarketStore(selectMarketError);
}

export function useMarketActions() {
  const fetchMarket = useMarketStore((state) => state.fetchMarket);
  const fetchMarkets = useMarketStore((state) => state.fetchMarkets);
  const fetchParameters = useMarketStore((state) => state.fetchParameters);
  const clearError = useMarketStore((state) => state.clearError);

  return { fetchMarket, fetchMarkets, fetchParameters, clearError };
}