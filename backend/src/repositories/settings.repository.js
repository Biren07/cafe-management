import { Settings } from '../models/settings.model.js';

class SettingsRepository {
  /**
   * Fetch current system settings, initializing default settings document if none exists
   * @returns {Promise<Settings>}
   */
  async getSettings() {
    let settings = await Settings.findOne().populate('updatedBy', 'name email role').exec();
    if (!settings) {
      settings = await Settings.create({});
      settings = await settings.populate('updatedBy', 'name email role');
    }
    return settings;
  }

  /**
   * Update or upsert system settings document
   * @param {Object} updateData
   * @returns {Promise<Settings>}
   */
  async updateSettings(updateData) {
    let settings = await Settings.findOne().exec();
    if (!settings) {
      settings = await Settings.create(updateData);
    } else {
      settings = await Settings.findOneAndUpdate(
        { _id: settings._id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
    }
    return await settings.populate('updatedBy', 'name email role');
  }
}

export const settingsRepository = new SettingsRepository();
