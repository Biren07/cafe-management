'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetPaymentsQuery,
  useUpdatePaymentStatusMutation,
  Payment,
  PaymentMethod,
  PaymentStatus,
  PaymentStatsBar,
  PaymentTable,
  ProcessPaymentModal,
  PaymentInvoiceModal,
} from '@/features/payments';
import { Search, Plus, DollarSign, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | ''>('');
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | ''>('');

  // Modals state
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Queries & Mutations
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetPaymentsQuery({
    page,
    limit,
    search: search || undefined,
    paymentMethod: methodFilter || undefined,
    paymentStatus: statusFilter || undefined,
  });

  const [updateStatus] = useUpdatePaymentStatusMutation();

  const allPayments = response?.data?.items || [];
  const totalCount = response?.data?.total || allPayments.length;

  const handleStatusChange = async (paymentId: string, newStatus: PaymentStatus) => {
    try {
      const res = await updateStatus({ id: paymentId, paymentStatus: newStatus }).unwrap();
      if (res.success) {
        toast.success(`Payment status changed to ${newStatus}`);
      } else {
        toast.error(res.message || 'Failed to update payment status');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to update payment status';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Payment Transactions
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Track transaction history, Cash & Online payments, status updates, and digital invoices
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
            onClick={() => setIsProcessModalOpen(true)}
            size="sm"
            className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
            <span>Record Payment</span>
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <PaymentStatsBar
        payments={allPayments}
        selectedMethod={methodFilter}
        onSelectMethod={(method) => {
          setMethodFilter(method);
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
            placeholder="Search invoice #, order #, or ref #..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Method Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value as PaymentMethod | '');
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">All Payment Methods</option>
              <option value="CASH">Cash Only</option>
              <option value="ONLINE">Online Digital Only</option>
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as PaymentStatus | '');
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed Only</option>
            <option value="PENDING">Pending Only</option>
            <option value="FAILED">Failed Only</option>
            <option value="REFUNDED">Refunded Only</option>
          </select>
        </div>
      </div>

      {/* Main Payment Content */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load payment transactions</p>
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
        <PaymentTable
          payments={allPayments}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onViewInvoice={(payment) => {
            setSelectedPayment(payment);
            setIsInvoiceModalOpen(true);
          }}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Record Payment Modal */}
      <ProcessPaymentModal
        isOpen={isProcessModalOpen}
        onClose={() => setIsProcessModalOpen(false)}
      />

      {/* Invoice Modal */}
      <PaymentInvoiceModal
        isOpen={isInvoiceModalOpen}
        payment={selectedPayment}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedPayment(null);
        }}
      />
    </div>
  );
}
