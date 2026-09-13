import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatusCodes.js';
import { userService } from '../services/user.service.js';

class UserController {
  /**
   * Create a new staff member (Owner ONLY)
   */
  createStaff = asyncHandler(async (req, res) => {
    const staff = await userService.createStaff(req.body);
    res
      .status(HTTP_STATUS.CREATED)
      .json(
        new ApiResponse(
          HTTP_STATUS.CREATED,
          staff,
          'Staff member created successfully.'
        )
      );
  });

  /**
   * Get paginated staff list with search and filters
   */
  listStaff = asyncHandler(async (req, res) => {
    const { page, limit, search, role, status } = req.query;
    const result = await userService.listStaff({
      page,
      limit,
      search,
      role,
      status,
    });

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          result,
          'Staff list retrieved successfully.'
        )
      );
  });

  /**
   * Get single staff member details by ID
   */
  getStaffById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const staff = await userService.getStaffById(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          staff,
          'Staff profile retrieved successfully.'
        )
      );
  });

  /**
   * Update staff member details
   */
  updateStaff = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const staff = await userService.updateStaff(id, req.body);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          staff,
          'Staff profile updated successfully.'
        )
      );
  });

  /**
   * Deactivate staff account
   */
  deactivateStaff = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const staff = await userService.deactivateStaff(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          staff,
          'Staff account deactivated successfully.'
        )
      );
  });

  /**
   * Delete staff account (Owner ONLY)
   */
  deleteStaff = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteStaff(id);

    res
      .status(HTTP_STATUS.OK)
      .json(
        new ApiResponse(
          HTTP_STATUS.OK,
          null,
          'Staff member deleted successfully.'
        )
      );
  });
}

export const userController = new UserController();
