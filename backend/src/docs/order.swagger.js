/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItemInput:
 *       type: object
 *       required:
 *         - menuItem
 *         - quantity
 *       properties:
 *         menuItem:
 *           type: string
 *           description: MongoId of MenuItem
 *           example: 65ba987654321fedcba09876
 *         quantity:
 *           type: integer
 *           example: 2
 *     CreateOrderInput:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         orderType:
 *           type: string
 *           enum: [DINE_IN, TAKE_AWAY]
 *           example: DINE_IN
 *         table:
 *           type: string
 *           description: MongoId of Table (Required for DINE_IN, null/omitted for TAKE_AWAY)
 *           example: 65cb4e2a1b9f8d0012a34567
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemInput'
 *         tax:
 *           type: number
 *           example: 1.00
 *         discount:
 *           type: number
 *           example: 0.50
 *         serviceCharge:
 *           type: number
 *           example: 0.50
 *         notes:
 *           type: string
 *           example: Extra hot with oat milk
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba112233445566778899aa
 *         orderNumber:
 *           type: string
 *           example: ORD-20260805-4829
 *         orderType:
 *           type: string
 *           enum: [DINE_IN, TAKE_AWAY]
 *           example: DINE_IN
 *         table:
 *           type: object
 *           description: Populated Table details
 *           properties:
 *             _id:
 *               type: string
 *             tableNumber:
 *               type: string
 *               example: "T-01"
 *             tableName:
 *               type: string
 *               example: "Window Table 1"
 *             capacity:
 *               type: integer
 *               example: 4
 *             status:
 *               type: string
 *               example: "OCCUPIED"
 *             isActive:
 *               type: boolean
 *               example: true
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               menuItem:
 *                 type: object
 *               name:
 *                 type: string
 *                 example: Iced Caramel Macchiato
 *               price:
 *                 type: number
 *                 example: 4.99
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               subtotal:
 *                 type: number
 *                 example: 9.98
 *         subtotal:
 *           type: number
 *           example: 9.98
 *         tax:
 *           type: number
 *           example: 1.00
 *         discount:
 *           type: number
 *           example: 0.50
 *         serviceCharge:
 *           type: number
 *           example: 0.50
 *         total:
 *           type: number
 *           example: 10.98
 *         status:
 *           type: string
 *           enum: [PENDING, PREPARING, SERVED, COMPLETED, CANCELLED]
 *           example: PENDING
 *         notes:
 *           type: string
 *           example: Extra hot with oat milk
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
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order Processing & Management (Cashier, Manager, Owner)
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order with auto-generated orderNumber & total calculations (Cashier, Manager, Owner)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error, unavailable menu item, occupied table, or inactive table
 *       403:
 *         description: Forbidden - Requires CREATE_ORDER permission
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve list of orders with pagination, search, status filter, orderType filter, date range & sorting
 *     tags: [Orders]
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
 *         description: Search by orderNumber or notes
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PREPARING, SERVED, COMPLETED, CANCELLED]
 *         description: Filter by order status
 *       - in: query
 *         name: orderType
 *         schema:
 *           type: string
 *           enum: [DINE_IN, TAKE_AWAY]
 *         description: Filter by order type
 *       - in: query
 *         name: table
 *         schema:
 *           type: string
 *         description: Filter by Table MongoId
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
 *           enum: [createdAt, updatedAt, total, status, orderNumber]
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
 *         description: Orders list retrieved successfully
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get single order details by Mongo ID or Order Number
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order MongoId or Order Number (e.g. ORD-20260805-4829)
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status workflow (Manager & Owner). Automatically frees up Table to AVAILABLE upon COMPLETED or CANCELLED status.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order MongoId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, PREPARING, SERVED, COMPLETED, CANCELLED]
 *                 example: COMPLETED
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - Requires MANAGE_ORDERS permission
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update order items or financial fields (Manager & Owner)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderType:
 *                 type: string
 *                 enum: [DINE_IN, TAKE_AWAY]
 *               table:
 *                 type: string
 *                 description: MongoId of Table
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItemInput'
 *               tax:
 *                 type: number
 *               discount:
 *                 type: number
 *               serviceCharge:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete order by ID (Manager & Owner ONLY)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order MongoId
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       403:
 *         description: Forbidden - Requires MANAGE_ORDERS permission
 */
