import mongoose from 'mongoose';

/**
 * Table Status Enum
 */
export const TABLE_STATUS = Object.freeze({
  AVAILABLE: 'AVAILABLE',
  OCCUPIED: 'OCCUPIED',
  CLEANING: 'CLEANING',
  RESERVED: 'RESERVED',
});

export const TABLE_STATUS_LIST = Object.values(TABLE_STATUS);

const tableSchema = new mongoose.Schema(
  {
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
      unique: true,
      index: true,
    },
    tableName: {
      type: String,
      required: [true, 'Table name is required'],
      trim: true,
      maxlength: [100, 'Table name cannot exceed 100 characters'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1 person'],
    },
    status: {
      type: String,
      enum: {
        values: TABLE_STATUS_LIST,
        message: 'Invalid table status: {VALUE}',
      },
      default: TABLE_STATUS.AVAILABLE,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Index for efficient listing, filtering and soft-delete queries
tableSchema.index({ isDeleted: 1, status: 1, isActive: 1 });
tableSchema.index({ isDeleted: 1, tableNumber: 1 });

export const Table = mongoose.model('Table', tableSchema);
