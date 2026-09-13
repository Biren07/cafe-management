/**
 * @swagger
 * components:
 *   schemas:
 *     Settings:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba987654321fedcba09876
 *         cafeName:
 *           type: string
 *           example: My Artisan Cafe
 *         logo:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/v12345/cafe-management/logo/logo.png
 *         logoPublicId:
 *           type: string
 *           example: cafe-management/logo/logo
 *         phone:
 *           type: string
 *           example: +1-555-0199
 *         email:
 *           type: string
 *           example: contact@artisancafe.com
 *         address:
 *           type: string
 *           example: 123 Gourmet Street, Downtown, NY 10001
 *         vatNumber:
 *           type: string
 *           example: VAT-987654321
 *         currency:
 *           type: string
 *           example: USD
 *         receiptFooter:
 *           type: string
 *           example: Thank you for dining with us! Please come again.
 *         businessHours:
 *           type: string
 *           example: Mon - Sun: 08:00 AM - 10:00 PM
 *         taxPercentage:
 *           type: number
 *           example: 13
 *         serviceChargePercentage:
 *           type: number
 *           example: 10
 *         updatedBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *               example: 65ba123456789abcdef01234
 *             name:
 *               type: string
 *               example: Admin Owner
 *             email:
 *               type: string
 *               example: admin@gmail.com
 *             role:
 *               type: string
 *               example: OWNER
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: System Settings
 *   description: Global Cafe Configuration & Branding Settings
 */

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Retrieve current global Cafe settings
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cafe settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cafe settings retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Settings'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update global Cafe settings (Restricted strictly to OWNER role)
 *     tags: [System Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               cafeName:
 *                 type: string
 *                 example: Artisan Grand Cafe
 *               phone:
 *                 type: string
 *                 example: +1-555-9988
 *               email:
 *                 type: string
 *                 example: info@artisangrandcafe.com
 *               address:
 *                 type: string
 *                 example: 789 Broadway Ave, New York, NY
 *               vatNumber:
 *                 type: string
 *                 example: VAT-11223344
 *               currency:
 *                 type: string
 *                 example: USD
 *               receiptFooter:
 *                 type: string
 *                 example: Hope you enjoyed your meal! See you soon.
 *               businessHours:
 *                 type: string
 *                 example: Mon - Sun: 07:00 AM - 11:00 PM
 *               taxPercentage:
 *                 type: number
 *                 example: 13
 *               serviceChargePercentage:
 *                 type: number
 *                 example: 10
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: New logo image file (JPEG, PNG, WEBP, max 5MB)
 *     responses:
 *       200:
 *         description: Cafe settings updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Requires OWNER role
 */
