'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetTablesQuery,
  useUpdateTableStatusMutation,
  DiningTable,
  TableStatus,
  TableStatsBar,
  TableCard,
  TableListView,
  TableFormModal,
  DeleteTableModal,
} from '@/features/tables';
import {
  Search,
  Plus,
  Armchair,
  Filter,
  RefreshCw,
  AlertCircle,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default function TablesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TableStatus | ''>('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<DiningTable | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<DiningTable | null>(null);

  // Queries & Mutations
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetTablesQuery({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
  });

  const [updateStatus] = useUpdateTableStatusMutation();

  const allTables = response?.data?.items || [];
  const totalCount = response?.data?.total || allTables.length;

  const handleOpenCreateModal = () => {
    setSelectedTable(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (table: DiningTable) => {
    setSelectedTable(table);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (table: DiningTable) => {
    setTableToDelete(table);
    setIsDeleteModalOpen(true);
  };

  const handleStatusChange = async (tableId: string, newStatus: TableStatus) => {
    try {
      const res = await updateStatus({ id: tableId, status: newStatus }).unwrap();
      if (res.success) {
        toast.success(`Table status updated to ${newStatus}`);
      } else {
        toast.error(res.message || 'Failed to update table status');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update table status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <Armchair className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Dining Table Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Monitor seating status, change table availability, and organize hall layouts
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-400 text-xs rounded-xl cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Add Table Button (Owner & Manager ONLY) */}
          <PermissionGuard permission="tables:manage">
            <Button
              onClick={handleOpenCreateModal}
              size="sm"
              className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              <span>Add Table</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <TableStatsBar
        tables={allTables}
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
            placeholder="Search by table name or number..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as TableStatus | '');
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="AVAILABLE">Available Only</option>
              <option value="OCCUPIED">Occupied Only</option>
              <option value="CLEANING">Cleaning Only</option>
              <option value="RESERVED">Reserved Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load dining tables</p>
          <p className="text-xs text-rose-400 mt-1">
            {(error as any)?.data?.message || 'Server error occurred'}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 animate-pulse"
            />
          ))}
        </div>
      ) : viewMode === 'grid' ? (
        allTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <Armchair className="h-12 w-12 text-slate-600 mb-3" />
            <h3 className="font-heading text-base font-bold text-slate-300">No Dining Tables Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {search || statusFilter
                ? 'Try clearing your search or status filters to see available tables.'
                : 'Click "Add Table" above to create your first dining table!'}
            </p>
            {!search && !statusFilter && (
              <Button
                onClick={handleOpenCreateModal}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
              >
                <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
                Add First Table
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allTables.map((table) => (
              <TableCard
                key={table._id}
                table={table}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )
      ) : (
        <TableListView
          tables={allTables}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* Create / Edit Form Modal */}
      <TableFormModal
        isOpen={isFormModalOpen}
        table={selectedTable}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedTable(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTableModal
        isOpen={isDeleteModalOpen}
        table={tableToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setTableToDelete(null);
        }}
      />
    </div>
  );
}
