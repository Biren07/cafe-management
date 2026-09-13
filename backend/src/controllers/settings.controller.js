import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { settingsService } from '../services/settings.service.js';

class SettingsController {
  /**
   * Get global Cafe settings
   * GET /api/v1/settings
   */
  getSettings = asyncHandler(async (req, res) => {
    const settings = await settingsService.getSettings();
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          settings,
          RESPONSE_MESSAGES.SETTINGS_FETCHED
        )
      );
  });

  /**
   * Update Cafe settings (OWNER restricted)
   * PUT /api/v1/settings
   */
  updateSettings = asyncHandler(async (req, res) => {
    const settings = await settingsService.updateSettings(
      req.body,
      req.file,
      req.user
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          settings,
          RESPONSE_MESSAGES.SETTINGS_UPDATED
        )
      );
  });

  /**
   * Upload or update a specific Payment QR (Fonepay, eSewa, Khalti)
   * POST /api/v1/settings/payment-qr
   */
  uploadPaymentQr = asyncHandler(async (req, res) => {
    const settings = await settingsService.uploadOrUpdatePaymentQr(
      req.body,
      req.file,
      req.user
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          settings,
          'Payment QR updated successfully.'
        )
      );
  });

  /**
   * Delete or remove a Payment QR by provider
   * DELETE /api/v1/settings/payment-qr/:provider
   */
  deletePaymentQr = asyncHandler(async (req, res) => {
    const settings = await settingsService.deletePaymentQr(
      req.params.provider,
      req.user
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          settings,
          'Payment QR removed successfully.'
        )
      );
  });
}

export const settingsController = new SettingsController();
