import { User } from '../models/user.model.js';

class UserRepository {
  /**
   * Create a new staff/user document
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by ID
   * @param {string} userId
   * @returns {Promise<User|null>}
   */
  async findById(userId) {
    return await User.findById(userId).exec();
  }

  /**
   * Find user by Email
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  async findByEmail(email) {
    return await User.findOne({ email }).exec();
  }

  /**
   * Find staff members with pagination, filtering, and search
   * @param {Object} options
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {string} [options.search] - Search by name, email, or phone
   * @param {string} [options.role] - Filter by role (OWNER, MANAGER, CASHIER)
   * @param {string} [options.status] - Filter by status (ACTIVE, INACTIVE)
   * @returns {Promise<{users: Array<User>, total: number, page: number, limit: number, totalPages: number}>}
   */
  async findStaff({ page = 1, limit = 10, search, role, status }) {
    const query = {};

    // Filter by Role
    if (role) {
      query.role = role.toUpperCase();
    }

    // Filter by Status
    if (status) {
      query.status = status.toUpperCase();
    }

    // Search by Name, Email, or Phone (case-insensitive regex)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).exec(),
      User.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    const publicUsers = users.map((u) => u.toPublicProfile());
    return {
      items: publicUsers,
      users: publicUsers,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
    };
  }

  /**
   * Update user details
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<User|null>}
   */
  async updateUser(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) return null;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        user[key] = updateData[key];
      }
    });

    if (updateData.status) {
      user.isActive = updateData.status === 'ACTIVE';
    }

    await user.save();
    return user;
  }

  /**
   * Deactivate staff user
   * @param {string} userId
   * @returns {Promise<User|null>}
   */
  async deactivateUser(userId) {
    const user = await User.findById(userId);
    if (!user) return null;

    user.status = 'INACTIVE';
    user.isActive = false;
    await user.save();
    return user;
  }

  /**
   * Delete staff user by ID
   * @param {string} userId
   * @returns {Promise<boolean>}
   */
  async deleteUser(userId) {
    const result = await User.findByIdAndDelete(userId).exec();
    return !!result;
  }
}

export const userRepository = new UserRepository();
