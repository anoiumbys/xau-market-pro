import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Badge, PlanBadge, SubscriptionStatusBadge } from '@components/ui/Badge';
import { Input } from '@components/ui/Input';
import { Search, Check, X, Clock } from 'lucide-react';
import { useState } from 'react';
import type { Subscription, PlanType } from '@types';

const MOCK_SUBSCRIPTIONS: (Subscription & { user_name: string; user_email: string })[] = [
  { id: '1', user_id: '1', user_name: 'John Trader', user_email: 'john@example.com', plan_type: 'pro', status: 'active', payment_ref: 'SIM-ABC123', starts_at: '2024-01-15', expires_at: '2024-02-15', created_at: '2024-01-15', updated_at: '2024-01-15', is_active: true, days_remaining: 30, limits: { alerts: -1, exports: -1 } },
  { id: '2', user_id: '2', user_name: 'Jane Trader', user_email: 'jane@example.com', plan_type: 'basic', status: 'active', payment_ref: 'SIM-DEF456', starts_at: '2024-01-10', expires_at: '2024-02-10', created_at: '2024-01-10', updated_at: '2024-01-10', is_active: true, days_remaining: 25, limits: { alerts: 3, exports: 0 } },
  { id: '3', user_id: '3', user_name: 'Mike Guest', user_email: 'mike@example.com', plan_type: 'enterprise', status: 'pending', payment_ref: 'SIM-GHI789', starts_at: null, expires_at: null, created_at: '2024-02-01', updated_at: '2024-02-01', is_active: false, days_remaining: null, limits: { alerts: -1, exports: -1 } },
  { id: '4', user_id: '4', user_name: 'Sarah Trader', user_email: 'sarah@example.com', plan_type: 'pro', status: 'expired', payment_ref: 'SIM-JKL012', starts_at: '2023-12-01', expires_at: '2024-01-01', created_at: '2023-12-01', updated_at: '2024-01-01', is_active: false, days_remaining: 0, limits: { alerts: -1, exports: -1 } },
];

export function AdminSubscriptionsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');

  const filtered = MOCK_SUBSCRIPTIONS.filter((sub) => {
    const matchesSearch = sub.user_name.toLowerCase().includes(search.toLowerCase()) || sub.user_email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || sub.status === statusFilter;
    const matchesPlan = !planFilter || sub.plan_type === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscription Management</h1>
          <p className="text-dark-400 mt-1">Manage user subscriptions and payments</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <Input placeholder="Search subscriptions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            </div>
            <div className="flex gap-3">
              <Select placeholder="All Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[
                { value: '', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'expired', label: 'Expired' },
                { value: 'cancelled', label: 'Cancelled' },
              ]} />
              <Select placeholder="All Plans" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} options={[
                { value: '', label: 'All Plans' },
                { value: 'basic', label: 'Basic' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise' },
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
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Payment Ref</th>
                  <th>Period</th>
                  <th>Days Left</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sub) => (
                  <tr key={sub.id}>
                    <td>
                      <div>
                        <p className="font-medium text-white">{sub.user_name}</p>
                        <p className="text-xs text-dark-400">{sub.user_email}</p>
                      </div>
                    </td>
                    <td><PlanBadge plan={sub.plan_type} /></td>
                    <td><SubscriptionStatusBadge status={sub.status} /></td>
                    <td className="font-mono text-sm text-dark-300">{sub.payment_ref}</td>
                    <td>
                      {sub.starts_at ? new Date(sub.starts_at).toLocaleDateString() : '-'} →
                      {sub.expires_at ? ' ' + new Date(sub.expires_at).toLocaleDateString() : ' -'}
                    </td>
                    <td>
                      {sub.days_remaining !== null ? (
                        <span className={sub.days_remaining > 7 ? 'text-green-400' : sub.days_remaining > 0 ? 'text-yellow-400' : 'text-red-400'}>
                          {sub.days_remaining} days
                        </span>
                      ) : (
                        <span className="text-dark-400">-</span>
                      )}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {sub.status === 'pending' && (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => alert('Approve: ' + sub.id)}>
                              <Check className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => alert('Reject: ' + sub.id)}>
                              <X className="w-4 h-4 mr-1" /> Reject
                            </Button>
                          </>
                        )}
                        {sub.status === 'active' && (
                          <>
                            <Button variant="secondary" size="sm" onClick={() => alert('Extend: ' + sub.id)}>
                              <Clock className="w-4 h-4 mr-1" /> Extend
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => alert('Cancel: ' + sub.id)}>
                              <X className="w-4 h-4 mr-1" /> Cancel
                            </Button>
                          </>
                        )}
                        {sub.status === 'expired' && (
                          <Button variant="primary" size="sm" onClick={() => alert('Renew: ' + sub.id)}>
                            Renew
                          </Button>
                        )}
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