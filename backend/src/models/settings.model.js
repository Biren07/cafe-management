import mongoose from 'mongoose';

const qrPaymentSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ['FONEPAY', 'ESEWA', 'KHALTI', 'OTHER'],
      required: [true, 'QR Provider is required'],
      uppercase: true,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: '',
    },
    qrImage: {
      type: String,
      trim: true,
      default: '',
    },
    qrImagePublicId: {
      type: String,
      trim: true,
      default: '',
    },
    accountName: {
      type: String,
      trim: true,
      default: '',
    },
    accountNumber: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const settingsSchema = new mongoose.Schema(
  {
    cafeName: {
      type: String,
      required: [true, 'Cafe name is required'],
      trim: true,
      default: 'My Artisan Cafe',
      maxlength: [150, 'Cafe name cannot exceed 150 characters'],
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    logoPublicId: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'Phone number cannot exceed 50 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Address cannot exceed 500 characters'],
    },
    vatNumber: {
      type: String,
      trim: true,
      default: '',
      maxlength: [50, 'VAT/Tax number cannot exceed 50 characters'],
    },
    currency: {
      type: String,
      trim: true,
      default: 'USD',
      maxlength: [10, 'Currency symbol/code cannot exceed 10 characters'],
    },
    receiptFooter: {
      type: String,
      trim: true,
      default: 'Thank you for dining with us! Please come again.',
      maxlength: [500, 'Receipt footer cannot exceed 500 characters'],
    },
    businessHours: {
      type: String,
      trim: true,
      default: 'Mon - Sun: 08:00 AM - 10:00 PM',
      maxlength: [200, 'Business hours cannot exceed 200 characters'],
    },
    taxPercentage: {
      type: Number,
      default: 13,
      min: [0, 'Tax percentage cannot be negative'],
      max: [100, 'Tax percentage cannot exceed 100%'],
    },
    serviceChargePercentage: {
      type: Number,
      default: 10,
      min: [0, 'Service charge percentage cannot be negative'],
      max: [100, 'Service charge percentage cannot exceed 100%'],
    },
    paymentQRs: {
      type: [qrPaymentSchema],
      default: [],
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
