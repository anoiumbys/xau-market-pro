// contracts/types/websocket.d.ts
// MANUAL SOURCE OF TRUTH - WebSocket Event Types
// Keep in sync with backend Events and BroadcastChannel definitions

export interface WebSocketEvents {
  'market.xauusd': {
    PriceTick: {
      price: number;
      timestamp: string;
      change_24h: number;
      change_pct_24h: number;
    };
    DailyRangeUpdate: {
      high: number;
      low: number;
    };
    MarketStatusChange: {
      status: 'OPEN' | 'CLOSED';
      next_change: string | null;
    };
  };
  'alerts.{userId}': {
    PriceAlertTriggered: {
      alert_id: string;
      symbol: string;
      condition: 'above' | 'below' | 'cross';
      price_level: number;
      current_price: number;
      triggered_at: string;
    };
  };
  'admin.notifications': {
    NewSubscriptionPending: {
      subscription_id: string;
      user_name: string;
      user_email: string;
      plan: 'basic' | 'pro' | 'enterprise';
      created_at: string;
    };
    SubscriptionActivated: {
      subscription_id: string;
      user_id: string;
      plan: 'basic' | 'pro' | 'enterprise';
      expires_at: string;
    };
  };
  'user.{userId}': {
    Notification: {
      id: string;
      type: 'info' | 'warning' | 'success' | 'error';
      title: string;
      message: string;
      data?: Record<string, unknown>;
      created_at: string;
    };
  };
}

// Channel authorization types
export interface ChannelAuthData {
  'market.xauusd': null;
  'alerts.{userId}': { user_id: string };
  'admin.notifications': { is_admin: boolean };
  'user.{userId}': { user_id: string };
}

// Presence channel data (if needed)
export interface PresenceChannelData {
  'presence.market.xauusd': {
    user_id: string;
    user_name: string;
    role: 'guest' | 'trader' | 'admin';
  };
}