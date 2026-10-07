import { Card, CardContent } from '@components/ui/Card';
import { Badge, AlertConditionBadge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { PriceAlert } from '@types';

const MOCK_ALERTS: (PriceAlert & { user_name: string; user_email: string })[] = [
  { id: '1', user_id: '1', user_name: 'John Trader', user_email: 'john@example.com', symbol: 'XAUUSD', condition: 'above', price_level: 2350, is_triggered: false, created_at: '2024-01-15', updated_at: '2024-01-15', condition_label: 'Above' },
  { id: '2', user_id: '2', user_name: 'Jane Trader', user_email: 'jane@example.com', symbol: 'XAUUSD', condition: 'below', price_level: 2200, is_triggered: true, created_at: '2024-01-10', updated_at: '2024-01-12', condition_label: 'Below' },
  { id: '3', user_id: '3', user_name: 'Mike Trader', user_email: 'mike@example.com', symbol: 'XAUUSD', condition: 'cross', price_level: 2300, is_triggered: false, created_at: '2024-02-01', updated_at: '2024-02-01', condition_label: 'Crosses' },
];

export function AdminAlertsPage() {
  const [search, setSearch] = useState('');
  const [symbolFilter, setSymbolFilter] = useState('');
  const [triggeredFilter, setTriggeredFilter] = useState('');

  const filtered = MOCK_ALERTS.filter((alert) => {
    const matchesSearch = alert.user_name.toLowerCase().includes(search.toLowerCase()) || alert.user_email.toLowerCase().includes(search.toLowerCase());
    const matchesSymbol = !symbolFilter || alert.symbol === symbolFilter;
    const matchesTriggered = triggeredFilter === '' || (triggeredFilter === 'true' ? alert.is_triggered : !alert.is_triggered);
    return matchesSearch && matchesSymbol && matchesTriggered;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
          <p className="text-dark-400 mt-1">Monitor and manage all price alerts</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <Input placeholder="Search alerts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-3">
              <Select placeholder="All Symbols" value={symbolFilter} onChange={(e) => setSymbolFilter(e.target.value)} options={[
                { value: '', label: 'All Symbols' },
                { value: 'XAUUSD', label: 'XAUUSD' },
                { value: 'XAGUSD', label: 'XAGUSD' },
              ]} />
              <Select placeholder="All Status" value={triggeredFilter} onChange={(e) => setTriggeredFilter(e.target.value)} options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Triggered' },
                { value: 'false', label: 'Pending' },
              ]} />
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
                  <th>Condition</th>
                  <th>Price Level</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((alert) => (
                  <tr key={alert.id}>
                    <td>
                      <div>
                        <p className="font-medium text-white">{alert.user_name}</p>
                        <p className="text-xs text-dark-400">{alert.user_email}</p>
                      </div>
                    </td>
                    <td className="font-mono text-white">{alert.symbol}</td>
                    <td><AlertConditionBadge condition={alert.condition} /></td>
                    <td className="font-mono tabular-nums">{alert.price_level.toLocaleString()}</td>
                    <td>
                      <Badge variant={alert.is_triggered ? 'success' : 'warning'} dot dotColor={alert.is_triggered ? 'bg-green-400' : 'bg-yellow-400'}>
                        {alert.is_triggered ? 'Triggered' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="text-dark-400">{new Date(alert.created_at).toLocaleDateString()}</td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon" className="text-dark-400 hover:text-red-400" onClick={() => alert('Delete: ' + alert.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
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