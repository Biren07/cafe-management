'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetBillsQuery,
  useUpdateBillStatusMutation,
  Bill,
  BillStatus,
  BillingStatsBar,
  BillingTable,
  GenerateBillModal,
  PrintReceiptModal,
  SplitBillModal,
} from '@/features/billing';
import { Search, Plus, Receipt, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageGuard } from '@/components/auth/PageGuard';
import { ROLES } from '@/constants/permissions';

export default function BillingPage() {
  return (
    <PageGuard
      requiredRoles={[ROLES.ADMIN]}
      title="Billing & Invoices — Management Only"
      message="Billing invoices and settlement summaries are accessible only by the Cafe Admin."
    >
      <BillingContent />
    </PageGuard>
  );
}

function BillingContent() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BillStatus | ''>('');

  // Modals state
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  // Queries & Mutations
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetBillsQuery({
    page,
    limit,
    status: statusFilter || undefined,
  });

  const [updateStatus] = useUpdateBillStatusMutation();

  const allBills = response?.data?.items || [];
  const totalCount = response?.data?.total || allBills.length;

  const handleStatusChange = async (billId: string, newStatus: BillStatus) => {
    try {
      const res = await updateStatus({ id: billId, status: newStatus }).unwrap();
      if (res.success) {
        toast.success(`Bill status updated to ${newStatus}`);
      } else {
        toast.error(res.message || 'Failed to update bill status');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to update bill status';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Billing & Invoicing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Generate invoices, print thermal receipts, manage splits, and track payment status
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-400 text-xs rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
            <span>Refresh</span>
          </Button>

          <Button
            onClick={() => {
              setSelectedBill(null);
              setIsGenerateModalOpen(true);
            }}
            size="sm"
            className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
            <span>Generate Bill</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <BillingStatsBar
        bills={allBills}
        selectedStatus={statusFilter}
        onSelectStatus={(status) => {
          setStatusFilter(status);
          setPage(1);
        }}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by receipt number..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as BillStatus | '');
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid Only</option>
            <option value="PENDING">Pending / Unpaid Only</option>
            <option value="CANCELLED">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Main Billing Table */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load billing invoices</p>
          <p className="text-xs text-rose-400 mt-1">
            {(error as { data?: { message?: string } })?.data?.message || 'Server error occurred'}
          </p>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="mt-4 border-rose-500/30 bg-slate-900 text-xs rounded-xl"
          >
            Retry
          </Button>
        </div>
      ) : isLoading ? (
        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 animate-pulse" />
      ) : (
        <BillingTable
          bills={allBills}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onPrint={(bill) => {
            setSelectedBill(bill);
            setIsPrintModalOpen(true);
          }}
          onSplit={(bill) => {
            setSelectedBill(bill);
            setIsSplitModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Generate Bill Modal */}
      <GenerateBillModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
      />

      {/* Print Receipt Modal */}
      <PrintReceiptModal
        isOpen={isPrintModalOpen}
        bill={selectedBill}
        onClose={() => {
          setIsPrintModalOpen(false);
          setSelectedBill(null);
        }}
      />

      {/* Split Bill Modal */}
      <SplitBillModal
        isOpen={isSplitModalOpen}
        bill={selectedBill}
        onClose={() => {
          setIsSplitModalOpen(false);
          setSelectedBill(null);
        }}
      />
    </div>
  );
}
