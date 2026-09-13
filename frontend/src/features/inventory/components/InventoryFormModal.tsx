'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { X, Package, CheckCircle } from 'lucide-react';
import { useGetCategoriesQuery } from '@/features/categories/services/categoryApi';
import { useCreateInventoryItemMutation, useUpdateInventoryItemMutation } from '../services/inventoryApi';
import { InventoryItem } from '../types/inventory.types';
import { inventoryFormSchema, InventoryFormData } from '../schemas/inventory.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InventoryFormModalProps {
  isOpen: boolean;
  item: InventoryItem | null;
  onClose: () => void;
}

export function InventoryFormModal({ isOpen, item, onClose }: InventoryFormModalProps) {
  const isEditing = !!item;

  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data?.items || [];

  const [createItem, { isLoading: isCreating }] = useCreateInventoryItemMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateInventoryItemMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      itemName: '',
      unit: 'Kg',
      minimumStock: 10,
      currentStock: 0,
      category: '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        itemName: item.itemName,
        unit: item.unit,
        minimumStock: item.minimumStock,
        currentStock: item.currentStock,
        category: typeof item.category === 'object' && item.category ? (item.category as any)._id : item.category || '',
      });
    } else {
      reset({
        itemName: '',
        unit: 'Kg',
        minimumStock: 10,
        currentStock: 0,
        category: '',
      });
    }
  }, [item, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: InventoryFormData) => {
    try {
      if (isEditing && item) {
        const res = await updateItem({
          id: item._id,
          body: {
            itemName: data.itemName,
            unit: data.unit,
            minimumStock: Number(data.minimumStock),
            currentStock: Number(data.currentStock),
            category: data.category || null,
          },
        }).unwrap();

        if (res.success) {
          toast.success(`Inventory item "${data.itemName}" updated successfully!`);
          onClose();
        } else {
          toast.error(res.message || 'Failed to update inventory item.');
        }
      } else {
        const res = await createItem({
          itemName: data.itemName,
          unit: data.unit,
          minimumStock: Number(data.minimumStock),
          currentStock: Number(data.currentStock),
          category: data.category || null,
        }).unwrap();

        if (res.success) {
          toast.success(`Inventory item "${data.itemName}" created successfully!`);
          onClose();
        } else {
          toast.error(res.message || 'Failed to create inventory item.');
        }
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} item.`;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Inventory Item' : 'Add Inventory Item'}
              </h2>
              <p className="text-xs text-slate-400">Configure raw material & stock thresholds</p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Item Name *
            </label>
            <Input
              {...register('itemName')}
              placeholder="e.g. Espresso Beans, Whole Milk, Sugar"
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
            {errors.itemName && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.itemName.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Unit of Measurement *
              </label>
              <Input
                {...register('unit')}
                placeholder="e.g. Kg, Liters, Packs, Bags"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.unit && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.unit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Category (Optional)
              </label>
              <select
                {...register('category')}
                className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">-- No Category --</option>
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Initial Stock Level *
              </label>
              <Input
                type="number"
                step="any"
                min={0}
                {...register('currentStock')}
                className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
              />
              {errors.currentStock && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.currentStock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Minimum Stock Alert Limit *
              </label>
              <Input
                type="number"
                step="any"
                min={0}
                {...register('minimumStock')}
                className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
              />
              {errors.minimumStock && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.minimumStock.message}</p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>{isEditing ? 'Saving...' : 'Creating...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>{isEditing ? 'Update Item' : 'Create Item'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
