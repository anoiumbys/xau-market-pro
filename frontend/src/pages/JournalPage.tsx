import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Select } from '@components/ui/Input';
import { StatusBadge, DirectionBadge } from '@components/ui/Badge';
import { useJournalStore } from '@stores/journalStore';
import { formatPrice, formatPnL, formatDate, getPnLColor } from '@utils/cn';
import { Plus, Search, Trash2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@utils/cn';

export function JournalPage() {
  const trades = useJournalStore((state) => state.trades);
  const stats = useJournalStore((state) => state.stats);
  const isLoading = useJournalStore((state) => state.isLoading);
  const error = useJournalStore((state) => state.error);
  const pagination = useJournalStore((state) => state.pagination);
  const filters = useJournalStore((state) => state.filters);
  const fetchTrades = useJournalStore((state) => state.fetchTrades);
  const fetchStats = useJournalStore((state) => state.fetchStats);
  const setFilters = useJournalStore((state) => state.setFilters);
  const clearFilters = useJournalStore((state) => state.clearFilters);
  const closeTrade = useJournalStore((state) => state.closeTrade);
  const deleteTrade = useJournalStore((state) => state.deleteTrade);

  useEffect(() => {
    fetchTrades(1);
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = async (id: string, symbol: string) => {
    const v = window.prompt(`Harga exit untuk ${symbol}:`);
    if (v == null || v.trim() === '') return;
    const exit = Number(v);
    if (!exit || exit <= 0) {
      toast.error('Harga exit tidak valid');
      return;
    }
    try {
      await closeTrade(id, exit);
      fetchStats();
      toast.success('Trade ditutup');
    } catch (e) {
      toast.error((e as Error).message || 'Gagal menutup trade');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Hapus trade ini?')) return;
    try {
      await deleteTrade(id);
      fetchStats();
      toast.success('Trade dihapus');
    } catch (e) {
      toast.error((e as Error).message || 'Gagal menghapus trade');
    }
  };

  const hasMore = pagination && pagination.current_page < pagination.last_page;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-light-900 dark:text-white">Trade Journal</h1>
          <p className="mt-1 text-light-600 dark:text-dark-400">Record and analyze your trades</p>
        </div>
        <Link to="/journal/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Trade
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-light-600 dark:text-dark-400">Total</p>
              <p className="text-2xl font-bold dark:text-white">{stats.total_trades}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-light-600 dark:text-dark-400">Open</p>
              <p className="text-2xl font-bold text-blue-400">{stats.open_trades}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-light-600 dark:text-dark-400">Win Rate</p>
              <p className="text-2xl font-bold dark:text-white">{stats.win_rate.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-light-600 dark:text-dark-400">Total PnL</p>
              <p className={cn('text-2xl font-bold', getPnLColor(stats.total_pnl))}>
                {formatPnL(stats.total_pnl)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Your Trades</CardTitle>
            <CardDescription>
              {pagination
                ? `${pagination.total} trade journal entries`
                : 'All your trade journal entries'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              aria-label="Filter status"
              value={filters.status ?? ''}
              onChange={(e) =>
                e.target.value ? setFilters({ status: e.target.value as never }) : clearFilters()
              }
              options={[
                { value: '', label: 'Semua status' },
                { value: 'open', label: 'Open' },
                { value: 'closed', label: 'Closed' },
              ]}
            />
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
          {trades.length === 0 && !isLoading ? (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-light-400 dark:text-dark-600" />
              <h3 className="mb-2 text-lg font-medium text-light-900 dark:text-white">
                No trades yet
              </h3>
              <p className="mb-6 text-light-600 dark:text-dark-400">
                Start journaling your trades to track performance
              </p>
              <Link to="/journal/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Trade
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Direction</th>
                      <th>Entry</th>
                      <th>SL / TP</th>
                      <th>Lot</th>
                      <th>Exit</th>
                      <th>PnL</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((t) => (
                      <tr key={t.id}>
                        <td className="font-semibold">{t.symbol}</td>
                        <td>
                          <DirectionBadge direction={t.direction} />
                        </td>
                        <td className="tabular-nums">{formatPrice(Number(t.entry_price))}</td>
                        <td className="text-xs tabular-nums">
                          {t.stop_loss != null ? formatPrice(Number(t.stop_loss)) : '-'} /{' '}
                          {t.take_profit != null ? formatPrice(Number(t.take_profit)) : '-'}
                        </td>
                        <td className="tabular-nums">{Number(t.lot_size)}</td>
                        <td className="tabular-nums">
                          {t.exit_price != null ? formatPrice(Number(t.exit_price)) : '-'}
                        </td>
                        <td className={cn('font-semibold tabular-nums', getPnLColor(t.pnl))}>
                          {formatPnL(t.pnl)}
                        </td>
                        <td>
                          <StatusBadge status={t.status} />
                        </td>
                        <td className="whitespace-nowrap text-xs">
                          {formatDate(t.opened_at, 'datetime')}
                        </td>
                        <td>
                          <div className="flex items-center gap-1">
                            {t.status === 'open' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                title="Tutup trade"
                                onClick={() => handleClose(t.id, t.symbol)}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              title="Hapus"
                              onClick={() => handleDelete(t.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {isLoading && <p className="py-4 text-center text-sm">Loading...</p>}
              {hasMore && !isLoading && (
                <div className="pt-4 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => fetchTrades((pagination?.current_page ?? 1) + 1)}
                  >
                    Muat lagi
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
