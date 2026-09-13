import mongoose from 'mongoose';

/**
 * Bill Status Enum
 */
export const BILL_STATUS = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
});

export const BILL_STATUS_LIST = Object.values(BILL_STATUS);

const splitDetailSchema = new mongoose.Schema(
  {
    personIndex: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: BILL_STATUS_LIST,
      default: BILL_STATUS.PENDING,
    },
  },
  { _id: false }
);

const billHistorySchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: '',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const billingSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: [true, 'Receipt number is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
      index: true,
    },
    subtotal: {
      type: Number,
      required: true,
      min: [0, 'Subtotal cannot be negative'],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
    },
    serviceCharge: {
      type: Number,
      default: 0,
      min: [0, 'Service charge cannot be negative'],
    },
    grandTotal: {
      type: Number,
      required: true,
      min: [0, 'Grand total cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: BILL_STATUS_LIST,
        message: 'Invalid bill status: {VALUE}',
      },
      default: BILL_STATUS.PENDING,
      index: true,
    },
    isSplit: {
      type: Boolean,
      default: false,
    },
    splitCount: {
      type: Number,
      default: 1,
      min: [1, 'Split count must be at least 1'],
    },
    splitDetails: {
      type: [splitDetailSchema],
      default: [],
    },
    history: {
      type: [billHistorySchema],
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Bill creator user ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for efficient query lookups
billingSchema.index({ order: 1, status: 1 });

export const Billing = mongoose.model('Billing', billingSchema);
