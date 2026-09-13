import { Employee } from '../models/employee.model.js';

class EmployeeRepository {
  /**
   * Create a new Employee document
   * @param {Object} employeeData
   * @returns {Promise<Employee>}
   */
  async createEmployee(employeeData) {
    const employee = new Employee(employeeData);
    const saved = await employee.save();
    return await Employee.findById(saved._id)
      .populate('user', 'name email role status')
      .exec();
  }

  /**
   * Find Employee by Mongo ID with populated User and Attendance User references
   * @param {string} id
   * @returns {Promise<Employee|null>}
   */
  async findById(id) {
    return await Employee.findById(id)
      .populate('user', 'name email role status')
      .populate('attendance.recordedBy', 'name email role')
      .exec();
  }

  /**
   * Find Employee by Employee ID (e.g. EMP-1001)
   * @param {string} employeeId
   * @returns {Promise<Employee|null>}
   */
  async findByEmployeeId(employeeId) {
    return await Employee.findOne({ employeeId: employeeId.toUpperCase() })
      .populate('user', 'name email role status')
      .exec();
  }

  /**
   * Find Employee by Email address
   * @param {string} email
   * @returns {Promise<Employee|null>}
   */
  async findByEmail(email) {
    return await Employee.findOne({ email: email.toLowerCase() })
      .populate('user', 'name email role status')
      .exec();
  }

  /**
   * Find employees with pagination, filtering, searching, dynamic sorting, and User population
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search matching fullName, email, employeeId, or phone
   * @param {string} [options.position] - Filter by position/designation
   * @param {string} [options.shift] - Filter by shift (MORNING, EVENING, NIGHT, FULL_TIME, PART_TIME)
   * @param {string} [options.status] - Filter by status (ACTIVE, ON_LEAVE, TERMINATED, RESIGNED)
   * @param {string} [options.sortBy='createdAt'] - Field to sort by
   * @param {string} [options.sortOrder='desc'] - Sort direction ('asc' or 'desc')
   * @returns {Promise<{employees: Array<Employee>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findEmployees({
    page = 1,
    limit = 10,
    search,
    position,
    shift,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  }) {
    const query = {};

    // Position Filter
    if (position && position.trim() !== '') {
      query.position = new RegExp(position.trim(), 'i');
    }

    // Shift Filter
    if (shift) {
      query.shift = shift.toUpperCase();
    }

    // Status Filter
    if (status) {
      query.status = status.toUpperCase();
    }

    // Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { employeeId: searchRegex },
        { phone: searchRegex },
      ];
    }

    // Sorting Configuration
    const allowedSortFields = ['createdAt', 'updatedAt', 'fullName', 'salary', 'status', 'employeeId'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;
    const sortOptions = { [sortField]: sortDirection };

    // Pagination Configuration
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('user', 'name email role status')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .exec(),
      Employee.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return {
      items: employees,
      employees,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Record or update daily attendance for an employee
   * @param {string} id
   * @param {Object} attendanceEntry
   * @returns {Promise<Employee|null>}
   */
  async recordAttendance(id, attendanceEntry) {
    const employee = await Employee.findById(id);
    if (!employee) return null;

    const existingIndex = employee.attendance.findIndex(
      (a) => a.date === attendanceEntry.date
    );

    if (existingIndex !== -1) {
      // Update existing record for date
      employee.attendance[existingIndex] = {
        ...employee.attendance[existingIndex].toObject(),
        ...attendanceEntry,
      };
    } else {
      // Push new daily record
      employee.attendance.push(attendanceEntry);
    }

    await employee.save();

    return await Employee.findById(id)
      .populate('user', 'name email role status')
      .populate('attendance.recordedBy', 'name email role')
      .exec();
  }

  /**
   * Update Employee metadata
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Employee|null>}
   */
  async updateEmployee(id, updateData) {
    const employee = await Employee.findById(id);
    if (!employee) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        employee[key] = updateData[key];
      }
    });

    await employee.save();

    return await Employee.findById(id)
      .populate('user', 'name email role status')
      .exec();
  }

  /**
   * Delete Employee record by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteEmployee(id) {
    const result = await Employee.findByIdAndDelete(id).exec();
    return !!result;
  }
}

export const employeeRepository = new EmployeeRepository();
