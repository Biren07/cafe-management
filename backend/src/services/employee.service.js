import mongoose from 'mongoose';
import { employeeRepository } from '../repositories/employee.repository.js';
import { userRepository } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';

class EmployeeService {
  /**
   * Generate a unique Employee ID (e.g. EMP-1001)
   * @returns {Promise<string>}
   */
  async generateEmployeeId() {
    let employeeId = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const randomDigits = Math.floor(1000 + Math.random() * 9000);
      employeeId = `EMP-${randomDigits}`;
      const existing = await employeeRepository.findByEmployeeId(employeeId);
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      employeeId = `EMP-${Date.now().toString().slice(-4)}`;
    }

    return employeeId;
  }

  /**
   * Create a new Employee record
   * @param {Object} employeeData
   * @returns {Promise<Employee>}
   */
  async createEmployee(employeeData) {
    const {
      email,
      fullName,
      phone,
      salary,
      shift,
      status,
      createLoginAccount,
      role,
      password,
      user,
    } = employeeData;

    // Check duplicate employee email
    const existingEmail = await employeeRepository.findByEmail(email);
    if (existingEmail) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        RESPONSE_MESSAGES.EMPLOYEE_EMAIL_ALREADY_EXISTS
      );
    }

    let linkedUserId = user || null;

    // If Grant System Login Access is enabled
    if (createLoginAccount || (role && password)) {
      const assignedRole = role ? role.toUpperCase() : 'CASHIER';

      // Check if a User already exists with this email
      let existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        linkedUserId = existingUser._id;
      } else {
        if (!password || password.length < 6) {
          throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            'Password must be at least 6 characters long for staff login account.'
          );
        }

        const newUser = await userRepository.createUser({
          name: fullName,
          email: email,
          password: password,
          role: assignedRole,
          phone: phone || '',
          status: 'ACTIVE',
          isActive: true,
        });

        linkedUserId = newUser._id;
      }
    } else if (user) {
      const userExists = await userRepository.findById(user);
      if (!userExists) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Linked User account not found.'
        );
      }
      linkedUserId = user;
    }

    const employeeId = await this.generateEmployeeId();

    const created = await employeeRepository.createEmployee({
      employeeId,
      fullName,
      email,
      phone: phone || '',
      position: employeeData.position,
      salary: Math.max(0, parseFloat(salary) || 0),
      shift: shift ? shift.toUpperCase() : 'MORNING',
      status: status ? status.toUpperCase() : 'ACTIVE',
      user: linkedUserId,
    });

    return created;
  }

  /**
   * List employees with pagination, filtering, searching, and dynamic sorting
   * @param {Object} queryParams
   * @returns {Promise<Object>}
   */
  async getEmployees(queryParams) {
    return await employeeRepository.findEmployees(queryParams);
  }

  /**
   * Get single employee details by Mongo ID or Employee ID
   * @param {string} idOrEmployeeId
   * @returns {Promise<Employee>}
   */
  async getEmployeeById(idOrEmployeeId) {
    let employee = null;
    if (mongoose.Types.ObjectId.isValid(idOrEmployeeId)) {
      employee = await employeeRepository.findById(idOrEmployeeId);
    }

    if (!employee) {
      employee = await employeeRepository.findByEmployeeId(idOrEmployeeId);
    }

    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    return employee;
  }

  /**
   * Record or update daily attendance for an employee
   * @param {string} id
   * @param {Object} attendanceInput
   * @param {string} userId - User ID of manager/staff recording attendance
   * @returns {Promise<Employee>}
   */
  async recordAttendance(id, attendanceInput, userId) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    const { date, status, checkIn, checkOut, notes } = attendanceInput;

    const dateStr = date
      ? new Date(date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);

    const validStatuses = ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE'];
    const formattedStatus = status ? status.toUpperCase() : 'PRESENT';

    if (!validStatuses.includes(formattedStatus)) {
      throw new ApiError(
        HTTP_STATUS.BAD_REQUEST,
        `Attendance status must be one of: ${validStatuses.join(', ')}`
      );
    }

    const attendanceEntry = {
      date: dateStr,
      status: formattedStatus,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      notes: notes || '',
      recordedBy: userId || null,
      createdAt: new Date(),
    };

    return await employeeRepository.recordAttendance(id, attendanceEntry);
  }

  /**
   * Get attendance history for an employee
   * @param {string} id
   * @returns {Promise<Array>}
   */
  async getEmployeeAttendance(id) {
    const employee = await employeeRepository.findById(id);
    if (!employee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }
    return employee.attendance;
  }

  /**
   * Update Employee details
   * @param {string} id
   * @param {Object} updateData
   * @returns {Promise<Employee>}
   */
  async updateEmployee(id, updateData) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    // Duplicate check for Email if changing
    if (updateData.email && updateData.email.toLowerCase() !== existingEmployee.email.toLowerCase()) {
      const duplicateEmail = await employeeRepository.findByEmail(updateData.email);
      if (duplicateEmail && duplicateEmail._id.toString() !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          RESPONSE_MESSAGES.EMPLOYEE_EMAIL_ALREADY_EXISTS
        );
      }
    }

    // Validate User reference if updating
    if (updateData.user && updateData.user !== (existingEmployee.user ? existingEmployee.user._id.toString() : '')) {
      const userExists = await userRepository.findById(updateData.user);
      if (!userExists) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          'Linked User account not found.'
        );
      }
    }

    if (updateData.salary !== undefined) {
      updateData.salary = Math.max(0, parseFloat(updateData.salary) || 0);
    }

    if (updateData.shift) {
      updateData.shift = updateData.shift.toUpperCase();
    }

    if (updateData.status) {
      updateData.status = updateData.status.toUpperCase();
    }

    return await employeeRepository.updateEmployee(id, updateData);
  }

  /**
   * Delete Employee record by ID
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async deleteEmployee(id) {
    const existingEmployee = await employeeRepository.findById(id);
    if (!existingEmployee) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, RESPONSE_MESSAGES.EMPLOYEE_NOT_FOUND);
    }

    return await employeeRepository.deleteEmployee(id);
  }
}

export const employeeService = new EmployeeService();
