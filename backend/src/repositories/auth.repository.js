import { User } from '../models/user.model.js';

class AuthRepository {
  /**
   * Create a new user document
   * @param {Object} userData
   * @returns {Promise<User>}
   */
  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by email
   * @param {string} email
   * @param {Object} options
   * @param {boolean} options.selectPassword - Include password in query result
   * @returns {Promise<User|null>}
   */
  async findByEmail(email, { selectPassword = false } = {}) {
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : email;
    let query = User.findOne({ email: normalizedEmail });
    if (selectPassword) {
      query = query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Find user by ID
   * @param {string} userId
   * @param {Object} options
   * @param {boolean} options.selectRefreshToken - Include refreshToken in query result
   * @returns {Promise<User|null>}
   */
  async findById(userId, { selectRefreshToken = false } = {}) {
    let query = User.findById(userId);
    if (selectRefreshToken) {
      query = query.select('+refreshToken');
    }
    return await query.exec();
  }

  /**
   * Find user by Refresh Token
   * @param {string} refreshToken
   * @returns {Promise<User|null>}
   */
  async findByRefreshToken(refreshToken) {
    return await User.findOne({ refreshToken }).select('+refreshToken').exec();
  }

  /**
   * Update user's refresh token
   * @param {string} userId
   * @param {string|null} refreshToken
   * @returns {Promise<User|null>}
   */
  async updateRefreshToken(userId, refreshToken) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: { refreshToken } },
      { new: true }
    ).exec();
  }

  /**
   * Update user's password directly (assumes already hashed or handled)
   * @param {string} userId
   * @param {string} newHashedPassword
   * @returns {Promise<User|null>}
   */
  async updatePassword(userId, newHashedPassword) {
    const user = await User.findById(userId);
    if (!user) return null;
    user.password = newHashedPassword;
    return await user.save();
  }

  /**
   * Update user profile fields
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<User|null>}
   */
  async updateProfile(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).exec();
  }
}

export const authRepository = new AuthRepository();
