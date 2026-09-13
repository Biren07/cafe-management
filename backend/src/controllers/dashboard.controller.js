import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { dashboardService } from '../services/dashboard.service.js';

class DashboardController {
  /**
   * Get complete Dashboard analytics, summary cards, and charts
   * GET /api/v1/dashboard
   */
  getDashboardAnalytics = asyncHandler(async (req, res) => {
    const analytics = await dashboardService.getDashboardAnalytics();
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          analytics,
          RESPONSE_MESSAGES.DASHBOARD_METRICS_FETCHED
        )
      );
  });

  /**
   * Get Dashboard Summary Cards metrics
   * GET /api/v1/dashboard/summary
   */
  getSummaryCards = asyncHandler(async (req, res) => {
    const summaryCards = await dashboardService.getSummaryCards();
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          summaryCards,
          'Summary cards metrics fetched successfully.'
        )
      );
  });

  /**
   * Get Weekly Sales Chart data
   * GET /api/v1/dashboard/weekly-sales
   */
  getWeeklySalesChart = asyncHandler(async (req, res) => {
    const weeklySales = await dashboardService.getWeeklySalesChart();
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          weeklySales,
          'Weekly sales chart data fetched successfully.'
        )
      );
  });

  /**
   * Get Monthly Revenue Chart data
   * GET /api/v1/dashboard/monthly-revenue
   */
  getMonthlyRevenueChart = asyncHandler(async (req, res) => {
    const monthlyRevenue = await dashboardService.getMonthlyRevenueChart();
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          monthlyRevenue,
          'Monthly revenue chart data fetched successfully.'
        )
      );
  });

  /**
   * Get Top Selling Menu Items
   * GET /api/v1/dashboard/top-selling
   */
  getTopSellingMenuItems = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const topSelling = await dashboardService.getTopSellingMenuItems(limit);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          topSelling,
          'Top selling menu items fetched successfully.'
        )
      );
  });

  /**
   * Get Most Ordered Categories
   * GET /api/v1/dashboard/most-ordered-categories
   */
  getMostOrderedCategories = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const mostOrdered = await dashboardService.getMostOrderedCategories(limit);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          mostOrdered,
          'Most ordered categories fetched successfully.'
        )
      );
  });

  /**
   * Get Recent Orders
   * GET /api/v1/dashboard/recent-orders
   */
  getRecentOrders = asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
    const recentOrders = await dashboardService.getRecentOrders(limit);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          recentOrders,
          'Recent orders fetched successfully.'
        )
      );
  });
}

export const dashboardController = new DashboardController();
