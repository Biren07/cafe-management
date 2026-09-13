export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionData {
  endpoint: string;
  keys: PushSubscriptionKeys;
  userAgent?: string;
  deviceType?: 'mobile' | 'desktop' | 'tablet';
}

export interface NotificationCategoryPreferences {
  orders: boolean;
  payments: boolean;
  lowStock: boolean;
  systemAlerts: boolean;
}

export interface NotificationPreferencesResponse {
  userId: string;
  isPushEnabled: boolean;
  categories: NotificationCategoryPreferences;
  activeSubscriptionsCount: number;
}

export interface TestPushPayload {
  title?: string;
  message?: string;
  category?: 'orders' | 'payments' | 'lowStock' | 'systemAlerts';
  url?: string;
}
