// Base types
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// User types
export type UserRole = 'guest' | 'trader' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at: string | null;
  created_at: string;
  subscription?: Subscription | null;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Market types
export interface Market {
  id: string;
  symbol: string;
  name: string;
  asset_class: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MarketData {
  symbol: string;
  spot_price: number;
  daily_high: number;
  daily_low: number;
  change_24h: number;
  change_pct_24h: number;
  market_status: MarketStatus;
  timestamp: string;
}

export type MarketStatus = 'open' | 'closed' | 'pre_market' | 'after_hours';

export interface MarketParameter {
  id: string;
  symbol: string;
  support_levels: number[];
  resistance_levels: number[];
  is_active: boolean;
  updated_by: string;
  created_at: string;
  updated_at: string;
  updater?: User;
}

// Subscription types
export type PlanType = 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'cancelled' | 'rejected';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: PlanType;
  status: SubscriptionStatus;
  payment_ref: string;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  is_active: boolean;
  days_remaining: number | null;
  limits: PlanLimits;
}

export interface PlanLimits {
  alerts: number;
  exports: number;
}

export const PLAN_PRICES: Record<PlanType, number> = {
  basic: 29,
  pro: 99,
  enterprise: 299,
};

export const PLAN_FEATURES: Record<PlanType, { alerts: number; exports: number; name: string }> = {
  basic: { alerts: 3, exports: 0, name: 'Basic' },
  pro: { alerts: -1, exports: -1, name: 'Pro' },
  enterprise: { alerts: -1, exports: -1, name: 'Enterprise' },
};

// Price Alert types
export type AlertCondition = 'above' | 'below' | 'cross';

export interface PriceAlert {
  id: string;
  user_id: string;
  symbol: string;
  condition: AlertCondition;
  price_level: number;
  is_triggered: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  condition_label: string;
}

// Trade Journal types
export type TradeDirection = 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

export interface TradeJournal {
  id: string;
  user_id: string;
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  exit_price: number | null;
  lot_size: number;
  stop_loss: number;
  take_profit: number;
  pnl: number | null;
  risk_reward: number | null;
  status: TradeStatus;
  notes: string | null;
  opened_at: string;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  user?: User;
  direction_label: string;
  status_label: string;
  is_profitable: boolean | null;
}

export interface TradeStats {
  total_trades: number;
  open_trades: number;
  closed_trades: number;
  winning_trades: number;
  losing_trades: number;
  win_rate: number;
  total_pnl: number;
  avg_win: number;
  avg_loss: number;
  profit_factor: number;
  best_trade: number;
  worst_trade: number;
}

// Report types
export interface PnLReport {
  period: { from: string; to: string };
  summary: TradeStats;
  daily_pnl: DailyPnL[];
  monthly_pnl: MonthlyPnL[];
  trades: TradeJournal[];
}

export interface DailyPnL {
  date: string;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
}

export interface MonthlyPnL {
  month: string;
  pnl: number;
  trades: number;
  wins: number;
  losses: number;
  win_rate: number;
}

export interface WinRateReport {
  period: { from: string; to: string };
  overall: TradeStats;
  by_direction: { long: TradeStats; short: TradeStats };
  by_symbol: Record<string, TradeStats>;
}

export interface DrawdownReport {
  period: { from: string; to: string };
  max_drawdown: number;
  max_drawdown_amount: number;
  current_drawdown: number;
  equity_curve: EquityPoint[];
  drawdown_periods: DrawdownPeriod[];
}

export interface EquityPoint {
  date: string;
  trade_id: string;
  pnl: number;
  equity: number;
}

export interface DrawdownPeriod {
  date: string;
  equity: number;
  peak: number;
  drawdown: number;
  drawdown_pct: number;
}

export interface AdvancedReport {
  period: { from: string; to: string };
  pnl_report: PnLReport;
  winrate_report: WinRateReport;
  drawdown_report: DrawdownReport;
  streaks: StreakData;
  time_analysis: TimeAnalysis[];
  consecutive: ConsecutiveData;
}

export interface StreakData {
  current_streak: number;
  current_streak_type: 'win' | 'loss' | null;
  max_win_streak: number;
  max_loss_streak: number;
}

export interface TimeAnalysis {
  hour: number;
  trades: number;
  wins: number;
  losses: number;
  win_rate: number;
  avg_pnl: number;
}

export interface ConsecutiveData {
  consecutive_wins: number[];
  consecutive_losses: number[];
  longest_win_streak: number;
  longest_loss_streak: number;
}

// Admin types
export interface AdminOverview {
  users: {
    total: number;
    traders: number;
    guests: number;
    admins: number;
    new_this_month: number;
  };
  subscriptions: {
    active: number;
    pending: number;
    new_this_month: number;
    monthly_revenue: number;
  };
  trading: {
    total_closed_trades: number;
    total_pnl: number;
  };
}

export interface AdminUserReport {
  period: { from: string; to: string };
  registrations: { date: string; count: number }[];
  by_role: { role: string; count: number }[];
  active_users: number;
}

export interface AdminSubscriptionReport {
  period: { from: string; to: string };
  by_status: { status: string; count: number }[];
  by_plan: { plan_type: string; count: number }[];
  monthly: { month: string; count: number }[];
  churn: number;
}

export interface AdminRevenueReport {
  period: { from: string; to: string };
  total_revenue: number;
  monthly_revenue: Record<string, number>;
  avg_revenue_per_user: number;
}

export interface MarketParameterUpdate {
  support_levels: number[];
  resistance_levels: number[];
  is_active: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface ResetPasswordForm {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface TradeJournalCreateForm {
  symbol: string;
  direction: TradeDirection;
  entry_price: number;
  lot_size: number;
  stop_loss?: number | null;
  take_profit?: number | null;
  exit_price?: number | null;
  notes?: string;
}

export interface TradeJournalUpdateForm {
  exit_price?: number;
  lot_size?: number;
  stop_loss?: number;
  take_profit?: number;
  status?: TradeStatus;
  notes?: string;
}

export interface PriceAlertCreateForm {
  symbol: string;
  condition: AlertCondition;
  price_level: number;
}

export interface SubscriptionCreateForm {
  plan_type: PlanType;
}

export interface MarketParameterForm {
  symbol: string;
  support_levels: number[];
  resistance_levels: number[];
  is_active: boolean;
}

// WebSocket types
export interface PriceTick {
  symbol: string;
  price: number;
  timestamp: string;
  change_24h?: number;
  change_pct_24h?: number;
}

export interface WebSocketMessage {
  event: string;
  data: unknown;
  timestamp: string;
}

export interface WSPriceAlertTriggered {
  alert_id: string;
  symbol: string;
  condition: AlertCondition;
  price_level: number;
  current_price: number;
}

export interface WSSubscriptionActivated {
  subscription_id: string;
  plan_type: PlanType;
  expires_at: string;
}

export interface WSNewSubscriptionPending {
  subscription_id: string;
  user_id: string;
  plan_type: PlanType;
}

// Utility types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

// Date formatting
export const DATE_FORMATS = {
  short: 'MMM d, yyyy',
  long: 'MMMM d, yyyy',
  time: 'HH:mm',
  datetime: 'MMM d, yyyy HH:mm',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
} as const;
