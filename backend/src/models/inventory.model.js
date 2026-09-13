import mongoose from 'mongoose';

const inventoryHistorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['IN', 'OUT', 'ADJUSTMENT'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Inventory item name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Item name cannot exceed 100 characters'],
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    unit: {
      type: String,
      required: [true, 'Unit of measurement is required'],
      trim: true,
      maxlength: [30, 'Unit cannot exceed 30 characters'],
    },
    minimumStock: {
      type: Number,
      default: 0,
      min: [0, 'Minimum stock cannot be negative'],
    },
    currentStock: {
      type: Number,
      default: 0,
      min: [0, 'Current stock cannot be negative'],
    },
    isLowStock: {
      type: Boolean,
      default: false,
      index: true,
    },
    history: {
      type: [inventoryHistorySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to keep isLowStock updated
 */
inventorySchema.pre('save', function (next) {
  this.isLowStock = this.currentStock <= this.minimumStock;
  next();
});

export const Inventory = mongoose.model('Inventory', inventorySchema);
