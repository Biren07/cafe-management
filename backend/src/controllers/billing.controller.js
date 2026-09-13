import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { billingService } from '../services/billing.service.js';

class BillingController {
  /**
   * Generate a new Bill from an Order
   * POST /api/v1/billing/generate
   */
  generateBill = asyncHandler(async (req, res) => {
    const bill = await billingService.generateBill(req.body, req.user._id);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          bill,
          RESPONSE_MESSAGES.BILL_GENERATED
        )
      );
  });

  /**
   * List bills with pagination, filtering, searching, date range & sorting
   * GET /api/v1/billing
   */
  getBills = asyncHandler(async (req, res) => {
    const result = await billingService.getBills(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.BILLS_FETCHED
        )
      );
  });

  /**
   * Get single bill details by ID or Receipt Number
   * GET /api/v1/billing/:id
   */
  getBillById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const bill = await billingService.getBillById(id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          bill,
          RESPONSE_MESSAGES.BILL_FETCHED
        )
      );
  });

  /**
   * Generate structured printable invoice JSON for receipt printing
   * POST /api/v1/billing/:id/print
   */
  printInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const printableReceipt = await billingService.printInvoice(id, req.user._id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          printableReceipt,
          RESPONSE_MESSAGES.BILL_PRINTED_SUCCESS
        )
      );
  });

  /**
   * Split bill among multiple people
   * POST /api/v1/billing/:id/split
   */
  splitBill = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const bill = await billingService.splitBill(id, req.body, req.user._id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          bill,
          RESPONSE_MESSAGES.BILL_SPLIT_SUCCESS
        )
      );
  });

  /**
   * Update bill status (PENDING, PAID, CANCELLED)
   * PATCH /api/v1/billing/:id/status
   */
  updateBillStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const bill = await billingService.updateBillStatus(id, status, req.user._id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          bill,
          RESPONSE_MESSAGES.BILL_STATUS_UPDATED
        )
      );
  });
}

export const billingController = new BillingController();
