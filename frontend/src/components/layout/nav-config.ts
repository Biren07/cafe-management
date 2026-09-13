import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Grid,
  Receipt,
  Package,
  Users,
  Armchair,
  DollarSign,
  UserCheck,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { ADMIN_ROLES, PERMISSIONS, UserRole, Permission } from '@/constants/permissions';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'amber' | 'emerald' | 'rose';
  roles?: readonly UserRole[];
  permission?: Permission;
}

export interface NavGroup {
  groupLabel: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Main Menu',
    items: [
      {
        title: 'Dashboard',
        href: ROUTES.DASHBOARD.OVERVIEW,
        icon: LayoutDashboard,
        permission: PERMISSIONS.READ_DASHBOARD,
        roles: ADMIN_ROLES,
      },
      {
        title: 'Orders',
        href: ROUTES.DASHBOARD.ORDERS,
        icon: ShoppingBag,
        permission: PERMISSIONS.READ_ORDER,
      },
      {
        title: 'Menu Items',
        href: ROUTES.DASHBOARD.MENU,
        icon: UtensilsCrossed,
        permission: PERMISSIONS.READ_MENU,
      },
      {
        title: 'Categories',
        href: ROUTES.DASHBOARD.CATEGORIES,
        icon: Grid,
        permission: PERMISSIONS.READ_CATEGORY,
      },
      {
        title: 'Billing & POS',
        href: ROUTES.DASHBOARD.BILLING,
        icon: Receipt,
        permission: PERMISSIONS.READ_BILLING,
        roles: ADMIN_ROLES,
      },
      {
        title: 'Payments',
        href: ROUTES.DASHBOARD.PAYMENTS,
        icon: DollarSign,
        permission: PERMISSIONS.READ_PAYMENT,
      },
    ],
  },
  {
    groupLabel: 'Management',
    items: [
      {
        title: 'Inventory',
        href: ROUTES.DASHBOARD.INVENTORY,
        icon: Package,
        permission: PERMISSIONS.READ_INVENTORY,
      },
      {
        title: 'Dining Tables',
        href: ROUTES.DASHBOARD.TABLES,
        icon: Armchair,
        permission: PERMISSIONS.READ_TABLES,
      },
      {
        title: 'Employees HR',
        href: ROUTES.DASHBOARD.EMPLOYEES,
        icon: Users,
        permission: PERMISSIONS.READ_EMPLOYEE,
        roles: ADMIN_ROLES,
      },
      {
        title: 'Expenses',
        href: ROUTES.DASHBOARD.EXPENSES,
        icon: DollarSign,
        permission: PERMISSIONS.READ_EXPENSES,
        roles: ADMIN_ROLES,
      },
    ],
  },
  {
    groupLabel: 'Administration',
    items: [
      {
        title: 'Staff Users',
        href: ROUTES.DASHBOARD.USERS,
        icon: UserCheck,
        permission: PERMISSIONS.READ_USER,
        roles: ADMIN_ROLES,
      },
      {
        title: 'Store Settings',
        href: ROUTES.DASHBOARD.SETTINGS,
        icon: Settings,
        permission: PERMISSIONS.READ_SETTINGS,
        roles: ADMIN_ROLES,
      },
    ],
  },
];
