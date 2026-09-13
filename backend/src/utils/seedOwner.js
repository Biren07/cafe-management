import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';
import { logger } from '../config/logger.js';

/**
 * Automatically seeds the default Admin account and migrates legacy roles.
 */
export const seedDefaultOwner = async () => {
  try {
    const adminEmail = 'admin@gmail.com';
    const legacyTypoEmail = 'admin@gamil.com';
    const defaultPassword = 'admin123';

    // Migrate any legacy typo email
    const typoAdmin = await User.findOne({ email: legacyTypoEmail });
    if (typoAdmin) {
      typoAdmin.email = adminEmail;
      await typoAdmin.save();
      logger.info(`👑 Migrated legacy admin email from ${legacyTypoEmail} to ${adminEmail}`);
    }

    // Migrate any legacy role names in database
    await User.updateMany({ role: { $in: ['OWNER', 'MANAGER'] } }, { $set: { role: ROLES.ADMIN } });
    await User.updateMany({ role: 'CASHIER' }, { $set: { role: ROLES.STAFF } });

    // Check for existing Admin
    const existingAdmin = await User.findOne({
      $or: [{ email: adminEmail }, { role: ROLES.ADMIN }],
    });

    if (!existingAdmin) {
      const admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: defaultPassword,
        role: ROLES.ADMIN,
        status: 'ACTIVE',
        isActive: true,
      });

      logger.info(
        `👑 Default Admin account created successfully! Email: ${admin.email}`
      );
    } else {
      if (existingAdmin.role !== ROLES.ADMIN) {
        existingAdmin.role = ROLES.ADMIN;
        await existingAdmin.save();
      }
      logger.info(`👑 Admin account active in database: ${existingAdmin.email} (Role: ${existingAdmin.role})`);
    }
  } catch (error) {
    logger.error(`Failed to seed default Admin account: ${error.message}`);
  }
};
