import { Router } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { HTTP_STATUS } from '../../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../../constants/responseMessages.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check system operational status, uptime, and database connection state.
 *     tags:
 *       - System
 *     responses:
 *       200:
 *         description: System is operational
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cafe Management System API is healthy and operational.
 *                 data:
 *                   type: object
 *                   properties:
 *                     uptime:
 *                       type: number
 *                     timestamp:
 *                       type: string
 *                     dbState:
 *                       type: string
 */
router.get(
  '/health',
  asyncHandler(async (req, res) => {
    const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
    const dbState = states[mongoose.connection.readyState] || 'unknown';

    const healthData = {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      databaseStatus: dbState,
      environment: process.env.NODE_ENV || 'development',
    };

    return res
      .status(HTTP_STATUS.OK)
      .json(new ApiResponse(HTTP_STATUS.OK, healthData, RESPONSE_MESSAGES.HEALTH_CHECK_SUCCESS));
  })
);

export default router;
