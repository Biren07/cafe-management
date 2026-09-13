/**
 * @swagger
 * tags:
 *   name: Owner Main API
 *   description: Dedicated Endpoints for Owner Authentication & Profile Operations
 */

/**
 * @swagger
 * /owner/login:
 *   post:
 *     summary: Dedicated Owner Login (email admin@gmail.com, password admin123)
 *     tags: [Owner Main API]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Owner login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Access restricted exclusively to Owner accounts
 */

/**
 * @swagger
 * /owner/profile:
 *   get:
 *     summary: Get Owner profile details
 *     tags: [Owner Main API]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Owner profile retrieved successfully
 *       401:
 *         description: Unauthorized token
 *       403:
 *         description: Forbidden - Owner privileges required
 */

/**
 * @swagger
 * /owner/change-password:
 *   post:
 *     summary: Change Owner password
 *     tags: [Owner Main API]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordInput'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input or password mismatch
 *       401:
 *         description: Unauthorized token
 */
