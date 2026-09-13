import { dashboardRepository } from '../repositories/dashboard.repository.js';

class DashboardService {
  /**
   * Fetch all dashboard analytics, summary cards, charts, and recent orders concurrently
   * @returns {Promise<Object>} Frontend-ready structured JSON response
   */
  async getDashboardAnalytics() {
    const [
      summaryCards,
      weeklySales,
      monthlyRevenue,
      topSellingMenuItems,
      mostOrderedCategories,
      recentOrders,
    ] = await Promise.all([
      dashboardRepository.getSummaryCards(),
      dashboardRepository.getWeeklySalesChart(),
      dashboardRepository.getMonthlyRevenueChart(),
      dashboardRepository.getTopSellingMenuItems(5),
      dashboardRepository.getMostOrderedCategories(5),
      dashboardRepository.getRecentOrders(5),
    ]);

    return {
      summaryCards,
      charts: {
        weeklySales,
        monthlyRevenue,
        topSellingMenuItems,
        mostOrderedCategories,
      },
      recentOrders,
    };
  }

  /**
   * Fetch Summary Cards metrics
   * @returns {Promise<Object>}
   */
  async getSummaryCards() {
    return await dashboardRepository.getSummaryCards();
  }

  /**
   * Fetch Weekly Sales Chart data
   * @returns {Promise<Array>}
   */
  async getWeeklySalesChart() {
    return await dashboardRepository.getWeeklySalesChart();
  }

  /**
   * Fetch Monthly Revenue Chart data
   * @returns {Promise<Array>}
   */
  async getMonthlyRevenueChart() {
    return await dashboardRepository.getMonthlyRevenueChart();
  }

  /**
   * Fetch Top Selling Menu Items
   * @param {number} [limit=5]
   * @returns {Promise<Array>}
   */
  async getTopSellingMenuItems(limit = 5) {
    return await dashboardRepository.getTopSellingMenuItems(limit);
  }

  /**
   * Fetch Most Ordered Categories
   * @param {number} [limit=5]
   * @returns {Promise<Array>}
   */
  async getMostOrderedCategories(limit = 5) {
    return await dashboardRepository.getMostOrderedCategories(limit);
  }

  /**
   * Fetch Recent Orders
   * @param {number} [limit=5]
   * @returns {Promise<Array>}
   */
  async getRecentOrders(limit = 5) {
    return await dashboardRepository.getRecentOrders(limit);
  }
}

export const dashboardService = new DashboardService();
