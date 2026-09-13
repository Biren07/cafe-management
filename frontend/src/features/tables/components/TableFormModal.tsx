'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { X, Armchair, Hash, Users, FileText, CheckCircle } from 'lucide-react';
import { DiningTable } from '../types/table.types';
import { tableSchema, TableFormData } from '../schemas/table.schema';
import { useCreateTableMutation, useUpdateTableMutation } from '../services/tableApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableFormModalProps {
  isOpen: boolean;
  table: DiningTable | null;
  onClose: () => void;
}

export function TableFormModal({ isOpen, table, onClose }: TableFormModalProps) {
  const isEditing = !!table;

  const [createTable, { isLoading: isCreating }] = useCreateTableMutation();
  const [updateTable, { isLoading: isUpdating }] = useUpdateTableMutation();

  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      tableNumber: '',
      tableName: '',
      capacity: 4,
      status: 'AVAILABLE',
      description: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (table) {
      reset({
        tableNumber: table.tableNumber,
        tableName: table.tableName,
        capacity: table.capacity,
        status: table.status,
        description: table.description || '',
        isActive: table.isActive ?? true,
      });
    } else {
      reset({
        tableNumber: '',
        tableName: '',
        capacity: 4,
        status: 'AVAILABLE',
        description: '',
        isActive: true,
      });
    }
  }, [table, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: TableFormData) => {
    try {
      if (isEditing && table) {
        const response = await updateTable({
          id: table._id,
          body: {
            tableNumber: data.tableNumber,
            tableName: data.tableName,
            capacity: Number(data.capacity),
            status: data.status,
            description: data.description || undefined,
            isActive: data.isActive,
          },
        }).unwrap();

        if (response.success) {
          toast.success(`Table "${data.tableName}" updated successfully!`);
          onClose();
        } else {
          toast.error(response.message || 'Failed to update table.');
        }
      } else {
        const response = await createTable({
          tableNumber: data.tableNumber,
          tableName: data.tableName,
          capacity: Number(data.capacity),
          status: data.status,
          description: data.description || undefined,
          isActive: data.isActive,
        }).unwrap();

        if (response.success) {
          toast.success(`Table "${data.tableName}" created successfully!`);
          onClose();
        } else {
          toast.error(response.message || 'Failed to create table.');
        }
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} table.`;
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Armchair className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Dining Table' : 'Add New Dining Table'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing ? 'Modify table configuration and status' : 'Add a new seating area or dining table'}
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Table Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Hash className="h-3.5 w-3.5 text-amber-400" />
                <span>Table Number *</span>
              </label>
              <Input
                {...register('tableNumber')}
                placeholder="e.g. T-01 or A1"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.tableNumber && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.tableNumber.message}</p>
              )}
            </div>

            {/* Capacity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>Capacity (Seats) *</span>
              </label>
              <Input
                type="number"
                min={1}
                max={50}
                {...register('capacity')}
                placeholder="e.g. 4"
                className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
              />
              {errors.capacity && (
                <p className="text-[11px] text-rose-400 mt-1">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          {/* Table Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Table Name / Location *
            </label>
            <Input
              {...register('tableName')}
              placeholder="e.g. Patio Corner Table, Main Hall #4"
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
            {errors.tableName && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.tableName.message}</p>
            )}
          </div>

          {/* Status Select */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Current Status
            </label>
            <select
              {...register('status')}
              className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="AVAILABLE">AVAILABLE (Green)</option>
              <option value="OCCUPIED">OCCUPIED (Amber)</option>
              <option value="CLEANING">CLEANING (Blue)</option>
              <option value="RESERVED">RESERVED (Purple)</option>
            </select>
            {errors.status && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.status.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Description / Notes (Optional)</span>
            </label>
            <textarea
              {...register('description')}
              rows={2}
              placeholder="e.g. Near window with garden view, quiet area"
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Active Switch */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-xs text-slate-300 cursor-pointer select-none">
              Mark table as active & operational
            </label>
          </div>

          {/* Actions */}
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
                  <span>{isEditing ? 'Update Table' : 'Create Table'}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
