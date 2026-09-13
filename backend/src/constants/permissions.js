import { ROLES } from './roles.js';

/**
 * System Granular Permissions Enum
 */
export const PERMISSIONS = Object.freeze({
  // User Management
  CREATE_USER: 'users:create',
  READ_USER: 'users:read',

  // Menu Management
  MANAGE_MENU: 'menu:manage',
  READ_MENU: 'menu:read',

  // Inventory Management
  MANAGE_INVENTORY: 'inventory:manage',
  READ_INVENTORY: 'inventory:read',

  // Order Management
  MANAGE_ORDERS: 'orders:manage',
  CREATE_ORDER: 'orders:create',
  READ_ORDER: 'orders:read',

  // Category Management
  MANAGE_CATEGORY: 'categories:manage',
  READ_CATEGORY: 'categories:read',

  // Payment Management
  CREATE_PAYMENT: 'payments:create',
  READ_PAYMENT: 'payments:read',

  // Employee Management
  MANAGE_EMPLOYEE: 'employees:manage',
  READ_EMPLOYEE: 'employees:read',

  // Table Management
  MANAGE_TABLES: 'tables:manage',
  READ_TABLES: 'tables:read',

  // Billing Management
  MANAGE_BILLING: 'billing:manage',
  READ_BILLING: 'billing:read',

  // Dashboard Analytics
  READ_DASHBOARD: 'dashboard:read',

  // Expense Management
  MANAGE_EXPENSES: 'expenses:manage',
  READ_EXPENSES: 'expenses:read',

  // Settings Management
  MANAGE_SETTINGS: 'settings:manage',
  READ_SETTINGS: 'settings:read',
});

/**
 * Role to Permissions Mapping Matrix
 * - ADMIN: 100% Full Permissions
 * - STAFF: POS, Orders, Tables, Payments, View Menu/Categories/Inventory
 */
export const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.ADMIN]: Object.values(PERMISSIONS),

  [ROLES.STAFF]: [
    PERMISSIONS.READ_CATEGORY,
    PERMISSIONS.READ_MENU,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.CREATE_ORDER,
    PERMISSIONS.READ_ORDER,
    PERMISSIONS.CREATE_PAYMENT,
    PERMISSIONS.READ_PAYMENT,
    PERMISSIONS.READ_TABLES,
  ],
});
