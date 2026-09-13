'use client';

import toast from 'react-hot-toast';
import { Category } from '@/types/category';
import { useDeleteCategoryMutation } from '../services/categoryApi';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onClose: () => void;
}

export function DeleteCategoryModal({ isOpen, category, onClose }: DeleteCategoryModalProps) {
  const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

  if (!isOpen || !category) return null;

  const handleDelete = async () => {
    try {
      const response = await deleteCategory(category._id).unwrap();
      if (response.success) {
        toast.success(`Category "${category.name}" deleted successfully.`);
        onClose();
      } else {
        toast.error(response.message || 'Failed to delete category.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete category.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl ring-1 ring-rose-500/20 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <h3 className="font-heading text-lg font-bold text-slate-100 mb-1">
          Delete Category
        </h3>

        <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
          Are you sure you want to delete <strong className="text-amber-400">&quot;{category.name}&quot;</strong>? This action cannot be undone and will remove associated Cloudinary image assets.
        </p>

        <div className="flex items-center justify-center space-x-3">
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
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-600/20"
          >
            {isLoading ? (
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
  );
}
