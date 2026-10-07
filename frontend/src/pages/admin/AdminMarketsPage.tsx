import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge } from '@components/ui/Badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Market } from '@types';

const MOCK_MARKETS: Market[] = [
  { id: '1', symbol: 'XAUUSD', name: 'Gold / US Dollar', asset_class: 'COMMODITY', is_active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '2', symbol: 'XAGUSD', name: 'Silver / US Dollar', asset_class: 'COMMODITY', is_active: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '3', symbol: 'EURUSD', name: 'Euro / US Dollar', asset_class: 'FOREX', is_active: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
  { id: '4', symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', asset_class: 'CRYPTO', is_active: false, created_at: '2024-01-01', updated_at: '2024-01-01' },
];

export function AdminMarketsPage() {
  const [search, setSearch] = useState('');

  const filteredMarkets = MOCK_MARKETS.filter((m) =>
    m.symbol.toLowerCase().includes(search.toLowerCase()) ||
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Market Management</h1>
          <p className="text-dark-400 mt-1">Manage trading markets and symbols</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Market
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <Input placeholder="Search markets..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
                  <th>Symbol</th>
                  <th>Name</th>
                  <th>Asset Class</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMarkets.map((market) => (
                  <tr key={market.id}>
                    <td className="font-mono font-medium text-white">{market.symbol}</td>
                    <td>{market.name}</td>
                    <td>
                      <Badge variant={market.asset_class === 'COMMODITY' ? 'gold' : market.asset_class === 'FOREX' ? 'primary' : 'neutral'}>
                        {market.asset_class}
                      </Badge>
                    </td>
                    <td>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={market.is_active} className="sr-only peer" />
                        <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                      </label>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-dark-400 hover:text-primary-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-dark-400 hover:text-red-400" disabled={market.symbol === 'XAUUSD'}>
                          <Trash2 className="w-4 h-4" />
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