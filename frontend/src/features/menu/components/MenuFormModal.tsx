'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MenuItem } from '@/types/menu';
import { Category } from '@/types/category';
import { menuItemSchema, MenuItemFormData } from '../schemas/menu.schema';
import { useCreateMenuItemMutation, useUpdateMenuItemMutation } from '../services/menuApi';
import { useGetCategoriesQuery } from '@/features/categories/services/categoryApi';
import { X, Upload, Trash2, CheckCircle, AlertCircle, Utensils, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MenuFormModalProps {
  isOpen: boolean;
  item?: MenuItem | null;
  onClose: () => void;
}

export function MenuFormModal({ isOpen, item, onClose }: MenuFormModalProps) {
  const isEditing = !!item;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  // Fetch Categories for dropdown
  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100, status: 'ACTIVE' });
  const categoriesList = categoriesResponse?.data?.items || [];

  const [createMenuItem, { isLoading: isCreating }] = useCreateMenuItemMutation();
  const [updateMenuItem, { isLoading: isUpdating }] = useUpdateMenuItemMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      isAvailable: true,
    },
  });

  const isAvailableValue = watch('isAvailable');

  useEffect(() => {
    if (isOpen) {
      if (item) {
        const categoryId =
          typeof item.category === 'object' && item.category
            ? item.category._id
            : (item.category as string) || '';
        reset({
          name: item.name || '',
          category: categoryId,
          price: item.price || 0,
          isAvailable: item.isAvailable ?? true,
        });
        setPreviewUrl(item.image || null);
        setSelectedFile(null);
      } else {
        reset({
          name: '',
          category: '',
          price: 0,
          isAvailable: true,
        });
        setPreviewUrl(null);
        setSelectedFile(null);
      }
      setServerError(null);
    }
  }, [item, isOpen, reset]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const localUrl = URL.createObjectURL(file);
      setPreviewUrl(localUrl);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const onSubmit = async (data: MenuItemFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('price', String(data.price));
    formData.append('isAvailable', String(data.isAvailable));

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (isEditing && item) {
        const response = await updateMenuItem({ id: item._id, formData }).unwrap();
        if (response.success) {
          toast.success(`Menu item "${data.name}" updated successfully!`);
          onClose();
        } else {
          setServerError(response.message || 'Failed to update menu item.');
        }
      } else {
        const response = await createMenuItem(formData).unwrap();
        if (response.success) {
          toast.success(`Menu item "${data.name}" created successfully!`);
          onClose();
        } else {
          setServerError(response.message || 'Failed to create menu item.');
        }
      }
    } catch (err: any) {
      const errorMsg = err?.data?.message || err?.message || 'Error processing request.';
      setServerError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="w-full max-w-xl my-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-800/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Utensils className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update food or beverage pricing and details'
                  : 'Add a new food or beverage item to your POS catalog'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mt-4 flex items-start space-x-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Item Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Item Name *
              </label>
              <Input
                {...register('name')}
                placeholder="e.g. Caramel Latte, Avocado Toast"
                disabled={isLoading}
                className="h-10 bg-slate-950 border-slate-800 focus:border-amber-500 text-slate-100 placeholder:text-slate-600 rounded-xl"
              />
              {errors.name && (
                <p className="text-xs font-medium text-rose-400 pl-1">{errors.name.message}</p>
              )}
            </div>

            {/* Category Select Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Category *
              </label>
              <select
                {...register('category')}
                disabled={isLoading}
                className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-100 focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                <option value="">-- Select Category --</option>
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-rose-400 pl-1">{errors.category.message}</p>
              )}
            </div>
          </div>
          {/* Price (Rs.) */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Price (Rs.) *
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-amber-500 font-bold text-xs">
                Rs.
              </div>
              <Input
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="250"
                disabled={isLoading}
                className="pl-11 h-10 bg-slate-950 border-slate-800 focus:border-amber-500 text-slate-100 placeholder:text-slate-600 rounded-xl"
              />
            </div>
            {errors.price && (
              <p className="text-xs font-medium text-rose-400 pl-1">{errors.price.message}</p>
            )}
          </div>

          {/* Availability Toggle Switch */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Item Availability Status
            </label>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setValue('isAvailable', true)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isAvailableValue
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Available</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('isAvailable', false)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  !isAvailableValue
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/40 ring-1 ring-rose-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Unavailable</span>
              </button>
            </div>
          </div>

          {/* Image Upload Dropzone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Menu Item Photo (Cloudinary Upload)
            </label>

            {previewUrl ? (
              <div className="relative flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center space-x-3">
                  <div className="relative h-14 w-14 rounded-xl border border-slate-800 overflow-hidden shrink-0">
                    <Image
                      src={previewUrl}
                      alt="Menu item preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      {selectedFile ? selectedFile.name : 'Uploaded Cloudinary Image'}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Active Cloudinary Asset'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-4 text-center hover:border-amber-500/50 transition-all cursor-pointer">
                <Upload className="h-5 w-5 text-amber-400 mb-1" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to upload menu photo
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  PNG, JPG, WEBP up to 5MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                  disabled={isLoading}
                />
              </label>
            )}
          </div>

          {/* Modal Footer */}
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
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{isEditing ? 'Update Menu Item' : 'Create Menu Item'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
