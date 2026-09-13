'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  DollarSign,
  Plus,
  Search,
  Receipt,
  Trash2,
  Edit2,
  X,
  CheckCircle,
  Calendar,
  Tag,
} from 'lucide-react';
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useDeleteExpenseMutation,
  Expense,
} from '@/features/expenses/services/expenseApi';
import { PageGuard } from '@/components/auth/PageGuard';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/constants/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EXPENSE_CATEGORIES = [
  'Raw Materials & Grocery',
  'Dairy & Milk',
  'Bakery & Pastry Supplies',
  'Utilities (Electricity/Water/Gas)',
  'Cafe Rent',
  'Maintenance & Repairs',
  'Marketing & Advertising',
  'Packaging & Disposables',
  'Miscellaneous',
];

export default function ExpensesPage() {
  return (
    <PageGuard
      requiredRoles={[ROLES.ADMIN]}
      requiredPermission="expenses:read"
      title="Expenses Management — Admin Only"
      message="Cafe operational expenses and expenditure vouchers are restricted to the Cafe Admin."
    >
      <ExpensesContent />
    </PageGuard>
  );
}

function ExpensesContent() {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('expenses:manage');

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const { data: response, isLoading, isFetching, refetch } = useGetExpensesQuery({
    search: search || undefined,
    category: categoryFilter || undefined,
  });

  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const expensesList = response?.data?.items || [];
  const totalAmount = expensesList.reduce((acc, e) => acc + (e.amount || 0), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error('Please enter a valid expense amount.');
      return;
    }

    try {
      const res = await createExpense({
        title,
        category,
        amount: Number(amount),
        notes,
      }).unwrap();

      if (res.success) {
        toast.success(`Expense "${title}" recorded successfully!`);
        setIsModalOpen(false);
        setTitle('');
        setAmount(0);
        setNotes('');
      } else {
        toast.error(res.message || 'Failed to record expense.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to record expense.';
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (exp: Expense) => {
    if (!confirm(`Are you sure you want to delete expense "${exp.title}"?`)) return;
    try {
      const res = await deleteExpense(exp._id).unwrap();
      if (res.success) {
        toast.success('Expense record deleted successfully.');
      } else {
        toast.error(res.message || 'Failed to delete expense.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to delete expense.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-100">
              Operational Expenses
            </h1>
            <p className="text-xs text-slate-400">
              Track daily supplies, utilities, maintenance, and cafe overheads
            </p>
          </div>
        </div>

        {/* Action Button (Owner & Manager ONLY) */}
        <PermissionGuard permission="expenses:manage">
          <Button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            <span>Record Expense</span>
          </Button>
        </PermissionGuard>
      </div>

      {/* Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Vouchers</p>
          <p className="text-xl font-bold text-slate-100 mt-1">{expensesList.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Total Expenditure</p>
          <p className="text-xl font-mono font-extrabold text-amber-400 mt-1">
            Rs. {totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400">Active Filter</p>
          <p className="text-xs font-semibold text-slate-300 mt-2">
            {categoryFilter || 'All Categories'}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses by title or note..."
            className="pl-9 h-10 bg-slate-900 border-slate-800 text-xs text-slate-100 rounded-xl"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Expenses Content */}
      <div className="space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-4">Expense Title</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                {canManage && <th className="px-5 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-5 py-12 text-center text-slate-400">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-2" />
                    Loading expenses...
                  </td>
                </tr>
              ) : expensesList.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 5 : 4} className="px-5 py-12 text-center text-slate-500">
                    No expense records found.
                  </td>
                </tr>
              ) : (
                expensesList.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-100">{exp.title}</p>
                      {exp.notes && <p className="text-[11px] text-slate-400 mt-0.5">{exp.notes}</p>}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs bg-slate-800 border border-slate-700 text-slate-300">
                        <Tag className="h-3 w-3 mr-1 text-amber-400" />
                        {exp.category}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-mono font-extrabold text-amber-400 text-sm whitespace-nowrap">
                      Rs.{(exp.amount || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '—'}
                    </td>

                    {/* Actions (Owner & Manager ONLY) */}
                    {canManage && (
                      <td className="px-5 py-4 whitespace-nowrap text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(exp)}
                          disabled={isDeleting}
                          className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-400/10 cursor-pointer"
                          title="Delete Expense"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="grid grid-cols-1 gap-3 md:hidden">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center text-slate-400">
              <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent mb-2" />
              Loading expenses...
            </div>
          ) : expensesList.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-center text-xs text-slate-500">
              No expense records found.
            </div>
          ) : (
            expensesList.map((exp) => (
              <div
                key={exp._id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-100 text-sm">{exp.title}</p>
                    {exp.notes && <p className="text-[11px] text-slate-400 mt-0.5">{exp.notes}</p>}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                        <Tag className="h-2.5 w-2.5 mr-1 text-amber-400" />
                        {exp.category}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {exp.createdAt ? new Date(exp.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>

                  {canManage && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(exp)}
                      disabled={isDeleting}
                      className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 rounded-xl cursor-pointer shrink-0"
                      title="Delete Expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Expense Amount</span>
                  <span className="font-mono font-extrabold text-amber-400 text-base">
                    Rs. {(exp.amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Record Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-100">Record Expense</h3>
                  <p className="text-xs text-slate-400">Add operational cost voucher</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Vendor *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Organic Coffee Beans 10kg"
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-2.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amount (Rs.) *</label>
                  <Input
                    type="number"
                    step="0.01"
                    min={0.01}
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0.00"
                    className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Bill Ref #</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Receipt #INV-884, Paid via Cash"
                  className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs text-slate-400"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
                >
                  {isCreating ? 'Saving...' : 'Save Expense Voucher'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
