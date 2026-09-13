import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { orderService } from '../services/order.service.js';

class OrderController {
  /**
   * Create a new Order (Cashier, Manager, Owner)
   */
  createOrder = asyncHandler(async (req, res) => {
    const order = await orderService.createOrder(req.body, req.user._id);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          order,
          RESPONSE_MESSAGES.ORDER_CREATED
        )
      );
  });

  /**
   * List orders with pagination, filtering, searching, date range, and sorting
   */
  getOrders = asyncHandler(async (req, res) => {
    const result = await orderService.getOrders(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.ORDERS_FETCHED
        )
      );
  });

  /**
   * Get single order details by Mongo ID or Order Number
   */
  getOrderById = asyncHandler(async (req, res) => {
    const order = await orderService.getOrderById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          order,
          RESPONSE_MESSAGES.ORDER_FETCHED
        )
      );
  });

  /**
   * Update order status (PENDING -> PREPARING -> SERVED -> COMPLETED / CANCELLED)
   */
  updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          order,
          RESPONSE_MESSAGES.ORDER_STATUS_UPDATED
        )
      );
  });

  /**
   * Update order details & re-calculate totals
   */
  updateOrder = asyncHandler(async (req, res) => {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          order,
          RESPONSE_MESSAGES.ORDER_UPDATED
        )
      );
  });

  /**
   * Delete / Cancel order (Manager & Owner only)
   */
  deleteOrder = asyncHandler(async (req, res) => {
    await orderService.deleteOrder(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.ORDER_DELETED
        )
      );
  });
}

export const orderController = new OrderController();
