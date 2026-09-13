import { Order } from '../models/order.model.js';
import { Table } from '../models/table.model.js';
import { Employee } from '../models/employee.model.js';
import { MenuItem } from '../models/menu.model.js';
import { Inventory } from '../models/inventory.model.js';

class DashboardRepository {
  /**
   * Aggregate Today's Sales Total and Order Count
   * @returns {Promise<{ todaySales: number, todayOrders: number }>}
   */
  async getTodayMetrics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
          status: { $ne: 'CANCELLED' },
        },
      },
      {
        $group: {
          _id: null,
          todaySales: { $sum: '$total' },
          todayOrders: { $sum: 1 },
        },
      },
    ]);

    return {
      todaySales: result[0] ? parseFloat(result[0].todaySales.toFixed(2)) : 0,
      todayOrders: result[0] ? result[0].todayOrders : 0,
    };
  }

  /**
   * Aggregate Monthly Sales Total
   * @returns {Promise<number>}
   */
  async getMonthlySales() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
          status: { $ne: 'CANCELLED' },
        },
      },
      {
        $group: {
          _id: null,
          monthlySales: { $sum: '$total' },
        },
      },
    ]);

    return result[0] ? parseFloat(result[0].monthlySales.toFixed(2)) : 0;
  }

  /**
   * Aggregate combined order metrics (Today's sales/orders & Monthly sales) in a single aggregation pipeline
   * @returns {Promise<{ todaySales: number, todayOrders: number, monthlySales: number }>}
   */
  async getCombinedOrderMetrics() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(
      startOfMonth.getFullYear(),
      startOfMonth.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const result = await Order.aggregate([
      {
        $facet: {
          today: [
            {
              $match: {
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                status: { $ne: 'CANCELLED' },
              },
            },
            {
              $group: {
                _id: null,
                todaySales: { $sum: '$total' },
                todayOrders: { $sum: 1 },
              },
            },
          ],
          monthly: [
            {
              $match: {
                createdAt: { $gte: startOfMonth, $lte: endOfMonth },
                status: { $ne: 'CANCELLED' },
              },
            },
            {
              $group: {
                _id: null,
                monthlySales: { $sum: '$total' },
              },
            },
          ],
        },
      },
    ]);

    const todayData = result[0]?.today[0] || {};
    const monthlyData = result[0]?.monthly[0] || {};

    return {
      todaySales: todayData.todaySales ? parseFloat(todayData.todaySales.toFixed(2)) : 0,
      todayOrders: todayData.todayOrders || 0,
      monthlySales: monthlyData.monthlySales ? parseFloat(monthlyData.monthlySales.toFixed(2)) : 0,
    };
  }

  /**
   * Count Available and Occupied Tables using MongoDB Aggregation Pipeline
   * @returns {Promise<{ availableTables: number, occupiedTables: number }>}
   */
  async getTableMetrics() {
    const result = await Table.aggregate([
      {
        $match: {
          isDeleted: false,
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    let availableTables = 0;
    let occupiedTables = 0;

    result.forEach((item) => {
      if (item._id === 'AVAILABLE') availableTables = item.count;
      if (item._id === 'OCCUPIED') occupiedTables = item.count;
    });

    return { availableTables, occupiedTables };
  }

  /**
   * Count Active Employees
   * @returns {Promise<number>}
   */
  async getTotalEmployees() {
    return await Employee.countDocuments({ status: 'ACTIVE' });
  }

  /**
   * Count Available Menu Items
   * @returns {Promise<number>}
   */
  async getTotalMenuItems() {
    return await MenuItem.countDocuments({ isAvailable: true });
  }

  /**
   * Count Low Stock Inventory Items (currentStock <= minimumStock)
   * @returns {Promise<number>}
   */
  async getLowStockItemsCount() {
    return await Inventory.countDocuments({
      $or: [
        { isLowStock: true },
        { $expr: { $lte: ['$currentStock', '$minimumStock'] } },
      ],
    });
  }

  /**
   * Aggregate Summary Cards metrics
   * @returns {Promise<Object>}
   */
  async getSummaryCards() {
    const [orderMetrics, tableMetrics, totalEmployees, totalMenuItems, lowStockItems] =
      await Promise.all([
        this.getCombinedOrderMetrics(),
        this.getTableMetrics(),
        this.getTotalEmployees(),
        this.getTotalMenuItems(),
        this.getLowStockItemsCount(),
      ]);

    return {
      todaySales: orderMetrics.todaySales,
      todayOrders: orderMetrics.todayOrders,
      monthlySales: orderMetrics.monthlySales,
      availableTables: tableMetrics.availableTables,
      occupiedTables: tableMetrics.occupiedTables,
      totalEmployees,
      totalMenuItems,
      lowStockItems,
    };
  }

  /**
   * Weekly Sales Chart Aggregation Pipeline (Last 7 Days)
   * @returns {Promise<Array<{ date: string, day: string, totalSales: number, orderCount: number }>>}
   */
  async getWeeklySalesChart() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: 'CANCELLED' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalSales: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Fill missing days in the 7-day range for consistent frontend charts
    const chartData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayName = daysOfWeek[d.getDay()];

      const match = result.find((r) => r._id === dateStr);
      chartData.push({
        date: dateStr,
        day: dayName,
        totalSales: match ? parseFloat(match.totalSales.toFixed(2)) : 0,
        orderCount: match ? match.orderCount : 0,
      });
    }

    return chartData;
  }

  /**
   * Monthly Revenue Chart Aggregation Pipeline (Last 12 Months)
   * @returns {Promise<Array<{ month: string, year: number, totalRevenue: number, orderCount: number }>>}
   */
  async getMonthlyRevenueChart() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $ne: 'CANCELLED' },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRevenue: { $sum: '$total' },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return result.map((item) => ({
      year: item._id.year,
      month: monthNames[item._id.month - 1],
      totalRevenue: parseFloat(item.totalRevenue.toFixed(2)),
      orderCount: item.orderCount,
    }));
  }

  /**
   * Top Selling Menu Items Aggregation Pipeline
   * @param {number} [limit=5]
   * @returns {Promise<Array<Object>>}
   */
  async getTopSellingMenuItems(limit = 5) {
    return await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          name: { $first: '$items.name' },
          totalQuantitySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 0,
          menuItemId: '$_id',
          name: 1,
          totalQuantitySold: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ]);
  }

  /**
   * Optimized Most Ordered Categories Aggregation Pipeline
   * Groups items first by menuItem before performing lookup joins to ensure high performance
   * @param {number} [limit=5]
   * @returns {Promise<Array<Object>>}
   */
  async getMostOrderedCategories(limit = 5) {
    return await Order.aggregate([
      { $match: { status: { $ne: 'CANCELLED' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          totalItemsSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' },
        },
      },
      {
        $lookup: {
          from: 'menuitems',
          localField: '_id',
          foreignField: '_id',
          as: 'menuItemDetails',
        },
      },
      {
        $unwind: {
          path: '$menuItemDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'menuItemDetails.category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: { $ifNull: ['$categoryDetails._id', 'Uncategorized'] },
          categoryName: { $first: { $ifNull: ['$categoryDetails.name', 'Uncategorized'] } },
          totalItemsSold: { $sum: '$totalItemsSold' },
          totalRevenue: { $sum: '$totalRevenue' },
        },
      },
      { $sort: { totalItemsSold: -1 } },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: 1,
          totalItemsSold: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
        },
      },
    ]);
  }

  /**
   * Retrieve Recent Orders with populated references
   * @param {number} [limit=5]
   * @returns {Promise<Array<Order>>}
   */
  async getRecentOrders(limit = 5) {
    return await Order.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('items.menuItem', 'name price category image')
      .populate('table', 'tableNumber tableName capacity status')
      .populate('createdBy', 'name email role')
      .exec();
  }
}

export const dashboardRepository = new DashboardRepository();
