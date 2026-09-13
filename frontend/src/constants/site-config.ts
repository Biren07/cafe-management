export const SITE_CONFIG = {
  name: 'Artisan Cafe Admin',
  description: 'Enterprise Cafe Operations, Orders, Billing, & Inventory Management System',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  currency: '$',
  defaultLanguage: 'en',
  theme: {
    defaultMode: 'light',
    accentColor: '#f59e0b', // Amber
  },
  meta: {
    author: 'DeepMind Team',
    keywords: ['Cafe Management', 'POS', 'Order System', 'Billing', 'Inventory', 'Next.js 16', 'TypeScript'],
  },
} as const;
