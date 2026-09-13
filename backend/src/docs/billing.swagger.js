/**
 * @swagger
 * components:
 *   schemas:
 *     BillHistory:
 *       type: object
 *       properties:
 *         action:
 *           type: string
 *           example: GENERATED
 *         details:
 *           type: string
 *           example: Bill generated from Order #ORD-20260806-1234
 *         performedBy:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         timestamp:
 *           type: string
 *           format: date-time
 *     SplitDetail:
 *       type: object
 *       properties:
 *         personIndex:
 *           type: integer
 *           example: 1
 *         amount:
 *           type: number
 *           example: 12.50
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *           example: PENDING
 *     Bill:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65cb4e2a1b9f8d0012a34567
 *         receiptNumber:
 *           type: string
 *           example: RCP-20260806-7281
 *         order:
 *           type: object
 *           description: Populated Order details
 *         subtotal:
 *           type: number
 *           example: 20.00
 *         tax:
 *           type: number
 *           example: 2.00
 *         discount:
 *           type: number
 *           example: 1.00
 *         serviceCharge:
 *           type: number
 *           example: 1.00
 *         grandTotal:
 *           type: number
 *           example: 22.00
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *           example: PENDING
 *         isSplit:
 *           type: boolean
 *           example: false
 *         splitCount:
 *           type: integer
 *           example: 1
 *         splitDetails:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SplitDetail'
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BillHistory'
 *         createdBy:
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
 *     GenerateBillInput:
 *       type: object
 *       required:
 *         - order
 *       properties:
 *         order:
 *           type: string
 *           description: MongoId of Order
 *           example: 65ba112233445566778899aa
 *         tax:
 *           type: number
 *           example: 2.00
 *         discount:
 *           type: number
 *           example: 1.00
 *         serviceCharge:
 *           type: number
 *           example: 1.00
 *     SplitBillInput:
 *       type: object
 *       required:
 *         - splitCount
 *       properties:
 *         splitCount:
 *           type: integer
 *           example: 2
 *         customAmounts:
 *           type: array
 *           items:
 *             type: number
 *           example: [11.00, 11.00]
 *     UpdateBillStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *           example: PAID
 */

/**
 * @swagger
 * tags:
 *   name: Billing Management
 *   description: Cafe Customer Billing & Invoicing Endpoints
 */

/**
 * @swagger
 * /billing/generate:
 *   post:
 *     summary: Generate a new bill from an existing order
 *     tags: [Billing Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateBillInput'
 *     responses:
 *       201:
 *         description: Bill generated successfully
 *       400:
 *         description: Bad request or validation error
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /billing:
 *   get:
 *     summary: List all bills with pagination, search, filtering & sorting
 *     tags: [Billing Management]
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
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search matching receiptNumber
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *         description: Filter by bill status
 *       - in: query
 *         name: isSplit
 *         schema:
 *           type: boolean
 *         description: Filter by split status
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
 *           default: createdAt
 *         description: Field to sort by (createdAt, updatedAt, grandTotal, status, receiptNumber)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Paginated bill list retrieved successfully
 */

/**
 * @swagger
 * /billing/{id}:
 *   get:
 *     summary: Get single bill details by ID or Receipt Number
 *     tags: [Billing Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill MongoId or Receipt Number (e.g. RCP-20260806-7281)
 *     responses:
 *       200:
 *         description: Bill details retrieved successfully
 *       404:
 *         description: Bill not found
 */

/**
 * @swagger
 * /billing/{id}/print:
 *   post:
 *     summary: Generate structured printable invoice JSON for receipt printing & log print history
 *     tags: [Billing Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bill MongoId or Receipt Number
 *     responses:
 *       200:
 *         description: Printable invoice JSON generated successfully
 *       404:
 *         description: Bill not found
 */

/**
 * @swagger
 * /billing/{id}/split:
 *   post:
 *     summary: Split bill into equal or custom shares among multiple people
 *     tags: [Billing Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SplitBillInput'
 *     responses:
 *       200:
 *         description: Bill split successfully
 *       400:
 *         description: Invalid split count or custom amounts sum mismatch
 *       404:
 *         description: Bill not found
 */

/**
 * @swagger
 * /billing/{id}/status:
 *   patch:
 *     summary: Update bill status (PENDING, PAID, CANCELLED) & sync Order/Table status on PAID
 *     tags: [Billing Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBillStatusInput'
 *     responses:
 *       200:
 *         description: Bill status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Bill not found
 */
