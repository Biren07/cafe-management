import { Router } from 'express';
import healthRoutes from './health.routes.js';
import ownerRoutes from './owner.routes.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import menuRoutes from './menu.routes.js';
import categoryRoutes from './category.routes.js';
import inventoryRoutes from './inventory.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import employeeRoutes from './employee.routes.js';
import tableRoutes from './table.routes.js';
import billingRoutes from './billing.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import expenseRoutes from './expense.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

// Register v1 routes
router.use('/', healthRoutes);
router.use('/owner', ownerRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu', menuRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/tables', tableRoutes);
router.use('/billing', billingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/expenses', expenseRoutes);
router.use('/settings', settingsRoutes);

export default router;
