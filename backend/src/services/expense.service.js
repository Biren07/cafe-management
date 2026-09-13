import { expenseRepository } from '../repositories/expense.repository.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class ExpenseService {
  /**
   * Create a new expense record with optional Cloudinary receipt image upload
   * @param {Object} expenseData
   * @param {Object} [file] - Multer uploaded file
   * @param {Object} user - Authenticated user creating the expense
   * @returns {Promise<Expense>}
   */
  async createExpense(expenseData, file, user) {
    let receiptImage = '';
    let receiptImagePublicId = '';

    if (file) {
      const uploadResult = await uploadOnCloudinary(file.path, 'cafe-management/receipts');
      if (uploadResult) {
        receiptImage = uploadResult.secure_url;
        receiptImagePublicId = uploadResult.public_id;
      }
    }

    const payload = {
      ...expenseData,
      receiptImage,
      receiptImagePublicId,
      createdBy: user._id || user.id,
    };

    return await expenseRepository.create(payload);
  }

  /**
   * Get all expenses with pagination, search, filtering, and sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getAllExpenses(queryParams) {
    return await expenseRepository.findAll(queryParams);
  }

  /**
   * Get expense record by ID
   * @param {string} id
   * @returns {Promise<Expense>}
   */
  async getExpenseById(id) {
    const expense = await expenseRepository.findById(id);
    if (!expense) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EXPENSE_NOT_FOUND);
    }
    return expense;
  }

  /**
   * Update expense record by ID with optional new Cloudinary receipt image
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} [file] - Multer uploaded file
   * @returns {Promise<Expense>}
   */
  async updateExpense(id, updateData, file) {
    const existingExpense = await expenseRepository.findById(id);
    if (!existingExpense) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EXPENSE_NOT_FOUND);
    }

    const payload = { ...updateData };

    if (file) {
      const uploadResult = await uploadOnCloudinary(file.path, 'cafe-management/receipts');
      if (uploadResult) {
        // Delete old receipt image from Cloudinary if existing
        if (existingExpense.receiptImagePublicId) {
          await deleteFromCloudinary(existingExpense.receiptImagePublicId);
        }
        payload.receiptImage = uploadResult.secure_url;
        payload.receiptImagePublicId = uploadResult.public_id;
      }
    }

    const updatedExpense = await expenseRepository.update(id, payload);
    if (!updatedExpense) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EXPENSE_NOT_FOUND);
    }
    return updatedExpense;
  }

  /**
   * Soft delete expense record by ID and remove receipt from Cloudinary
   * @param {string} id
   * @returns {Promise<Expense>}
   */
  async deleteExpense(id) {
    const existingExpense = await expenseRepository.findById(id);
    if (!existingExpense) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EXPENSE_NOT_FOUND);
    }

    if (existingExpense.receiptImagePublicId) {
      await deleteFromCloudinary(existingExpense.receiptImagePublicId);
    }

    const deletedExpense = await expenseRepository.softDelete(id);
    return deletedExpense;
  }
}

export const expenseService = new ExpenseService();
