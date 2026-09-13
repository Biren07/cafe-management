import { Order } from './order';

export interface SummaryCardsData {
  todaySales: number;
  todayOrders: number;
  monthlySales: number;
  availableTables: number;
  occupiedTables: number;
  totalEmployees: number;
  totalMenuItems: number;
  lowStockItems: number;
}

export interface WeeklySalesPoint {
  date: string;
  day: string;
  totalSales: number;
  orderCount: number;
}

export interface MonthlyRevenuePoint {
  year: number;
  month: string;
  totalRevenue: number;
  orderCount: number;
}

export interface TopSellingMenuItem {
  menuItemId: string;
  name: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export interface MostOrderedCategory {
  categoryId: string;
  categoryName: string;
  totalItemsSold: number;
  totalRevenue: number;
}

export interface DashboardChartsData {
  weeklySales: WeeklySalesPoint[];
  monthlyRevenue: MonthlyRevenuePoint[];
  topSellingMenuItems: TopSellingMenuItem[];
  mostOrderedCategories: MostOrderedCategory[];
}

export interface DashboardAnalyticsResponse {
  summaryCards: SummaryCardsData;
  charts: DashboardChartsData;
  recentOrders: Order[];
}
