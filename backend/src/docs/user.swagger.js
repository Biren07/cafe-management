/**
 * @swagger
 * components:
 *   schemas:
 *     UserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Alex Smith
 *         email:
 *           type: string
 *           example: alex.smith@cafe.com
 *         password:
 *           type: string
 *           format: password
 *           example: UserPass123!
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         role:
 *           type: string
 *           enum: [OWNER, MANAGER, CASHIER]
 *           example: CASHIER
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: ACTIVE
 *     UpdateUserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [OWNER, MANAGER, CASHIER]
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 */

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: User Management Endpoints (Owner & Manager Permissions)
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user (Owner ONLY)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *       403:
 *         description: Forbidden - Only Owner can create users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users with pagination, filtering & search (Owner & Manager)
 *     tags: [User Management]
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
 *         description: Search query matching name, email, or phone
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [OWNER, MANAGER, CASHIER]
 *         description: Filter by role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: Paginated user list retrieved successfully
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get single user profile by ID
 *     tags: [User Management]
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
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [User Management]
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
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: User profile updated successfully
 */

/**
 * @swagger
 * /users/{id}/deactivate:
 *   patch:
 *     summary: Deactivate user account (Owner ONLY)
 *     tags: [User Management]
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
 *         description: User account deactivated
 *       403:
 *         description: Forbidden - Only Owner can deactivate users
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user account (Owner ONLY)
 *     tags: [User Management]
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
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden - Only Owner can delete users
 */
