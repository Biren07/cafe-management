import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { authService } from '../services/auth.service.js';
import { envConfig } from '../config/env.js';

const getCookieOptions = () => ({
  httpOnly: true,
  secure: envConfig.isProduction,
  sameSite: 'lax',
  maxAge: envConfig.jwt.cookieExpiresIn * 24 * 60 * 60 * 1000,
});

class AuthController {
  /**
   * Register a new user
   */
  register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });

    const cookieOptions = getCookieOptions();
    res
      .status(HTTP_STATUS.CREATED)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .cookie('refreshToken', result.refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          result,
          RESPONSE_MESSAGES.REGISTER_SUCCESS
        )
      );
  });

  /**
   * Login user
   */
  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    const cookieOptions = getCookieOptions();
    res
      .status(HTTP_STATUS.OK)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .cookie('refreshToken', result.refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.LOGIN_SUCCESS
        )
      );
  });

  /**
   * Owner-restricted login
   */
  ownerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.ownerLoginUser({ email, password });

    const cookieOptions = getCookieOptions();
    res
      .status(HTTP_STATUS.OK)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .cookie('refreshToken', result.refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.LOGIN_SUCCESS
        )
      );
  });

  /**
   * Refresh JWT Access Token
   */
  refreshToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.body.refreshToken || req.cookies?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        RESPONSE_MESSAGES.INVALID_REFRESH_TOKEN
      );
    }

    const result = await authService.refreshAccessToken(incomingRefreshToken);

    const cookieOptions = getCookieOptions();
    res
      .status(HTTP_STATUS.OK)
      .cookie('accessToken', result.accessToken, cookieOptions)
      .cookie('refreshToken', result.refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.TOKEN_REFRESH_SUCCESS
        )
      );
  });

  /**
   * Logout user and revoke tokens
   */
  logout = asyncHandler(async (req, res) => {
    await authService.logoutUser(req.user._id);

    const { maxAge, ...clearCookieOptions } = getCookieOptions();
    res
      .status(HTTP_STATUS.OK)
      .clearCookie('accessToken', clearCookieOptions)
      .clearCookie('refreshToken', clearCookieOptions)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.LOGOUT_SUCCESS
        )
      );
  });

  /**
   * Change user password
   */
  changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(
      req.user._id,
      currentPassword,
      newPassword
    );

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.PASSWORD_CHANGE_SUCCESS
        )
      );
  });

  /**
   * Get authenticated user profile
   */
  getProfile = asyncHandler(async (req, res) => {
    const profile = await authService.getUserProfile(req.user._id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          profile,
          RESPONSE_MESSAGES.PROFILE_FETCH_SUCCESS
        )
      );
  });
}

export const authController = new AuthController();
