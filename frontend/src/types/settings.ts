import { User } from './user';

export type PaymentQRProvider = 'FONEPAY' | 'ESEWA' | 'KHALTI' | 'OTHER';

export interface PaymentQR {
  _id?: string;
  provider: PaymentQRProvider;
  title: string;
  qrImage: string;
  qrImagePublicId?: string;
  accountName: string;
  accountNumber: string;
  isActive: boolean;
}

export interface CafeSettings {
  _id: string;
  cafeName: string;
  logo?: string;
  logoPublicId?: string;
  phone?: string;
  email?: string;
  address?: string;
  vatNumber?: string;
  currency: string;
  receiptFooter?: string;
  businessHours?: string;
  taxPercentage: number;
  serviceChargePercentage: number;
  paymentQRs?: PaymentQR[];
  updatedBy?: User | string | null;
  createdAt: string;
  updatedAt: string;
}
