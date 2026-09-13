import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { paymentService } from '../services/payment.service.js';

class PaymentController {
  /**
   * Process a payment for an Order (Cashier & Owner)
   */
  processPayment = asyncHandler(async (req, res) => {
    const payment = await paymentService.processPayment(req.body, req.user._id);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          payment,
          RESPONSE_MESSAGES.PAYMENT_PROCESSED
        )
      );
  });

  /**
   * List payments with pagination, filtering, searching, date range, and sorting
   */
  getPayments = asyncHandler(async (req, res) => {
    const result = await paymentService.getPayments(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.PAYMENTS_FETCHED
        )
      );
  });

  /**
   * Get single payment details by Mongo ID or Invoice Number
   */
  getPaymentById = asyncHandler(async (req, res) => {
    const payment = await paymentService.getPaymentById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          payment,
          RESPONSE_MESSAGES.PAYMENT_FETCHED
        )
      );
  });

  /**
   * Update payment status (PENDING, COMPLETED, FAILED, REFUNDED)
   */
  updatePaymentStatus = asyncHandler(async (req, res) => {
    const payment = await paymentService.updatePaymentStatus(
      req.params.id,
      req.body.paymentStatus
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          payment,
          RESPONSE_MESSAGES.PAYMENT_STATUS_UPDATED
        )
      );
  });

  /**
   * Delete payment record by ID (Manager & Owner)
   */
  deletePayment = asyncHandler(async (req, res) => {
    await paymentService.deletePayment(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.PAYMENT_DELETED
        )
      );
  });
}

export const paymentController = new PaymentController();
