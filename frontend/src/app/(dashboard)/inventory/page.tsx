'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  useGetInventoryItemsQuery,
  useDeleteInventoryItemMutation,
  InventoryItem,
  InventoryStatsBar,
  StockLevelChart,
  InventoryTable,
  InventoryFormModal,
  StockMovementModal,
  InventoryHistoryModal,
} from '@/features/inventory';
import { useGetCategoriesQuery } from '@/features/categories/services/categoryApi';
import {
  Search,
  Plus,
  Package,
  Filter,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Trash2,
  BarChart2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionGuard } from '@/components/auth/PermissionGuard';

export default function InventoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [isLowStockFilter, setIsLowStockFilter] = useState(false);
  const [showChart, setShowChart] = useState(true);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementMode, setMovementMode] = useState<'IN' | 'OUT'>('IN');

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Categories
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data?.items || [];

  // Query
  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetInventoryItemsQuery({
    page,
    limit,
    search: search || undefined,
    category: categoryFilter || undefined,
    isLowStock: isLowStockFilter || undefined,
  });

  const [deleteItem, { isLoading: isDeleting }] = useDeleteInventoryItemMutation();

  const allItems = response?.data?.items || [];
  const totalCount = response?.data?.total || allItems.length;

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleOpenStockIn = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementMode('IN');
    setIsMovementModalOpen(true);
  };

  const handleOpenStockOut = (item: InventoryItem) => {
    setSelectedItem(item);
    setMovementMode('OUT');
    setIsMovementModalOpen(true);
  };

  const handleOpenHistory = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsHistoryModalOpen(true);
  };

  const handleOpenDelete = (item: InventoryItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      const res = await deleteItem(itemToDelete._id).unwrap();
      if (res.success) {
        toast.success(`Inventory item "${itemToDelete.itemName}" deleted.`);
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        toast.error(res.message || 'Failed to delete item.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to delete item.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Inventory & Raw Materials
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage ingredients, monitor low stock alerts, log Stock In / Stock Out, and track usage history
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowChart(!showChart)}
            className="h-10 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-amber-400 text-xs rounded-xl cursor-pointer"
          >
            <BarChart2 className="h-4 w-4 mr-1.5" />
            <span>{showChart ? 'Hide Chart' : 'Show Chart'}</span>
          </Button>

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

          {/* Add Inventory Item Button (Owner & Manager ONLY) */}
          <PermissionGuard permission="inventory:manage">
            <Button
              onClick={handleOpenCreateModal}
              size="sm"
              className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              <span>Add Inventory Item</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Summary Stats */}
      <InventoryStatsBar
        items={allItems}
        isLowStockOnly={isLowStockFilter}
        onToggleLowStock={(val) => {
          setIsLowStockFilter(val);
          setPage(1);
        }}
      />

      {/* Stock Level Chart (Recharts) */}
      {showChart && allItems.length > 0 && (
        <StockLevelChart items={allItems} />
      )}

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
            placeholder="Search item name or unit..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Dropdown Filters & Low Stock Toggle */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Low Stock Toggle Pill */}
          <button
            type="button"
            onClick={() => {
              setIsLowStockFilter(!isLowStockFilter);
              setPage(1);
            }}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isLowStockFilter
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-slate-950 border border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low Stock Alerts Only</span>
          </button>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categoriesList.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Inventory Content */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load inventory items</p>
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
        <InventoryTable
          items={allItems}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onStockIn={handleOpenStockIn}
          onStockOut={handleOpenStockOut}
          onViewHistory={handleOpenHistory}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDelete}
        />
      )}

      {/* Create / Edit Form Modal */}
      <InventoryFormModal
        isOpen={isFormModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Stock Movement Modal (Stock In / Stock Out) */}
      <StockMovementModal
        isOpen={isMovementModalOpen}
        item={selectedItem}
        mode={movementMode}
        onClose={() => {
          setIsMovementModalOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Stock History Modal */}
      <InventoryHistoryModal
        isOpen={isHistoryModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsHistoryModalOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl ring-1 ring-rose-500/20 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
              <AlertTriangle className="h-7 w-7" />
            </div>

            <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
              Delete Inventory Item
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
              Are you sure you want to delete <strong className="text-amber-400">&quot;{itemToDelete.itemName}&quot;</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                disabled={isDeleting}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {isDeleting ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Confirm Delete</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
