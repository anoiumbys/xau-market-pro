import api from './client';
import type {
  User,
  Market,
  MarketData,
  MarketParameter,
  Subscription,
  PriceAlert,
  TradeJournal,
  TradeDirection,
  TradeStatus,
  TradeStats,
  AdvancedReport,
  AdminOverview,
  AdminUserReport,
  AdminSubscriptionReport,
  AdminRevenueReport,
  MarketParameterUpdate,
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
  ResetPasswordForm,
  TradeJournalCreateForm,
  TradeJournalUpdateForm,
  PriceAlertCreateForm,
  SubscriptionCreateForm,
} from '@types';

// Auth endpoints
export const authApi = {
  login: (data: LoginForm) =>
    api.post<{ user: User; token: string; token_type: string }>('/login', data),
  register: (data: RegisterForm) =>
    api.post<{ user: User; token: string; token_type: string }>('/register', data),
  logout: () => api.post('/logout'),
  forgotPassword: (data: ForgotPasswordForm) => api.post('/forgot-password', data),
  resetPassword: (data: ResetPasswordForm) => api.post('/reset-password', data),
  me: () => api.get<User>('/user'),
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put<{ user: User; message: string }>('/user/profile', data),
};

// Market endpoints
export const marketApi = {
  getMarket: (symbol: string) => api.get<MarketData>(`/market/${symbol}`),
  getParameters: (symbol: string) => api.get<MarketParameter>(`/market-parameters/${symbol}`),
};

// Subscription endpoints
export const subscriptionApi = {
  subscribe: (data: SubscriptionCreateForm) => api.post<Subscription>('/subscription', data),
  getCurrent: () => api.get<Subscription>('/subscription'),
};

// Price Alert endpoints
export const alertApi = {
  list: (params?: { page?: number; per_page?: number }) =>
    api.getPaginated<PriceAlert>('/alerts', params),
  create: (data: PriceAlertCreateForm) => api.post<PriceAlert>('/alerts', data),
  delete: (id: string) => api.delete(`/alerts/${id}`),
};

// Trade Journal endpoints
export const journalApi = {
  list: (params?: {
    page?: number;
    per_page?: number;
    status?: TradeStatus;
    symbol?: string;
    direction?: TradeDirection;
    from?: string;
    to?: string;
  }) => api.getPaginated<TradeJournal>('/journal', params),
  create: (data: TradeJournalCreateForm) => api.post<TradeJournal>('/journal', data),
  get: (id: string) => api.get<TradeJournal>(`/journal/${id}`),
  update: (id: string, data: TradeJournalUpdateForm) =>
    api.put<TradeJournal>(`/journal/${id}`, data),
  delete: (id: string) => api.delete(`/journal/${id}`),
  close: (id: string, exitPrice: number) =>
    api.post<TradeJournal>(`/journal/${id}/close`, { exit_price: exitPrice }),
  stats: (params?: { from?: string; to?: string }) =>
    api.get<TradeStats>('/journal/stats/summary', params),
};

// Report endpoints
export const reportApi = {
  export: (params: {
    format?: 'json' | 'csv';
    type?: 'journal' | 'pnl' | 'winrate' | 'drawdown';
    from?: string;
    to?: string;
  }) => api.get('/reports/export', params),
  advanced: (params?: { from?: string; to?: string }) =>
    api.get<AdvancedReport>('/reports/advanced', params),
};

// Admin endpoints
export const adminApi = {
  // Users
  getUsers: (params?: { page?: number; per_page?: number; role?: string; search?: string }) =>
    api.getPaginated<User>('/admin/users', params),
  getUser: (id: string) => api.get<User>(`/admin/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<User>(`/admin/users/${id}`, data),
  updateUserRole: (id: string, role: User['role']) =>
    api.put<User>(`/admin/users/${id}/role`, { role }),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  unbanUser: (id: string) => api.put(`/admin/users/${id}/unban`),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),

  // Markets
  getMarkets: () => api.get<Market[]>('/admin/markets'),
  createMarket: (data: {
    symbol: string;
    name: string;
    asset_class: string;
    is_active?: boolean;
  }) => api.post<Market>('/admin/markets', data),
  getMarket: (id: string) => api.get<Market>(`/admin/markets/${id}`),
  updateMarket: (id: string, data: Partial<Market>) =>
    api.put<Market>(`/admin/markets/${id}`, data),
  toggleMarket: (id: string) => api.put<Market>(`/admin/markets/${id}/toggle`),
  deleteMarket: (id: string) => api.delete(`/admin/markets/${id}`),

  // Subscriptions
  getSubscriptions: (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    plan_type?: string;
  }) => api.getPaginated<Subscription>('/admin/subscriptions', params),
  getSubscription: (id: string) => api.get<Subscription>(`/admin/subscriptions/${id}`),
  approveSubscription: (id: string, durationDays?: number) =>
    api.put<Subscription>(`/admin/subscriptions/${id}/approve`, { duration_days: durationDays }),
  rejectSubscription: (id: string, reason?: string) =>
    api.put<Subscription>(`/admin/subscriptions/${id}/reject`, { reason }),
  cancelSubscription: (id: string) => api.put<Subscription>(`/admin/subscriptions/${id}/cancel`),
  extendSubscription: (id: string, additionalDays: number) =>
    api.put<Subscription>(`/admin/subscriptions/${id}/extend`, { additional_days: additionalDays }),

  // Alerts
  getAlerts: (params?: {
    page?: number;
    per_page?: number;
    symbol?: string;
    is_triggered?: boolean;
    user_id?: string;
  }) => api.getPaginated<PriceAlert>('/admin/alerts', params),
  getAlert: (id: string) => api.get<PriceAlert>(`/admin/alerts/${id}`),
  deleteAlert: (id: string) => api.delete(`/admin/alerts/${id}`),

  // Journal
  getJournal: (params?: {
    page?: number;
    per_page?: number;
    user_id?: string;
    symbol?: string;
    status?: string;
    direction?: string;
    from?: string;
    to?: string;
  }) => api.getPaginated<TradeJournal>('/admin/journal', params),
  getJournalEntry: (id: string) => api.get<TradeJournal>(`/admin/journal/${id}`),
  deleteJournalEntry: (id: string) => api.delete(`/admin/journal/${id}`),

  // Reports
  getOverview: () => api.get<AdminOverview>('/admin/reports/overview'),
  getUserReport: (params?: { from?: string; to?: string }) =>
    api.get<AdminUserReport>('/admin/reports/users', params),
  getSubscriptionReport: (params?: { from?: string; to?: string }) =>
    api.get<AdminSubscriptionReport>('/admin/reports/subscriptions', params),
  getRevenueReport: (params?: { from?: string; to?: string }) =>
    api.get<AdminRevenueReport>('/admin/reports/revenue', params),

  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data: Record<string, unknown>) => api.put('/admin/settings', data),
  getMarketParameters: () => api.get('/admin/market-parameters'),
  updateMarketParameters: (symbol: string, data: MarketParameterUpdate) =>
    api.put(`/admin/market-parameters/${symbol}`, data),
};

// Utility function for CSV download
export const downloadCsv = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
