import { Router } from 'express';
import { dashboardController } from '../../controllers/dashboard.controller.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All dashboard endpoints require authentication & permission
router.use(authenticate);
router.use(hasPermission(PERMISSIONS.READ_DASHBOARD));

// Main full dashboard payload route
router.get('/', dashboardController.getDashboardAnalytics);

// Granular dashboard metrics routes
router.get('/summary', dashboardController.getSummaryCards);
router.get('/weekly-sales', dashboardController.getWeeklySalesChart);
router.get('/monthly-revenue', dashboardController.getMonthlyRevenueChart);
router.get('/top-selling', dashboardController.getTopSellingMenuItems);
router.get('/most-ordered-categories', dashboardController.getMostOrderedCategories);
router.get('/recent-orders', dashboardController.getRecentOrders);

export default router;
