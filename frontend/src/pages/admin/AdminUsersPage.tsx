import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge, UserRoleBadge, SubscriptionStatusBadge } from '@components/ui/Badge';
import { Plus, Search, MoreVertical, Edit, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@types';

const MOCK_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@xaupro.test', role: 'admin', email_verified_at: '2024-01-01', created_at: '2024-01-01' },
  { id: '2', name: 'John Trader', email: 'trader@xaupro.test', role: 'trader', email_verified_at: '2024-01-02', created_at: '2024-01-02' },
  { id: '3', name: 'Jane Guest', email: 'guest@xaupro.test', role: 'guest', email_verified_at: '2024-01-03', created_at: '2024-01-03' },
  { id: '4', name: 'Mike Trader', email: 'mike@example.com', role: 'trader', email_verified_at: '2024-01-15', created_at: '2024-01-15' },
  { id: '5', name: 'Sarah Guest', email: 'sarah@example.com', role: 'guest', email_verified_at: null, created_at: '2024-02-01' },
];

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-dark-400 mt-1">Manage platform users and roles</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-500" />
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select
                placeholder="All Roles"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: '', label: 'All Roles' },
                  { value: 'admin', label: 'Admin' },
                  { value: 'trader', label: 'Trader' },
                  { value: 'guest', label: 'Guest' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-dark-400">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-dark-300">{user.email}</td>
                    <td><UserRoleBadge role={user.role} /></td>
                    <td>
                      <Badge variant={user.email_verified_at ? 'success' : 'warning'} dot dotColor={user.email_verified_at ? 'bg-green-400' : 'bg-yellow-400'}>
                        {user.email_verified_at ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="text-dark-400">{new Date(user.created_at).toLocaleDateString()}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="text-dark-400 hover:text-primary-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-dark-400 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-dark-400 hover:text-gold-400">
                          <Shield className="w-4 h-4" />
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