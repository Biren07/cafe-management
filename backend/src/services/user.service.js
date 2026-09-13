import { userRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class UserService {
  /**
   * Create a new staff member
   */
  async createStaff(staffData) {
    const { email } = staffData;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    const user = await userRepository.createUser(staffData);
    return user.toPublicProfile();
  }

  /**
   * List staff members with pagination, filtering, and search
   */
  async listStaff({ page, limit, search, role, status }) {
    const result = await userRepository.findStaff({
      page,
      limit,
      search,
      role,
      status,
    });

    return {
      staff: result.users,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  /**
   * Get single staff member by ID
   */
  async getStaffById(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }
    return user.toPublicProfile();
  }

  /**
   * Update staff member details
   */
  async updateStaff(userId, updateData) {
    const existingUser = await userRepository.findById(userId);
    if (!existingUser) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailConflict = await userRepository.findByEmail(updateData.email);
      if (emailConflict) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTS
        );
      }
    }

    const updatedUser = await userRepository.updateUser(userId, updateData);
    return updatedUser.toPublicProfile();
  }

  /**
   * Deactivate staff account
   */
  async deactivateStaff(userId) {
    const user = await userRepository.deactivateUser(userId);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }
    return user.toPublicProfile();
  }

  /**
   * Delete staff user
   */
  async deleteStaff(userId) {
    const success = await userRepository.deleteUser(userId);
    if (!success) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }
    return true;
  }
}

export const userService = new UserService();
