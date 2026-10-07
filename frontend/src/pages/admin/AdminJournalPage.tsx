import { Card, CardContent } from '@components/ui/Card';
import { DirectionBadge, StatusBadge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Search, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';
import { formatPrice, formatPnL, getPnLColor } from '@utils/cn';
import type { TradeJournal } from '@types';

const MOCK_TRADES: (TradeJournal & { user_name: string; user_email: string })[] = [
  {
    id: '1',
    user_id: '1',
    user_name: 'John Trader',
    user_email: 'john@example.com',
    symbol: 'XAUUSD',
    direction: 'long',
    entry_price: 2320,
    exit_price: 2350,
    lot_size: 0.5,
    stop_loss: 2300,
    take_profit: 2360,
    pnl: 1500,
    risk_reward: 2.0,
    status: 'closed',
    notes: 'Good breakout trade',
    opened_at: '2024-01-15T10:00:00',
    closed_at: '2024-01-15T14:30:00',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',
    direction_label: 'Long',
    status_label: 'Closed',
    is_profitable: true,
  },
  {
    id: '2',
    user_id: '2',
    user_name: 'Jane Trader',
    user_email: 'jane@example.com',
    symbol: 'XAUUSD',
    direction: 'short',
    entry_price: 2380,
    exit_price: 2360,
    lot_size: 0.3,
    stop_loss: 2400,
    take_profit: 2340,
    pnl: 600,
    risk_reward: 2.0,
    status: 'closed',
    notes: 'Short at resistance',
    opened_at: '2024-01-16T09:00:00',
    closed_at: '2024-01-16T16:00:00',
    created_at: '2024-01-16',
    updated_at: '2024-01-16',
    direction_label: 'Short',
    status_label: 'Closed',
    is_profitable: true,
  },
  {
    id: '3',
    user_id: '1',
    user_name: 'John Trader',
    user_email: 'john@example.com',
    symbol: 'XAUUSD',
    direction: 'long',
    entry_price: 2340,
    exit_price: null,
    lot_size: 0.2,
    stop_loss: 2320,
    take_profit: 2380,
    pnl: null,
    risk_reward: 2.0,
    status: 'open',
    notes: 'Waiting for breakout',
    opened_at: '2024-02-01T11:00:00',
    closed_at: null,
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    direction_label: 'Long',
    status_label: 'Open',
    is_profitable: null,
  },
];

export function AdminJournalPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');

  const filtered = MOCK_TRADES.filter((trade) => {
    const matchesSearch =
      trade.user_name.toLowerCase().includes(search.toLowerCase()) ||
      trade.user_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || trade.status === statusFilter;
    const matchesSymbol = !symbolFilter || trade.symbol === symbolFilter;
    return matchesSearch && matchesStatus && matchesSymbol;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trade Journal (Admin)</h1>
          <p className="mt-1 text-dark-400">View all user trades</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" />
              <Input
                placeholder="Search trades..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select
                placeholder="All Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Status' },
                  { value: 'open', label: 'Open' },
                  { value: 'closed', label: 'Closed' },
                ]}
              />
              <Select
                placeholder="All Symbols"
                value={symbolFilter}
                onChange={(e) => setSymbolFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Symbols' },
                  { value: 'XAUUSD', label: 'XAUUSD' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Symbol</th>
                  <th>Direction</th>
                  <th>Entry / Exit</th>
                  <th>Lot Size</th>
                  <th>PnL</th>
                  <th>Status</th>
                  <th>Opened</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((trade) => (
                  <tr key={trade.id}>
                    <td>
                      <div>
                        <p className="font-medium text-white">{trade.user_name}</p>
                        <p className="text-xs text-dark-400">{trade.user_email}</p>
                      </div>
                    </td>
                    <td className="font-mono text-white">{trade.symbol}</td>
                    <td>
                      <DirectionBadge direction={trade.direction} />
                    </td>
                    <td>
                      <div className="font-mono text-sm tabular-nums">
                        <p className="text-white">{formatPrice(trade.entry_price)}</p>
                        <p
                          className={cn(
                            'text-xs',
                            trade.exit_price ? 'text-dark-400' : 'text-dark-500'
                          )}
                        >
                          {trade.exit_price ? formatPrice(trade.exit_price) : '—'}
                        </p>
                      </div>
                    </td>
                    <td className="text-dark-300">{trade.lot_size}</td>
                    <td
                      className={cn('font-mono font-medium tabular-nums', getPnLColor(trade.pnl))}
                    >
                      {trade.pnl !== null ? formatPnL(trade.pnl) : '—'}
                    </td>
                    <td>
                      <StatusBadge status={trade.status} />
                    </td>
                    <td className="whitespace-nowrap text-dark-400">
                      {new Date(trade.opened_at).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-dark-400 hover:text-primary-400"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-dark-400 hover:text-red-400"
                          onClick={() => alert('Delete: ' + trade.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Select } from '@components/ui/Input';
import { cn } from '@utils/cn';
