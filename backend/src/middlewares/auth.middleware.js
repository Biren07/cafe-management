import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { envConfig } from '../config/env.js';
import { authRepository } from '../repositories/auth.repository.js';
import { ROLE_PERMISSIONS } from '../constants/permissions.js';
import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

/**
 * Middleware to authenticate requests via JWT Access Token
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGES.UNAUTHORIZED_TOKEN
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, envConfig.jwt.accessSecret);
  } catch (err) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGES.UNAUTHORIZED_TOKEN
    );
  }

  const user = await authRepository.findById(decoded._id);
  if (!user) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      RESPONSE_MESSAGES.USER_NOT_FOUND
    );
  }

  if (!user.isActive) {
    throw new ApiError(
      HTTP_STATUS.FORBIDDEN,
      RESPONSE_MESSAGES.USER_INACTIVE
    );
  }

  req.user = user;
  next();
});

/**
 * Role Middleware: Authorizes users based on role list
 * @param  {...string} roles - Allowed roles (OWNER, MANAGER, CASHIER)
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.UNAUTHORIZED
      );
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        RESPONSE_MESSAGES.FORBIDDEN
      );
    }

    next();
  };
};

/**
 * Permission Middleware: Authorizes users based on granular permissions
 * @param  {...string} requiredPermissions - Permissions required to access resource
 */
export const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        RESPONSE_MESSAGES.UNAUTHORIZED
      );
    }

    const userPermissions = ROLE_PERMISSIONS[req.user.role] || [];
    const hasAccess = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAccess) {
      throw new ApiError(
        HTTP_STATUS.FORBIDDEN,
        `Forbidden: Missing required permission (${requiredPermissions.join(', ')})`
      );
    }

    next();
  };
};

/**
 * User Creation Guard Middleware:
 * Allows creating the initial OWNER account if no OWNER exists.
 * Otherwise restricts user creation exclusively to authenticated OWNER users.
 */
export const allowFirstOwnerOrCreateUser = asyncHandler(async (req, res, next) => {
  const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
  if (adminCount === 0) {
    req.body.role = ROLES.ADMIN;
    return next();
  }

  return authenticate(req, res, (err) => {
    if (err) return next(err);
    try {
      authorize(ROLES.ADMIN)(req, res, next);
    } catch (error) {
      next(error);
    }
  });
});
