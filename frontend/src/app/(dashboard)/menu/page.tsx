'use client';

import { useState } from 'react';
import { useGetMenuItemsQuery } from '@/features/menu/services/menuApi';
import { useGetCategoriesQuery } from '@/features/categories/services/categoryApi';
import { MenuItem } from '@/types/menu';
import { MenuTable } from '@/features/menu/components/MenuTable';
import { MenuFormModal } from '@/features/menu/components/MenuFormModal';
import { DeleteMenuModal } from '@/features/menu/components/DeleteMenuModal';
import { Search, Plus, UtensilsCrossed, Filter, RefreshCw, AlertCircle } from 'lucide-react';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MenuPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Fetch categories for filter dropdown
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data?.items || [];

  const isAvailableParam =
    availabilityFilter === 'true'
      ? true
      : availabilityFilter === 'false'
      ? false
      : undefined;

  const { data: response, isLoading, isFetching, isError, error, refetch } = useGetMenuItemsQuery({
    page,
    limit,
    search: search || undefined,
    category: categoryFilter || undefined,
    isAvailable: isAvailableParam,
    sortBy,
    sortOrder,
  });

  const menuItems = response?.data?.items || [];
  const totalCount = response?.data?.total || 0;

  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleOpenCreateModal = () => {
    setSelectedItem(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setSelectedItem(item);
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-lg">
            <UtensilsCrossed className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-100">
              Menu Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage food & beverage items, prices, and prep times
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

          <PermissionGuard permission="menu:manage">
            <Button
              onClick={handleOpenCreateModal}
              size="sm"
              className="h-10 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-1.5 stroke-[2.5]" />
              <span>Add Menu Item</span>
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 backdrop-blur-xl">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search item by name..."
            className="pl-10 h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
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

          {/* Availability Filter */}
          <select
            value={availabilityFilter}
            onChange={(e) => {
              setAvailabilityFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
          >
            <option value="">All Availability</option>
            <option value="true">Available Only</option>
            <option value="false">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {isError ? (
        <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-center text-rose-300">
          <AlertCircle className="h-8 w-8 mb-2 text-rose-400" />
          <p className="font-semibold text-sm">Failed to load menu items</p>
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
        <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 animate-pulse" />
      ) : (
        /* Menu Data Table */
        <MenuTable
          data={menuItems}
          totalCount={totalCount}
          page={page}
          limit={limit}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onPageChange={setPage}
          onLimitChange={setLimit}
          onSortChange={handleSortChange}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
        />
      )}

      {/* Create / Edit Form Modal */}
      <MenuFormModal
        isOpen={isFormModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedItem(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteMenuModal
        isOpen={isDeleteModalOpen}
        item={itemToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
