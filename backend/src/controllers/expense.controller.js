import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { expenseService } from '../services/expense.service.js';

class ExpenseController {
  /**
   * Create a new Expense record
   * POST /api/v1/expenses
   */
  createExpense = asyncHandler(async (req, res) => {
    const expense = await expenseService.createExpense(req.body, req.file, req.user);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          expense,
          RESPONSE_MESSAGES.EXPENSE_CREATED
        )
      );
  });

  /**
   * Get all Expenses with pagination, search, filtering & sorting
   * GET /api/v1/expenses
   */
  getAllExpenses = asyncHandler(async (req, res) => {
    const result = await expenseService.getAllExpenses(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.EXPENSES_FETCHED
        )
      );
  });

  /**
   * Get single Expense details by ID
   * GET /api/v1/expenses/:id
   */
  getExpenseById = asyncHandler(async (req, res) => {
    const expense = await expenseService.getExpenseById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          expense,
          RESPONSE_MESSAGES.EXPENSE_FETCHED
        )
      );
  });

  /**
   * Update Expense by ID
   * PUT /api/v1/expenses/:id
   */
  updateExpense = asyncHandler(async (req, res) => {
    const expense = await expenseService.updateExpense(
      req.params.id,
      req.body,
      req.file
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          expense,
          RESPONSE_MESSAGES.EXPENSE_UPDATED
        )
      );
  });

  /**
   * Soft delete Expense by ID
   * DELETE /api/v1/expenses/:id
   */
  deleteExpense = asyncHandler(async (req, res) => {
    await expenseService.deleteExpense(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.EXPENSE_DELETED
        )
      );
  });
}

export const expenseController = new ExpenseController();
