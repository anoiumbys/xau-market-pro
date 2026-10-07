import { Card, CardContent } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Badge, UserRoleBadge } from '@components/ui/Badge';
import { Plus, Search, Edit, Trash2, Shield } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@types';

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@xaupro.test',
    role: 'admin',
    email_verified_at: '2024-01-01',
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'John Trader',
    email: 'trader@xaupro.test',
    role: 'trader',
    email_verified_at: '2024-01-02',
    created_at: '2024-01-02',
  },
  {
    id: '3',
    name: 'Jane Guest',
    email: 'guest@xaupro.test',
    role: 'guest',
    email_verified_at: '2024-01-03',
    created_at: '2024-01-03',
  },
  {
    id: '4',
    name: 'Mike Trader',
    email: 'mike@example.com',
    role: 'trader',
    email_verified_at: '2024-01-15',
    created_at: '2024-01-15',
  },
  {
    id: '5',
    name: 'Sarah Guest',
    email: 'sarah@example.com',
    role: 'guest',
    email_verified_at: null,
    created_at: '2024-02-01',
  },
];

export function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = MOCK_USERS.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="mt-1 text-dark-400">Manage platform users and roles</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-dark-500" />
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
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dark-800">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-xs text-dark-400">{user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-dark-300">{user.email}</td>
                    <td>
                      <UserRoleBadge role={user.role} />
                    </td>
                    <td>
                      <Badge
                        variant={user.email_verified_at ? 'success' : 'warning'}
                        dot
                        dotColor={user.email_verified_at ? 'bg-green-400' : 'bg-yellow-400'}
                      >
                        {user.email_verified_at ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="text-dark-400">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-dark-400 hover:text-primary-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-dark-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-dark-400 hover:text-gold-400"
                        >
                          <Shield className="h-4 w-4" />
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
