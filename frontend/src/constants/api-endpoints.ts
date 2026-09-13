export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    OWNER_LOGIN: '/owner/login',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    DEACTIVATE: (id: string) => `/users/${id}/deactivate`,
  },
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },
  MENU: {
    BASE: '/menu',
    BY_ID: (id: string) => `/menu/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    STATUS: (id: string) => `/orders/${id}/status`,
  },
  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (id: string) => `/payments/${id}`,
    STATUS: (id: string) => `/payments/${id}/status`,
  },
  BILLING: {
    BASE: '/billing',
    BY_ID: (id: string) => `/billing/${id}`,
    STATUS: (id: string) => `/billing/${id}/status`,
    SPLIT: (id: string) => `/billing/${id}/split`,
    PRINT: (id: string) => `/billing/${id}/print`,
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id: string) => `/inventory/${id}`,
    LOW_STOCK: '/inventory/low-stock',
    HISTORY: (id: string) => `/inventory/${id}/history`,
    STOCK_IN: (id: string) => `/inventory/${id}/stock-in`,
    STOCK_OUT: (id: string) => `/inventory/${id}/stock-out`,
  },
  EMPLOYEES: {
    BASE: '/employees',
    BY_ID: (id: string) => `/employees/${id}`,
    ATTENDANCE: (id: string) => `/employees/${id}/attendance`,
  },
  TABLES: {
    BASE: '/tables',
    BY_ID: (id: string) => `/tables/${id}`,
    STATUS: (id: string) => `/tables/${id}/status`,
  },
  DASHBOARD: {
    ANALYTICS: '/dashboard',
    SUMMARY: '/dashboard/summary',
    WEEKLY_SALES: '/dashboard/weekly-sales',
    MONTHLY_REVENUE: '/dashboard/monthly-revenue',
    TOP_SELLING: '/dashboard/top-selling',
    MOST_ORDERED_CATEGORIES: '/dashboard/most-ordered-categories',
    RECENT_ORDERS: '/dashboard/recent-orders',
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id: string) => `/expenses/${id}`,
  },
  SETTINGS: {
    BASE: '/settings',
    PAYMENT_QR: '/settings/payment-qr',
    DELETE_PAYMENT_QR: (provider: string) => `/settings/payment-qr/${provider}`,
  },
  NOTIFICATIONS: {
    SUBSCRIBE: '/notifications/push/subscribe',
    UNSUBSCRIBE: '/notifications/push/unsubscribe',
    PREFERENCES: '/notifications/push/preferences',
    TEST: '/notifications/push/test',
  },
} as const;
