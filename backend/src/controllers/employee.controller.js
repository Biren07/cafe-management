import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { RESPONSE_MESSAGES } from '../constants/responseMessages.js';
import { employeeService } from '../services/employee.service.js';

class EmployeeController {
  /**
   * Create a new Employee record (Manager & Owner)
   */
  createEmployee = asyncHandler(async (req, res) => {
    const employee = await employeeService.createEmployee(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          employee,
          RESPONSE_MESSAGES.EMPLOYEE_CREATED
        )
      );
  });

  /**
   * List employees with pagination, search, position/shift/status filters, and dynamic sorting
   */
  getEmployees = asyncHandler(async (req, res) => {
    const result = await employeeService.getEmployees(req.query);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          RESPONSE_MESSAGES.EMPLOYEES_FETCHED
        )
      );
  });

  /**
   * Get single employee profile by Mongo ID or Employee ID
   */
  getEmployeeById = asyncHandler(async (req, res) => {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          employee,
          RESPONSE_MESSAGES.EMPLOYEE_FETCHED
        )
      );
  });

  /**
   * Record or update daily attendance for an employee
   */
  recordAttendance = asyncHandler(async (req, res) => {
    const employee = await employeeService.recordAttendance(
      req.params.id,
      req.body,
      req.user._id
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          employee,
          RESPONSE_MESSAGES.ATTENDANCE_RECORDED
        )
      );
  });

  /**
   * Get attendance history for an employee
   */
  getEmployeeAttendance = asyncHandler(async (req, res) => {
    const attendance = await employeeService.getEmployeeAttendance(
      req.params.id
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          attendance,
          RESPONSE_MESSAGES.ATTENDANCE_FETCHED
        )
      );
  });

  /**
   * Update employee metadata (salary, shift, status, position, etc.)
   */
  updateEmployee = asyncHandler(async (req, res) => {
    const employee = await employeeService.updateEmployee(
      req.params.id,
      req.body
    );
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          employee,
          RESPONSE_MESSAGES.EMPLOYEE_UPDATED
        )
      );
  });

  /**
   * Delete employee record by ID (Manager & Owner)
   */
  deleteEmployee = asyncHandler(async (req, res) => {
    await employeeService.deleteEmployee(req.params.id);
    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          RESPONSE_MESSAGES.EMPLOYEE_DELETED
        )
      );
  });
}

export const employeeController = new EmployeeController();
