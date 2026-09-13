'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import {
  QrCode,
  Upload,
  Trash2,
  CheckCircle,
  Smartphone,
  User,
  Power,
  Image as ImageIcon,
} from 'lucide-react';
import { PaymentQR, PaymentQRProvider } from '@/types/settings';
import {
  useUploadPaymentQrMutation,
  useDeletePaymentQrMutation,
} from '../services/settingsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentQrCardProps {
  provider: PaymentQRProvider;
  title: string;
  subtitle: string;
  accentColor: string;
  badgeBg: string;
  badgeBorder: string;
  textColor: string;
  existingQr?: PaymentQR;
}

export function PaymentQrCard({
  provider,
  title,
  subtitle,
  accentColor,
  badgeBg,
  badgeBorder,
  textColor,
  existingQr,
}: PaymentQrCardProps) {
  const [accountName, setAccountName] = useState(existingQr?.accountName || '');
  const [accountNumber, setAccountNumber] = useState(existingQr?.accountNumber || '');
  const [isActive, setIsActive] = useState(existingQr?.isActive ?? true);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingQr?.qrImage || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [uploadQr, { isLoading: isUploading }] = useUploadPaymentQrMutation();
  const [deleteQr, { isLoading: isDeleting }] = useDeletePaymentQrMutation();

  useEffect(() => {
    if (existingQr) {
      setAccountName(existingQr.accountName || '');
      setAccountNumber(existingQr.accountNumber || '');
      setIsActive(existingQr.isActive ?? true);
      setPreviewUrl(existingQr.qrImage || null);
      setSelectedFile(null);
    }
  }, [existingQr]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('QR image must be less than 5MB.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('provider', provider);
      formData.append('title', title);
      formData.append('accountName', accountName);
      formData.append('accountNumber', accountNumber);
      formData.append('isActive', String(isActive));

      if (selectedFile) {
        formData.append('qrImage', selectedFile);
      }

      const res = await uploadQr(formData).unwrap();
      if (res.success) {
        toast.success(`${title} QR code updated successfully!`);
        setSelectedFile(null);
      } else {
        toast.error(res.message || 'Failed to update QR code.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        `Failed to save ${title} QR code.`;
      toast.error(errorMsg);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${title} QR code?`)) return;
    try {
      const res = await deleteQr(provider).unwrap();
      if (res.success) {
        toast.success(`${title} QR code removed successfully!`);
        setPreviewUrl(null);
        setSelectedFile(null);
        setAccountName('');
        setAccountNumber('');
      } else {
        toast.error(res.message || 'Failed to remove QR code.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        `Failed to remove ${title} QR code.`;
      toast.error(errorMsg);
    }
  };

  return (
    <div className={`rounded-3xl border ${badgeBorder} bg-slate-900/90 backdrop-blur-xl p-5 shadow-2xl transition-all flex flex-col justify-between`}>
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${badgeBg} ${textColor} border ${badgeBorder} shadow-lg`}>
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading text-base font-bold text-slate-100">{title}</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeBg} ${textColor} ${badgeBorder}`}>
                  {provider}
                </span>
              </div>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>

          {/* Active Switch */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {isActive ? 'Enabled' : 'Disabled'}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
            </label>
          </div>
        </div>

        {/* QR Image Preview & Upload Area */}
        <div className="mt-4 flex flex-col items-center">
          <div className="relative group w-44 h-44 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/80 flex items-center justify-center overflow-hidden shadow-inner">
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt={`${title} QR Code`}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="text-center p-4">
                <ImageIcon className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-400">No QR Uploaded</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Upload {title} QR</p>
              </div>
            )}

            {/* Hover overlay to change image */}
            <label className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-slate-200">
              <Upload className="h-6 w-6 text-amber-400 mb-1" />
              <span className="text-xs font-bold">
                {previewUrl ? 'Replace QR Code' : 'Upload QR Code'}
              </span>
              <span className="text-[10px] text-slate-400">PNG, JPG, WebP &lt; 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {selectedFile && (
            <p className="text-[11px] text-amber-400 font-medium mt-2 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5" />
              New QR image selected (click Save to apply)
            </p>
          )}
        </div>

        {/* Account Details Form */}
        <div className="mt-5 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <User className="h-3.5 w-3.5 text-amber-400" />
              <span>Merchant / Account Name</span>
            </label>
            <Input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. Himalayan Artisan Cafe"
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center space-x-1">
              <Smartphone className="h-3.5 w-3.5 text-amber-400" />
              <span>Mobile / Merchant ID</span>
            </label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 9801234567 or MID-88421"
              className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
        {previewUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting || isUploading}
            className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span>Remove</span>
          </Button>
        ) : (
          <div />
        )}

        <Button
          type="button"
          onClick={handleSave}
          disabled={isUploading || isDeleting}
          className={`${accentColor} text-slate-950 font-bold text-xs rounded-xl shadow-lg cursor-pointer`}
        >
          {isUploading ? (
            <div className="flex items-center space-x-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              <span>Saving QR...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <CheckCircle className="h-4 w-4" />
              <span>Save {title}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
