/**
 * Backend-Synchronized Role-Based Access Control (RBAC) Constants
 * Exactly 2 Roles: ADMIN and STAFF
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LIST: UserRole[] = Object.values(ROLES);

export const ADMIN_ROLES: readonly UserRole[] = [ROLES.ADMIN] as const;
export const STAFF_ROLES: readonly UserRole[] = [ROLES.STAFF] as const;

export const PERMISSIONS = {
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
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_LIST: Permission[] = Object.values(PERMISSIONS);

const ALL_PERMISSIONS: readonly Permission[] = Object.values(PERMISSIONS);

const STAFF_PERMISSIONS: readonly Permission[] = [
  PERMISSIONS.READ_CATEGORY,
  PERMISSIONS.READ_MENU,
  PERMISSIONS.READ_INVENTORY,
  PERMISSIONS.CREATE_ORDER,
  PERMISSIONS.READ_ORDER,
  PERMISSIONS.CREATE_PAYMENT,
  PERMISSIONS.READ_PAYMENT,
  PERMISSIONS.READ_TABLES,
] as const;

/**
 * Exact Role-to-Permissions Mapping Matrix matching Backend
 */
export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = Object.freeze({
  [ROLES.ADMIN]: ALL_PERMISSIONS,
  [ROLES.STAFF]: STAFF_PERMISSIONS,
});
