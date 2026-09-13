import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { envConfig } from './env.js';
import { logger } from './logger.js';

// Configure Cloudinary SDK
cloudinary.config({
  cloud_name: envConfig.cloudinary.cloudName,
  api_key: envConfig.cloudinary.apiKey,
  api_secret: envConfig.cloudinary.apiSecret,
});

/**
 * Upload local file to Cloudinary
 * @param {string} localFilePath - Path to file stored locally
 * @param {string} folder - Cloudinary destination folder name
 * @returns {Promise<object|null>} Cloudinary upload response object or null
 */
export const uploadOnCloudinary = async (localFilePath, folder = 'cafe-management') => {
  try {
    if (!localFilePath) return null;

    // Upload file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      folder: folder,
    });

    // Remove file from local temp directory after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    logger.info(`File uploaded successfully to Cloudinary: ${response.secure_url}`);
    return response;
  } catch (error) {
    logger.error(`Cloudinary upload failed: ${error.message}`);
    // Clean up local temp file if upload failed
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return null;
  }
};

/**
 * Delete file from Cloudinary by public ID
 * @param {string} publicId - Cloudinary asset public ID
 * @param {string} resourceType - Resource type ('image', 'video', 'raw')
 * @returns {Promise<object|null>} Cloudinary destruction response object or null
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    logger.info(`File deleted from Cloudinary: ${publicId}`);
    return response;
  } catch (error) {
    logger.error(`Cloudinary deletion failed: ${error.message}`);
    return null;
  }
};

export { cloudinary };
