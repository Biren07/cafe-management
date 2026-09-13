/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba123456789abcdef01234
 *         name:
 *           type: string
 *           example: Hot Beverages
 *         slug:
 *           type: string
 *           example: hot-beverages
 *         description:
 *           type: string
 *           example: Freshly brewed teas, coffees, and hot drinks
 *         image:
 *           type: string
 *           example: https://res.cloudinary.com/demo/image/upload/v12345/categories/beverages.jpg
 *         imagePublicId:
 *           type: string
 *           example: categories/beverages
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: ACTIVE
 *         isActive:
 *           type: boolean
 *           example: true
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
 *   name: Categories
 *   description: Category Management Endpoints
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category with optional image upload
 *     tags: [Categories]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Hot Beverages
 *               description:
 *                 type: string
 *                 example: Freshly brewed teas, coffees, and hot drinks
 *               slug:
 *                 type: string
 *                 example: hot-beverages
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *                 example: ACTIVE
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPEG, PNG, WEBP, max 5MB)
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation Error or bad request
 *       409:
 *         description: Duplicate Category name or slug
 *       403:
 *         description: Forbidden - Insufficient permissions
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get paginated list of categories with search, filtering & sorting
 *     tags: [Categories]
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
 *         description: Search by name, description, or slug
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, status, slug]
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
 *         description: Categories retrieved successfully
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get single category details by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ID
 *     responses:
 *       200:
 *         description: Category details retrieved successfully
 *       404:
 *         description: Category not found
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Update category by ID with optional new image upload
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ID
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               slug:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 *       409:
 *         description: Duplicate category name or slug
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete category by ID and remove image from Cloudinary
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category MongoDB ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
