import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Expense title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Expense category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Expense amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    expenseDate: {
      type: Date,
      default: Date.now,
      required: [true, 'Expense date is required'],
      index: true,
    },
    receiptImage: {
      type: String,
      trim: true,
      default: '',
    },
    receiptImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID of creator is required'],
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

// Compound Index for search, filter, and sorting optimization
expenseSchema.index({ isDeleted: 1, expenseDate: -1 });
expenseSchema.index({ isDeleted: 1, category: 1 });

export const Expense = mongoose.model('Expense', expenseSchema);
