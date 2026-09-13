/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba987654321fedcba09876
 *         name:
 *           type: string
 *           example: Iced Caramel Macchiato
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *               example: Beverages
 *             slug:
 *               type: string
 *               example: beverages
 *             image:
 *               type: string
 *         description:
 *           type: string
 *           example: Rich espresso combined with vanilla syrup, milk, and caramel drizzle
 *         price:
 *           type: number
 *           example: 4.99
 *         preparationTime:
 *           type: integer
 *           example: 5
 *         isAvailable:
 *           type: boolean
 *           example: true
 *         image:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/v12345/menu/macchiato.jpg
 *         imagePublicId:
 *           type: string
 *           example: menu/macchiato
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
 *   name: Menu
 *   description: Menu Item Management Endpoints
 */

/**
 * @swagger
 * /menu:
 *   post:
 *     summary: Create a new menu item with Category reference & Cloudinary image upload (Manager & Owner)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Iced Caramel Macchiato
 *               category:
 *                 type: string
 *                 description: Valid Category ObjectId
 *                 example: 65ba123456789abcdef01234
 *               description:
 *                 type: string
 *                 example: Rich espresso combined with vanilla syrup, milk, and caramel drizzle
 *               price:
 *                 type: number
 *                 example: 4.99
 *               preparationTime:
 *                 type: integer
 *                 example: 5
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, WEBP, max 5MB)
 *     responses:
 *       201:
 *         description: Menu item created successfully
 *       400:
 *         description: Validation Error or invalid Category ID
 *       409:
 *         description: Duplicate Menu Item name
 *       403:
 *         description: Forbidden - Requires MANAGE_MENU permission
 */

/**
 * @swagger
 * /menu:
 *   get:
 *     summary: Retrieve menu items list with pagination, search, category filter, price filter, sorting & populated Category
 *     tags: [Menu]
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
 *         description: Search by item name or description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by Category MongoId
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by availability status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price threshold
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price threshold
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, price, name, preparationTime]
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
 *         description: Menu items list retrieved successfully
 */

/**
 * @swagger
 * /menu/{id}:
 *   get:
 *     summary: Get single menu item details by ID with populated Category
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item MongoId
 *     responses:
 *       200:
 *         description: Menu item details retrieved successfully
 *       404:
 *         description: Menu item not found
 */

/**
 * @swagger
 * /menu/{id}:
 *   put:
 *     summary: Update menu item by ID (Manager & Owner)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item MongoId
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               preparationTime:
 *                 type: integer
 *               isAvailable:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 *       404:
 *         description: Menu item or category not found
 *       409:
 *         description: Duplicate menu item name
 *       403:
 *         description: Forbidden - Requires MANAGE_MENU permission
 */

/**
 * @swagger
 * /menu/{id}:
 *   delete:
 *     summary: Delete menu item by ID (Manager & Owner)
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Menu Item MongoId
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 *       404:
 *         description: Menu item not found
 *       403:
 *         description: Forbidden - Requires MANAGE_MENU permission
 */
