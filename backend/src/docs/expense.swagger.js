/**
 * @swagger
 * components:
 *   schemas:
 *     Expense:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba987654321fedcba09876
 *         title:
 *           type: string
 *           example: Office Coffee Beans Bulk Purchase
 *         category:
 *           type: string
 *           example: SUPPLIES
 *         amount:
 *           type: number
 *           example: 245.50
 *         description:
 *           type: string
 *           example: Purchased 10kg Arabica beans for cafe stock
 *         expenseDate:
 *           type: string
 *           format: date-time
 *           example: 2026-08-07T00:00:00.000Z
 *         receiptImage:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/v123456/cafe-management/receipts/receipt.jpg
 *         receiptImagePublicId:
 *           type: string
 *           example: cafe-management/receipts/receipt
 *         createdBy:
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
 *         isDeleted:
 *           type: boolean
 *           example: false
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
 *   name: Expenses
 *   description: Expense Management & Receipt Tracking Endpoints
 */

/**
 * @swagger
 * /expenses:
 *   post:
 *     summary: Create a new expense record with optional receipt image upload
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - amount
 *             properties:
 *               title:
 *                 type: string
 *                 example: Monthly Electricity Bill
 *               category:
 *                 type: string
 *                 example: UTILITIES
 *               amount:
 *                 type: number
 *                 example: 450.00
 *               description:
 *                 type: string
 *                 example: Electricity bill payment for July 2026
 *               expenseDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-08-07T00:00:00.000Z
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional receipt image file (JPEG, PNG, WEBP, max 5MB)
 *     responses:
 *       201:
 *         description: Expense record created successfully
 *       400:
 *         description: Validation Error or bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get paginated list of expenses with search, filtering, and sorting
 *     tags: [Expenses]
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
 *         description: Search by title, description, or category
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by exact expense category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses on or after this date (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter expenses on or before this date (YYYY-MM-DD)
 *       - in: query
 *         name: minAmount
 *         schema:
 *           type: number
 *         description: Filter by minimum amount
 *       - in: query
 *         name: maxAmount
 *         schema:
 *           type: number
 *         description: Filter by maximum amount
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [expenseDate, createdAt, updatedAt, amount, title, category]
 *           default: expenseDate
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
 *         description: Expenses list retrieved successfully
 */

/**
 * @swagger
 * /expenses/{id}:
 *   get:
 *     summary: Get single expense details by ID
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense MongoDB ID
 *     responses:
 *       200:
 *         description: Expense details fetched successfully
 *       404:
 *         description: Expense not found
 */

/**
 * @swagger
 * /expenses/{id}:
 *   put:
 *     summary: Update expense record by ID with optional new receipt image upload
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense MongoDB ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               category:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               expenseDate:
 *                 type: string
 *                 format: date-time
 *               receiptImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Expense record updated successfully
 *       404:
 *         description: Expense not found
 */

/**
 * @swagger
 * /expenses/{id}:
 *   delete:
 *     summary: Soft delete expense record by ID and clean up Cloudinary receipt image
 *     tags: [Expenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Expense MongoDB ID
 *     responses:
 *       200:
 *         description: Expense record soft-deleted successfully
 *       404:
 *         description: Expense not found
 */
