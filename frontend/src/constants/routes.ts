export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: {
    OVERVIEW: '/dashboard',
    ORDERS: '/orders',
    MENU: '/menu',
    CATEGORIES: '/categories',
    BILLING: '/billing',
    INVENTORY: '/inventory',
    EMPLOYEES: '/employees',
    TABLES: '/tables',
    PAYMENTS: '/payments',
    EXPENSES: '/expenses',
    SETTINGS: '/settings',
    USERS: '/users',
  },
} as const;

export const PUBLIC_ROUTES = [ROUTES.AUTH.LOGIN];
