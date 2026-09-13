import { settingsRepository } from '../repositories/settings.repository.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

class SettingsService {
  /**
   * Get global Cafe settings
   * @returns {Promise<Settings>}
   */
  async getSettings() {
    return await settingsRepository.getSettings();
  }

  /**
   * Update Cafe settings with optional Cloudinary logo upload
   * @param {Object} updateData
   * @param {Object} [file] - Multer uploaded logo file
   * @param {Object} user - Authenticated user performing the update
   * @returns {Promise<Settings>}
   */
  async updateSettings(updateData, file, user) {
    const existingSettings = await settingsRepository.getSettings();
    const payload = { ...updateData };

    if (file) {
      const uploadResult = await uploadOnCloudinary(file.path, 'cafe-management/logo');
      if (uploadResult) {
        if (existingSettings.logoPublicId) {
          await deleteFromCloudinary(existingSettings.logoPublicId);
        }
        payload.logo = uploadResult.secure_url;
        payload.logoPublicId = uploadResult.public_id;
      }
    }

    if (user) {
      payload.updatedBy = user._id || user.id;
    }

    return await settingsRepository.updateSettings(payload);
  }

  /**
   * Upload or update a specific Payment QR (Fonepay, eSewa, Khalti)
   * @param {Object} qrData
   * @param {Object} [file] - Multer uploaded QR image
   * @param {Object} user - Authenticated owner
   * @returns {Promise<Settings>}
   */
  async uploadOrUpdatePaymentQr(qrData, file, user) {
    const { provider, title, accountName, accountNumber, isActive } = qrData;
    const settings = await settingsRepository.getSettings();
    const normalizedProvider = (provider || 'FONEPAY').toUpperCase();

    let qrIndex = settings.paymentQRs.findIndex(
      (q) => q.provider === normalizedProvider
    );

    let qrEntry =
      qrIndex > -1
        ? settings.paymentQRs[qrIndex].toObject()
        : { provider: normalizedProvider };

    if (title !== undefined) qrEntry.title = title;
    if (accountName !== undefined) qrEntry.accountName = accountName;
    if (accountNumber !== undefined) qrEntry.accountNumber = accountNumber;
    if (isActive !== undefined) {
      qrEntry.isActive = isActive === 'true' || isActive === true;
    }

    if (file && file.path) {
      const uploadResult = await uploadOnCloudinary(
        file.path,
        'cafe-management/payment-qrs'
      );
      if (uploadResult) {
        if (qrEntry.qrImagePublicId) {
          await deleteFromCloudinary(qrEntry.qrImagePublicId);
        }
        qrEntry.qrImage = uploadResult.secure_url;
        qrEntry.qrImagePublicId = uploadResult.public_id;
      }
    }

    if (qrIndex > -1) {
      settings.paymentQRs[qrIndex] = qrEntry;
    } else {
      settings.paymentQRs.push(qrEntry);
    }

    if (user) {
      settings.updatedBy = user._id || user.id;
    }

    await settings.save();
    return await settings.populate('updatedBy', 'name email role');
  }

  /**
   * Delete or remove a Payment QR by provider
   * @param {string} provider
   * @param {Object} user
   * @returns {Promise<Settings>}
   */
  async deletePaymentQr(provider, user) {
    const settings = await settingsRepository.getSettings();
    const normalizedProvider = provider.toUpperCase();

    const qrIndex = settings.paymentQRs.findIndex(
      (q) => q.provider === normalizedProvider
    );

    if (qrIndex > -1) {
      const item = settings.paymentQRs[qrIndex];
      if (item.qrImagePublicId) {
        await deleteFromCloudinary(item.qrImagePublicId);
      }
      settings.paymentQRs.splice(qrIndex, 1);
      if (user) {
        settings.updatedBy = user._id || user.id;
      }
      await settings.save();
    }

    return await settings.populate('updatedBy', 'name email role');
  }
}

export const settingsService = new SettingsService();
