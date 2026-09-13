/**
 * @swagger
 * components:
 *   schemas:
 *     CreateInventoryInput:
 *       type: object
 *       required:
 *         - itemName
 *         - unit
 *       properties:
 *         itemName:
 *           type: string
 *           example: Arabica Coffee Beans
 *         unit:
 *           type: string
 *           example: kg
 *         minimumStock:
 *           type: number
 *           example: 10
 *         currentStock:
 *           type: number
 *           example: 50
 *         category:
 *           type: string
 *           description: MongoId of Category
 *           example: 65ba123456789abcdef01234
 *     StockMovementInput:
 *       type: object
 *       required:
 *         - quantity
 *       properties:
 *         quantity:
 *           type: number
 *           example: 15
 *         reason:
 *           type: string
 *           example: Supplier Restock shipment #1042
 *     InventoryHistory:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [IN, OUT, ADJUSTMENT]
 *           example: IN
 *         quantity:
 *           type: number
 *           example: 15
 *         previousStock:
 *           type: number
 *           example: 50
 *         newStock:
 *           type: number
 *           example: 65
 *         reason:
 *           type: string
 *           example: Supplier Restock
 *         performedBy:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *     InventoryItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba8877665544332211aabb
 *         itemName:
 *           type: string
 *           example: Arabica Coffee Beans
 *         category:
 *           type: object
 *         unit:
 *           type: string
 *           example: kg
 *         minimumStock:
 *           type: number
 *           example: 10
 *         currentStock:
 *           type: number
 *           example: 65
 *         isLowStock:
 *           type: boolean
 *           example: false
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/InventoryHistory'
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
 *   name: Inventory
 *   description: Inventory Stock Management (Manager & Owner Permissions)
 */

/**
 * @swagger
 * /inventory:
 *   post:
 *     summary: Add new inventory item (Manager & Owner)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateInventoryInput'
 *     responses:
 *       201:
 *         description: Inventory item added successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate inventory item name
 *       403:
 *         description: Forbidden - Requires MANAGE_INVENTORY permission
 */

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Retrieve list of inventory items with pagination, search, filters & dynamic sorting
 *     tags: [Inventory]
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
 *         description: Search by itemName or unit
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by Category MongoId
 *       - in: query
 *         name: isLowStock
 *         schema:
 *           type: boolean
 *         description: Filter by low stock status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, itemName, currentStock, minimumStock]
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
 *         description: Inventory items list retrieved successfully
 */

/**
 * @swagger
 * /inventory/low-stock:
 *   get:
 *     summary: Get items requiring reordering (currentStock <= minimumStock)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Low stock items list retrieved successfully
 */

/**
 * @swagger
 * /inventory/{id}:
 *   get:
 *     summary: Get single inventory item details by ID
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory Item MongoId
 *     responses:
 *       200:
 *         description: Inventory item details retrieved successfully
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}/history:
 *   get:
 *     summary: Get transaction history logs for an inventory item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Inventory Item MongoId
 *     responses:
 *       200:
 *         description: Item stock movement history retrieved successfully
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}/stock-in:
 *   post:
 *     summary: Record Stock In movement (Add stock & log transaction)
 *     tags: [Inventory]
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
 *             $ref: '#/components/schemas/StockMovementInput'
 *     responses:
 *       200:
 *         description: Stock In recorded successfully
 *       404:
 *         description: Inventory item not found
 *       403:
 *         description: Forbidden - Requires MANAGE_INVENTORY permission
 */

/**
 * @swagger
 * /inventory/{id}/stock-out:
 *   post:
 *     summary: Record Stock Out movement (Reduce stock & log transaction)
 *     tags: [Inventory]
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
 *             $ref: '#/components/schemas/StockMovementInput'
 *     responses:
 *       200:
 *         description: Stock Out recorded successfully
 *       400:
 *         description: Insufficient stock available
 *       404:
 *         description: Inventory item not found
 *       403:
 *         description: Forbidden - Requires MANAGE_INVENTORY permission
 */

/**
 * @swagger
 * /inventory/{id}:
 *   put:
 *     summary: Update inventory item metadata (Manager & Owner)
 *     tags: [Inventory]
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
 *               itemName:
 *                 type: string
 *               unit:
 *                 type: string
 *               minimumStock:
 *                 type: number
 *               currentStock:
 *                 type: number
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inventory item updated successfully
 *       404:
 *         description: Inventory item not found
 */

/**
 * @swagger
 * /inventory/{id}:
 *   delete:
 *     summary: Delete inventory item by ID (Manager & Owner ONLY)
 *     tags: [Inventory]
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
 *         description: Inventory item deleted successfully
 *       404:
 *         description: Inventory item not found
 *       403:
 *         description: Forbidden - Requires MANAGE_INVENTORY permission
 */
