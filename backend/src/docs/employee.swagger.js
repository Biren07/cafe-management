/**
 * @swagger
 * components:
 *   schemas:
 *     CreateEmployeeInput:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - position
 *         - salary
 *       properties:
 *         fullName:
 *           type: string
 *           example: Sarah Johnson
 *         email:
 *           type: string
 *           example: sarah.johnson@cafe.com
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         position:
 *           type: string
 *           example: Head Barista
 *         salary:
 *           type: number
 *           example: 3500
 *         shift:
 *           type: string
 *           enum: [MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME]
 *           example: MORNING
 *         status:
 *           type: string
 *           enum: [ACTIVE, ON_LEAVE, TERMINATED, RESIGNED]
 *           example: ACTIVE
 *         user:
 *           type: string
 *           description: Optional linked User MongoId
 *     RecordAttendanceInput:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2026-08-05"
 *         status:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *           example: PRESENT
 *         checkIn:
 *           type: string
 *           format: date-time
 *         checkOut:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           example: Morning shift completed
 *     AttendanceRecord:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           example: "2026-08-05"
 *         status:
 *           type: string
 *           enum: [PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE]
 *           example: PRESENT
 *         checkIn:
 *           type: string
 *           format: date-time
 *         checkOut:
 *           type: string
 *           format: date-time
 *         notes:
 *           type: string
 *           example: Morning shift completed
 *         recordedBy:
 *           type: object
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 65ba112233445566778899cc
 *         employeeId:
 *           type: string
 *           example: EMP-1001
 *         user:
 *           type: object
 *         fullName:
 *           type: string
 *           example: Sarah Johnson
 *         email:
 *           type: string
 *           example: sarah.johnson@cafe.com
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         position:
 *           type: string
 *           example: Head Barista
 *         salary:
 *           type: number
 *           example: 3500
 *         shift:
 *           type: string
 *           enum: [MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME]
 *           example: MORNING
 *         status:
 *           type: string
 *           enum: [ACTIVE, ON_LEAVE, TERMINATED, RESIGNED]
 *           example: ACTIVE
 *         attendance:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttendanceRecord'
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
 *   name: Employees
 *   description: Staff & Employee HR Management (Salary, Shift, Attendance, Status)
 */

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee record (Manager & Owner)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: Duplicate employee email address
 *       403:
 *         description: Forbidden - Requires MANAGE_EMPLOYEE permission
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: List employees with pagination, search, position/shift/status filters & sorting
 *     tags: [Employees]
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
 *         description: Search by fullName, email, employeeId, or phone
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *         description: Filter by position/designation
 *       - in: query
 *         name: shift
 *         schema:
 *           type: string
 *           enum: [MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME]
 *         description: Filter by shift
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, ON_LEAVE, TERMINATED, RESIGNED]
 *         description: Filter by employee status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, fullName, salary, status, employeeId]
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
 *         description: Employees list retrieved successfully
 */

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get single employee profile details by Mongo ID or Employee ID (e.g. EMP-1001)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee MongoId or Employee ID (EMP-XXXX)
 *     responses:
 *       200:
 *         description: Employee details retrieved successfully
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /employees/{id}/attendance:
 *   post:
 *     summary: Record or update daily attendance for an employee (Manager & Owner)
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee MongoId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecordAttendanceInput'
 *     responses:
 *       200:
 *         description: Attendance recorded successfully
 *       404:
 *         description: Employee not found
 *       403:
 *         description: Forbidden - Requires MANAGE_EMPLOYEE permission
 */

/**
 * @swagger
 * /employees/{id}/attendance:
 *   get:
 *     summary: Get attendance history logs for an employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee MongoId
 *     responses:
 *       200:
 *         description: Attendance history retrieved successfully
 *       404:
 *         description: Employee not found
 */

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update employee metadata (salary, shift, status, position, etc.)
 *     tags: [Employees]
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
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               position:
 *                 type: string
 *               salary:
 *                 type: number
 *               shift:
 *                 type: string
 *                 enum: [MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, ON_LEAVE, TERMINATED, RESIGNED]
 *               user:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       404:
 *         description: Employee not found
 *       409:
 *         description: Duplicate email address
 */

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete employee record by ID (Manager & Owner ONLY)
 *     tags: [Employees]
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
 *         description: Employee record deleted successfully
 *       404:
 *         description: Employee not found
 *       403:
 *         description: Forbidden - Requires MANAGE_EMPLOYEE permission
 */
