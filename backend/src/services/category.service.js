import { categoryRepository } from '../repositories/category.repository.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { slugify } from '../models/category.model.js';

class CategoryService {
  /**
   * Create a new category with optional image upload & duplicate check
   * @param {Object} categoryData
   * @param {Object} [file] - Express.Multer file object
   * @returns {Promise<Category>}
   */
  async createCategory(categoryData, file) {
    const { name, slug: customSlug } = categoryData;

    // Check duplicate name
    const existingByName = await categoryRepository.findByName(name);
    if (existingByName) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `Category with name '${name}' already exists.`
      );
    }

    // Determine and check slug uniqueness
    const generatedSlug = customSlug ? slugify(customSlug) : slugify(name);
    const existingBySlug = await categoryRepository.findBySlug(generatedSlug);
    if (existingBySlug) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `Category with slug '${generatedSlug}' already exists.`
      );
    }

    categoryData.slug = generatedSlug;

    // Handle Cloudinary Image Upload
    if (file && file.path) {
      const uploadResult = await uploadOnCloudinary(file.path, 'categories');
      if (uploadResult) {
        categoryData.image = uploadResult.secure_url;
        categoryData.imagePublicId = uploadResult.public_id;
      }
    }

    return await categoryRepository.createCategory(categoryData);
  }

  /**
   * List categories with pagination, search, filtering, and sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getCategories(queryParams) {
    return await categoryRepository.findCategories(queryParams);
  }

  /**
   * Get category details by ID
   * @param {string} id
   * @returns {Promise<Category>}
   */
  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  /**
   * Get category details by Slug
   * @param {string} slug
   * @returns {Promise<Category>}
   */
  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  /**
   * Update existing category by ID with optional new image upload
   * @param {string} id
   * @param {Object} updateData
   * @param {Object} [file] - Express.Multer file object
   * @returns {Promise<Category>}
   */
  async updateCategory(id, updateData, file) {
    const existingCategory = await categoryRepository.findById(id);
    if (!existingCategory) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Duplicate check for Name if changing
    if (updateData.name && updateData.name.trim().toLowerCase() !== existingCategory.name.toLowerCase()) {
      const duplicateName = await categoryRepository.findByName(updateData.name);
      if (duplicateName && duplicateName._id.toString() !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Category with name '${updateData.name}' already exists.`
        );
      }
    }

    // Duplicate check for Slug if changing
    const newSlug = updateData.slug
      ? slugify(updateData.slug)
      : updateData.name
      ? slugify(updateData.name)
      : existingCategory.slug;

    if (newSlug !== existingCategory.slug) {
      const duplicateSlug = await categoryRepository.findBySlug(newSlug);
      if (duplicateSlug && duplicateSlug._id.toString() !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Category with slug '${newSlug}' already exists.`
        );
      }
      updateData.slug = newSlug;
    }

    // Handle Cloudinary Image Replacement
    if (file && file.path) {
      const uploadResult = await uploadOnCloudinary(file.path, 'categories');
      if (uploadResult) {
        // Delete previous image from Cloudinary if public ID exists
        if (existingCategory.imagePublicId) {
          await deleteFromCloudinary(existingCategory.imagePublicId);
        }
        updateData.image = uploadResult.secure_url;
        updateData.imagePublicId = uploadResult.public_id;
      }
    }

    return await categoryRepository.updateCategory(id, updateData);
  }

  /**
   * Delete category by ID and remove image asset from Cloudinary
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteCategory(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.CATEGORY_NOT_FOUND);
    }

    // Clean up Cloudinary asset
    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    return await categoryRepository.deleteCategory(id);
  }
}

export const categoryService = new CategoryService();
