import jwt from 'jsonwebtoken';
import { authRepository } from '../repositories/auth.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { envConfig } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

class AuthService {
  /**
   * Register a new user
   * @param {Object} registerData
   * @param {string} registerData.name
   * @param {string} registerData.email
   * @param {string} registerData.password
   * @param {string} [registerData.role]
   * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
   */
  async registerUser({ name, email, password, role }) {
    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        RESPONSE_MESSAGES.EMAIL_ALREADY_EXISTS
      );
    }

    const user = await authRepository.createUser({
      name,
      email,
      password,
      role,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await authRepository.updateRefreshToken(user._id, refreshToken);

    return {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Authenticate user with credentials
   * @param {Object} loginData
   * @param {string} loginData.email
   * @param {string} loginData.password
   * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
   */
  async loginUser({ email, password }) {
    const user = await authRepository.findByEmail(email, { selectPassword: true });
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        RESPONSE_MESSAGES.USER_INACTIVE
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await authRepository.updateRefreshToken(user._id, refreshToken);

    return {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Dedicated Owner login authentication
   * @param {Object} loginData
   * @param {string} loginData.email
   * @param {string} loginData.password
   * @returns {Promise<{user: Object, accessToken: string, refreshToken: string}>}
   */
  async ownerLoginUser({ email, password }) {
    const user = await authRepository.findByEmail(email, { selectPassword: true });
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
    }

    if (user.role !== ROLES.ADMIN) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        'Access denied: Dedicated admin login is restricted exclusively to Admin accounts.'
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        RESPONSE_MESSAGES.USER_INACTIVE
      );
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    await authRepository.updateRefreshToken(user._id, refreshToken);

    return {
      user: user.toPublicProfile(),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh JWT Access Token using valid Refresh Token
   * @param {string} incomingRefreshToken
   * @returns {Promise<{accessToken: string, refreshToken: string}>}
   */
  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefreshToken, envConfig.jwt.refreshSecret);
    } catch (err) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const user = await authRepository.findByRefreshToken(incomingRefreshToken);
    if (!user || user._id.toString() !== decoded._id) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        RESPONSE_MESSAGES.USER_INACTIVE
      );
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    await authRepository.updateRefreshToken(user._id, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user by clearing stored refresh token
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async logoutUser(userId) {
    await authRepository.updateRefreshToken(userId, null);
    return true;
  }

  /**
   * Change user password
   * @param {string} userId
   * @param {string} currentPassword
   * @param {string} newPassword
   * @returns {Promise<boolean>}
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.INVALID_CURRENT_PASSWORD
      );
    }

    user.password = newPassword;
    await user.save();
    return true;
  }

  /**
   * Get user profile details
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getUserProfile(userId) {
    const user = await authRepository.findById(userId);
    if (!user) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        RESPONSE_MESSAGES.USER_NOT_FOUND
      );
    }
    return user.toPublicProfile();
  }
}

export const authService = new AuthService();
