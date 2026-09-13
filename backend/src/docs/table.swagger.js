/**
 * @swagger
 * components:
 *   schemas:
 *     Table:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65cb4e2a1b9f8d0012a34567
 *         tableNumber:
 *           type: string
 *           example: "T-01"
 *         tableName:
 *           type: string
 *           example: "Window Table 1"
 *         capacity:
 *           type: integer
 *           example: 4
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, CLEANING, RESERVED]
 *           example: AVAILABLE
 *         description:
 *           type: string
 *           example: "Corner booth table near main window"
 *         isActive:
 *           type: boolean
 *           example: true
 *         isDeleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     TableInput:
 *       type: object
 *       required:
 *         - tableNumber
 *         - tableName
 *         - capacity
 *       properties:
 *         tableNumber:
 *           type: string
 *           example: "T-01"
 *         tableName:
 *           type: string
 *           example: "Window Table 1"
 *         capacity:
 *           type: integer
 *           example: 4
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, CLEANING, RESERVED]
 *           example: AVAILABLE
 *         description:
 *           type: string
 *           example: "Corner booth table near main window"
 *         isActive:
 *           type: boolean
 *           example: true
 *     UpdateTableInput:
 *       type: object
 *       properties:
 *         tableNumber:
 *           type: string
 *           example: "T-01"
 *         tableName:
 *           type: string
 *           example: "Window Table 1 - VIP"
 *         capacity:
 *           type: integer
 *           example: 6
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, CLEANING, RESERVED]
 *           example: CLEANING
 *         description:
 *           type: string
 *           example: "Updated description for window booth table"
 *         isActive:
 *           type: boolean
 *           example: true
 *     UpdateTableStatusInput:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, CLEANING, RESERVED]
 *           example: OCCUPIED
 */

/**
 * @swagger
 * tags:
 *   name: Table Management
 *   description: Cafe Dining Table Management Endpoints
 */

/**
 * @swagger
 * /tables:
 *   post:
 *     summary: Create a new cafe table
 *     tags: [Table Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TableInput'
 *     responses:
 *       201:
 *         description: Table created successfully
 *       400:
 *         description: Bad request or validation error
 *       409:
 *         description: Table number already exists
 */

/**
 * @swagger
 * /tables:
 *   get:
 *     summary: List all tables with pagination, search, filtering & sorting
 *     tags: [Table Management]
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
 *         description: Search matching tableName, tableNumber, or description
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, OCCUPIED, CLEANING, RESERVED]
 *         description: Filter by status
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *         description: Filter by minimum seating capacity
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: tableNumber
 *         description: Field to sort by (tableNumber, tableName, capacity, status, createdAt)
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: Paginated table list retrieved successfully
 */

/**
 * @swagger
 * /tables/{id}:
 *   get:
 *     summary: Get single table details by ID
 *     tags: [Table Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table details retrieved successfully
 *       404:
 *         description: Table not found
 */

/**
 * @swagger
 * /tables/{id}:
 *   put:
 *     summary: Update table details
 *     tags: [Table Management]
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
 *             $ref: '#/components/schemas/UpdateTableInput'
 *     responses:
 *       200:
 *         description: Table updated successfully
 *       400:
 *         description: Bad request or validation error
 *       404:
 *         description: Table not found
 *       409:
 *         description: Duplicate table number
 */

/**
 * @swagger
 * /tables/{id}/status:
 *   patch:
 *     summary: Update table status
 *     tags: [Table Management]
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
 *             $ref: '#/components/schemas/UpdateTableStatusInput'
 *     responses:
 *       200:
 *         description: Table status updated successfully
 *       400:
 *         description: Cannot occupy an inactive table or invalid status
 *       404:
 *         description: Table not found
 */

/**
 * @swagger
 * /tables/{id}:
 *   delete:
 *     summary: Delete table (Soft delete)
 *     tags: [Table Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Table deleted successfully
 *       400:
 *         description: Cannot delete an occupied table
 *       404:
 *         description: Table not found
 */
