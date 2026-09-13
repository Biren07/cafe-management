'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { Category } from '@/types/category';
import { categorySchema, CategoryFormData } from '../schemas/category.schema';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../services/categoryApi';
import { X, Upload, Trash2, CheckCircle, AlertCircle, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryFormModalProps {
  isOpen: boolean;
  category?: Category | null;
  onClose: () => void;
}

export function CategoryFormModal({ isOpen, category, onClose }: CategoryFormModalProps) {
  const isEditing = !!category;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const isLoading = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      status: 'ACTIVE',
    },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          name: category.name || '',
          status: category.status || 'ACTIVE',
        });
        setPreviewUrl(category.image || null);
        setSelectedFile(null);
      } else {
        reset({
          name: '',
          status: 'ACTIVE',
        });
        setPreviewUrl(null);
        setSelectedFile(null);
      }
      setServerError(null);
    }
  }, [category, isOpen, reset]);

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

  const onSubmit = async (data: CategoryFormData) => {
    setServerError(null);

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('status', data.status);

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (isEditing && category) {
        const response = await updateCategory({ id: category._id, formData }).unwrap();
        if (response.success) {
          toast.success(`Category "${data.name}" updated successfully!`);
          onClose();
        } else {
          setServerError(response.message || 'Failed to update category.');
        }
      } else {
        const response = await createCategory(formData).unwrap();
        if (response.success) {
          toast.success(`Category "${data.name}" created successfully!`);
          onClose();
        } else {
          setServerError(response.message || 'Failed to create category.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl ring-1 ring-slate-800/80 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Grid className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-slate-100">
                {isEditing ? 'Edit Category' : 'Create New Category'}
              </h3>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? 'Update food or beverage category details'
                  : 'Add a new category to organize your menu'}
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

        {/* Server Error */}
        {serverError && (
          <div className="mt-4 flex items-start space-x-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          {/* Category Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Category Name *
            </label>
            <Input
              {...register('name')}
              placeholder="e.g. Hot Beverages, Pastries, Desserts"
              disabled={isLoading}
              className="h-10 bg-slate-950 border-slate-800 focus:border-amber-500 text-slate-100 placeholder:text-slate-600 rounded-xl"
            />
            {errors.name && (
              <p className="text-xs font-medium text-rose-400 pl-1">{errors.name.message}</p>
            )}
          </div>

          {/* Status Toggle */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Category Status
            </label>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setValue('status', 'ACTIVE')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  statusValue === 'ACTIVE'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/20'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>Active</span>
              </button>

              <button
                type="button"
                onClick={() => setValue('status', 'INACTIVE')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  statusValue === 'INACTIVE'
                    ? 'bg-slate-800 text-slate-300 border-slate-700'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span>Inactive</span>
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Category Image (Cloudinary)
            </label>

            {previewUrl ? (
              <div className="relative flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-3">
                <div className="flex items-center space-x-3">
                  <div className="relative h-14 w-14 rounded-xl border border-slate-800 overflow-hidden shrink-0">
                    <Image
                      src={previewUrl}
                      alt="Category preview"
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
              <label className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-950/60 p-5 text-center hover:border-amber-500/50 transition-all cursor-pointer">
                <Upload className="h-6 w-6 text-amber-400 mb-2" />
                <span className="text-xs font-semibold text-slate-200">
                  Click to upload image
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
                <span>{isEditing ? 'Update Category' : 'Create Category'}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
