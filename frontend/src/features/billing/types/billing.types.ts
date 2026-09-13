import { Bill, BillStatus, SplitDetail } from '@/types/billing';

export type { Bill, BillStatus, SplitDetail };

export interface BillQueryParams {
  page?: number;
  limit?: number;
  status?: BillStatus;
  isSplit?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GenerateBillInput {
  order: string;
  tax?: number;
  discount?: number;
  serviceCharge?: number;
}

export interface UpdateBillStatusInput {
  id: string;
  status: BillStatus;
}

export interface SplitBillInput {
  id: string;
  splitCount: number;
  customAmounts?: number[];
}
