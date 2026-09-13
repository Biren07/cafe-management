/**
 * @swagger
 * components:
 *   schemas:
 *     SummaryCards:
 *       type: object
 *       properties:
 *         todaySales:
 *           type: number
 *           example: 1250.50
 *         todayOrders:
 *           type: integer
 *           example: 42
 *         monthlySales:
 *           type: number
 *           example: 34500.00
 *         availableTables:
 *           type: integer
 *           example: 8
 *         occupiedTables:
 *           type: integer
 *           example: 4
 *         totalEmployees:
 *           type: integer
 *           example: 15
 *         totalMenuItems:
 *           type: integer
 *           example: 65
 *         lowStockItems:
 *           type: integer
 *           example: 3
 *     WeeklySalesPoint:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2026-08-06"
 *         day:
 *           type: string
 *           example: "Thu"
 *         totalSales:
 *           type: number
 *           example: 450.00
 *         orderCount:
 *           type: integer
 *           example: 18
 *     MonthlyRevenuePoint:
 *       type: object
 *       properties:
 *         year:
 *           type: integer
 *           example: 2026
 *         month:
 *           type: string
 *           example: "Aug"
 *         totalRevenue:
 *           type: number
 *           example: 12450.00
 *         orderCount:
 *           type: integer
 *           example: 320
 *     TopSellingMenuItem:
 *       type: object
 *       properties:
 *         menuItemId:
 *           type: string
 *           example: 65ba987654321fedcba09876
 *         name:
 *           type: string
 *           example: "Iced Caramel Macchiato"
 *         totalQuantitySold:
 *           type: integer
 *           example: 142
 *         totalRevenue:
 *           type: number
 *           example: 708.58
 *     MostOrderedCategory:
 *       type: object
 *       properties:
 *         categoryId:
 *           type: string
 *           example: 65ba112233445566778899aa
 *         categoryName:
 *           type: string
 *           example: "Hot Coffee"
 *         totalItemsSold:
 *           type: integer
 *           example: 380
 *         totalRevenue:
 *           type: number
 *           example: 1890.50
 *     DashboardAnalyticsResponse:
 *       type: object
 *       properties:
 *         summaryCards:
 *           $ref: '#/components/schemas/SummaryCards'
 *         charts:
 *           type: object
 *           properties:
 *             weeklySales:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WeeklySalesPoint'
 *             monthlyRevenue:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MonthlyRevenuePoint'
 *             topSellingMenuItems:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TopSellingMenuItem'
 *             mostOrderedCategories:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MostOrderedCategory'
 *         recentOrders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Order'
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard Analytics
 *   description: High-Performance Cafe Operations & Performance Analytics
 */

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Retrieve complete frontend-ready Dashboard metrics, summary cards, charts, and recent orders
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics and aggregation charts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard analytics metrics fetched successfully.
 *                 data:
 *                   $ref: '#/components/schemas/DashboardAnalyticsResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /dashboard/summary:
 *   get:
 *     summary: Retrieve Summary Cards metrics (Sales, Orders, Tables, Employees, Menu, Low Stock)
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Summary cards metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Summary cards metrics fetched successfully.
 *                 data:
 *                   $ref: '#/components/schemas/SummaryCards'
 */

/**
 * @swagger
 * /dashboard/weekly-sales:
 *   get:
 *     summary: Retrieve Weekly Sales aggregation chart data (Last 7 Days)
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weekly sales chart data retrieved successfully
 */

/**
 * @swagger
 * /dashboard/monthly-revenue:
 *   get:
 *     summary: Retrieve Monthly Revenue aggregation chart data (Last 12 Months)
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly revenue chart data retrieved successfully
 */

/**
 * @swagger
 * /dashboard/top-selling:
 *   get:
 *     summary: Retrieve Top Selling Menu Items aggregation chart data
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Limit number of items
 *     responses:
 *       200:
 *         description: Top selling menu items chart data retrieved successfully
 */

/**
 * @swagger
 * /dashboard/most-ordered-categories:
 *   get:
 *     summary: Retrieve Most Ordered Categories aggregation chart data
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Limit number of categories
 *     responses:
 *       200:
 *         description: Most ordered categories chart data retrieved successfully
 */

/**
 * @swagger
 * /dashboard/recent-orders:
 *   get:
 *     summary: Retrieve Recent Orders list
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Limit number of recent orders
 *     responses:
 *       200:
 *         description: Recent orders retrieved successfully
 */
