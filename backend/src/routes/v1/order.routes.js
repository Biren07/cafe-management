import { Router } from 'express';
import { orderController } from '../../controllers/order.controller.js';
import {
  createOrderValidation,
  updateOrderStatusValidation,
  updateOrderValidation,
  listOrderValidation,
  orderIdParamValidation,
} from '../../validations/order.validation.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { authenticate, hasPermission } from '../../middlewares/auth.middleware.js';
import { PERMISSIONS } from '../../constants/permissions.js';

const router = Router();

// All order endpoints require authentication
router.use(authenticate);

// Create new Order (Cashier, Manager & Owner)
router.post(
  '/',
  hasPermission(PERMISSIONS.CREATE_ORDER),
  createOrderValidation,
  validateRequest,
  orderController.createOrder
);

// List Orders with pagination, search, status/type filters, date range & sorting
router.get(
  '/',
  hasPermission(PERMISSIONS.READ_ORDER),
  listOrderValidation,
  validateRequest,
  orderController.getOrders
);

// Get single Order details by ID or orderNumber
router.get(
  '/:id',
  hasPermission(PERMISSIONS.READ_ORDER),
  orderController.getOrderById
);

// Update Order workflow status (Manager & Owner)
router.patch(
  '/:id/status',
  hasPermission(PERMISSIONS.MANAGE_ORDERS),
  updateOrderStatusValidation,
  validateRequest,
  orderController.updateOrderStatus
);

// Update Order details (Manager & Owner)
router.put(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_ORDERS),
  updateOrderValidation,
  validateRequest,
  orderController.updateOrder
);

// Delete / Cancel Order by ID (Manager & Owner)
router.delete(
  '/:id',
  hasPermission(PERMISSIONS.MANAGE_ORDERS),
  orderIdParamValidation,
  validateRequest,
  orderController.deleteOrder
);

export default router;
