/**
 * @swagger
 * components:
 *   schemas:
 *     ProcessPaymentInput:
 *       type: object
 *       required:
 *         - order
 *         - paymentMethod
 *       properties:
 *         order:
 *           type: string
 *           description: MongoId of Order
 *           example: 65ba112233445566778899aa
 *         amount:
 *           type: number
 *           example: 10.98
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, ONLINE]
 *           example: CASH
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *           example: COMPLETED
 *         referenceNumber:
 *           type: string
 *           example: TXN-99887766
 *     Payment:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba998877665544332211bb
 *         invoiceNumber:
 *           type: string
 *           example: INV-20260805-7281
 *         order:
 *           type: object
 *         amount:
 *           type: number
 *           example: 10.98
 *         paymentMethod:
 *           type: string
 *           enum: [CASH, ONLINE]
 *           example: CASH
 *         paymentStatus:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *           example: COMPLETED
 *         referenceNumber:
 *           type: string
 *           example: TXN-99887766
 *         processedBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
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
 *   name: Payments
 *   description: Payment Processing & Invoice Management (Cashier, Manager, Owner)
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Process a payment with auto-generated invoice number & order status sync (Cashier & Owner)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessPaymentInput'
 *     responses:
 *       201:
 *         description: Payment processed successfully
 *       400:
 *         description: Validation error or payment already completed
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - Requires CREATE_PAYMENT permission
 */

/**
 * @swagger
 * /payments:
 *   get:
 *     summary: Retrieve list of payments with pagination, search, status/method filters, date range & sorting
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by invoiceNumber or referenceNumber
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *         description: Filter by payment status
 *       - in: query
 *         name: paymentMethod
 *         schema:
 *           type: string
 *           enum: [CASH, ONLINE]
 *         description: Filter by payment method
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date filter (ISO8601)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date filter (ISO8601)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, amount, paymentStatus, invoiceNumber]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Payments list retrieved successfully
 */

/**
 * @swagger
 * /payments/{id}:
 *   get:
 *     summary: Get single payment details by Mongo ID or Invoice Number
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment MongoId or Invoice Number (e.g. INV-20260805-7281)
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
 *       404:
 *         description: Payment record not found
 */

/**
 * @swagger
 * /payments/{id}/status:
 *   patch:
 *     summary: Update payment status (e.g. REFUNDED or FAILED)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment MongoId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentStatus
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 enum: [PENDING, COMPLETED, FAILED, REFUNDED]
 *                 example: REFUNDED
 *     responses:
 *       200:
 *         description: Payment status updated successfully
 *       404:
 *         description: Payment record not found
 */

/**
 * @swagger
 * /payments/{id}:
 *   delete:
 *     summary: Delete payment record by ID (Manager & Owner ONLY)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Payment MongoId
 *     responses:
 *       200:
 *         description: Payment record deleted successfully
 *       404:
 *         description: Payment record not found
 *       403:
 *         description: Forbidden - Requires Manager/Owner permission
 */
