'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  X,
  DollarSign,
  Banknote,
  CreditCard,
  ShoppingBag,
  CheckCircle,
  Hash,
  QrCode,
  Copy,
  ExternalLink,
  Smartphone,
  User,
  AlertCircle,
} from 'lucide-react';
import { useGetOrdersQuery } from '@/features/orders/services/orderApi';
import { useGetSettingsQuery } from '@/features/settings/services/settingsApi';
import { useProcessPaymentMutation } from '../services/paymentApi';
import { PaymentMethod, PaymentStatus } from '../types/payment.types';
import { PaymentQRProvider } from '@/types/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface ProcessPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROVIDER_CONFIG: Record<
  PaymentQRProvider,
  {
    name: string;
    badgeBg: string;
    badgeBorder: string;
    textColor: string;
    activeBorder: string;
    activeBg: string;
    placeholder: string;
  }
> = {
  FONEPAY: {
    name: 'Fonepay',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/30',
    textColor: 'text-red-400',
    activeBorder: 'border-red-500',
    activeBg: 'bg-red-500/15',
    placeholder: 'e.g. FONEPAY-98421 or Bank Txn Ref',
  },
  ESEWA: {
    name: 'eSewa',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    activeBorder: 'border-emerald-500',
    activeBg: 'bg-emerald-500/15',
    placeholder: 'e.g. ESEWA-88412 or Wallet Txn ID',
  },
  KHALTI: {
    name: 'Khalti',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/30',
    textColor: 'text-purple-400',
    activeBorder: 'border-purple-500',
    activeBg: 'bg-purple-500/15',
    placeholder: 'e.g. KHALTI-55201 or Token ID',
  },
  OTHER: {
    name: 'Other QR',
    badgeBg: 'bg-sky-500/10',
    badgeBorder: 'border-sky-500/30',
    textColor: 'text-sky-400',
    activeBorder: 'border-sky-500',
    activeBg: 'bg-sky-500/15',
    placeholder: 'e.g. Bank Reference / Slip ID',
  },
};

export function ProcessPaymentModal({ isOpen, onClose }: ProcessPaymentModalProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [onlineProvider, setOnlineProvider] = useState<PaymentQRProvider>('FONEPAY');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('COMPLETED');
  const [amount, setAmount] = useState<number>(0);
  const [referenceNumber, setReferenceNumber] = useState<string>('');

  // Fetch active orders & store settings for QR codes
  const { data: ordersResponse } = useGetOrdersQuery({ limit: 100 });
  const ordersList = ordersResponse?.data?.items || [];
  const activeOrders = ordersList.filter((o) => o.status !== 'CANCELLED');

  const { data: settingsResponse } = useGetSettingsQuery();
  const paymentQRs = settingsResponse?.data?.paymentQRs || [];
  const currency = settingsResponse?.data?.currency || 'Rs.';

  const [processPayment, { isLoading }] = useProcessPaymentMutation();

  const currentOrder = ordersList.find((o) => o._id === selectedOrderId);

  useEffect(() => {
    if (currentOrder) {
      setAmount(currentOrder.total);
    }
  }, [currentOrder]);

  if (!isOpen) return null;

  const currentQr = paymentQRs.find((q) => q.provider === onlineProvider && q.isActive !== false);

  const handleCopyNumber = (num: string) => {
    if (!num) return;
    navigator.clipboard.writeText(num);
    toast.success(`Copied "${num}" to clipboard!`);
  };

  const handleSubmit = async () => {
    if (!selectedOrderId) {
      toast.error('Please select an order to process payment.');
      return;
    }

    try {
      const res = await processPayment({
        order: selectedOrderId,
        amount: amount || currentOrder?.total || 0,
        paymentMethod,
        onlineProvider: paymentMethod === 'ONLINE' ? onlineProvider : undefined,
        paymentStatus,
        referenceNumber: referenceNumber || undefined,
      }).unwrap();

      if (res.success) {
        toast.success(`Payment recorded successfully! Invoice #${res.data.invoiceNumber || ''}`);
        onClose();
      } else {
        toast.error(res.message || 'Failed to record payment.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message || 'Failed to record payment.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[90vh] rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100">Process & Settle Payment</h2>
              <p className="text-xs text-slate-400">Record Cash or Scan-to-Pay Digital QR settlement</p>
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
        <div className="mt-5 space-y-4">
          {/* Order Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <ShoppingBag className="h-3.5 w-3.5 text-amber-400" />
              <span>Select Order *</span>
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => {
                const id = e.target.value;
                setSelectedOrderId(id);
                const ord = ordersList.find((o) => o._id === id);
                if (ord) {
                  setAmount(ord.total);
                }
              }}
              className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="">-- Choose Active Order --</option>
              {activeOrders.map((o) => (
                <option key={o._id} value={o._id}>
                  Order #{o.orderNumber || o._id.slice(-6)} - {o.orderType} ({currency} {o.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method Toggle (Cash vs Online) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Payment Method *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('CASH')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'CASH'
                    ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Banknote className="h-4 w-4" />
                <span>Cash Payment</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('ONLINE')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'ONLINE'
                    ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md shadow-amber-500/10'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CreditCard className="h-4 w-4" />
                <span>Online Digital QR</span>
              </button>
            </div>
          </div>

          {/* ONLINE DIGITAL QR PAYMENT SECTION */}
          {paymentMethod === 'ONLINE' && (
            <div className="rounded-2xl border border-amber-500/30 bg-slate-950/90 p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* QR Gateway Tabs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5 text-amber-400" />
                    Select Digital QR Gateway:
                  </span>
                  <Link
                    href="/settings"
                    target="_blank"
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>Manage QRs</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['FONEPAY', 'ESEWA', 'KHALTI'] as PaymentQRProvider[]).map((prov) => {
                    const cfg = PROVIDER_CONFIG[prov];
                    const isSelected = onlineProvider === prov;
                    return (
                      <button
                        key={prov}
                        type="button"
                        onClick={() => setOnlineProvider(prov)}
                        className={`flex items-center justify-center py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? `${cfg.activeBorder} ${cfg.activeBg} ${cfg.textColor} shadow-md`
                            : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span>{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* QR Code Presentation Box */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 flex flex-col sm:flex-row items-center gap-4">
                {/* QR Image Box */}
                <div className="shrink-0 w-36 h-36 rounded-xl border border-slate-700 bg-white p-2 flex items-center justify-center shadow-lg">
                  {currentQr?.qrImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentQr.qrImage}
                      alt={`${PROVIDER_CONFIG[onlineProvider].name} QR`}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center p-2 text-slate-900">
                      <QrCode className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                      <p className="text-[10px] font-bold text-slate-700">No QR Uploaded</p>
                      <Link
                        href="/settings"
                        className="text-[9px] text-amber-600 underline font-semibold block mt-1"
                      >
                        Upload in Settings
                      </Link>
                    </div>
                  )}
                </div>

                {/* Details & Copy Actions */}
                <div className="flex-1 space-y-2 text-left w-full">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${PROVIDER_CONFIG[onlineProvider].badgeBg} ${PROVIDER_CONFIG[onlineProvider].textColor} ${PROVIDER_CONFIG[onlineProvider].badgeBorder}`}
                    >
                      {PROVIDER_CONFIG[onlineProvider].name} SCAN & PAY
                    </span>
                    <span className="text-xs font-mono font-extrabold text-amber-400">
                      {currency} {amount.toFixed(2)}
                    </span>
                  </div>

                  {currentQr?.accountName && (
                    <p className="text-xs text-slate-200 flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-semibold">{currentQr.accountName}</span>
                    </p>
                  )}

                  {currentQr?.accountNumber && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-amber-400" />
                        <span className="font-mono text-xs text-slate-100 font-bold">
                          {currentQr.accountNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyNumber(currentQr.accountNumber)}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer"
                        title="Copy Number"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy</span>
                      </button>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400">
                    💡 Ask customer to scan this QR with their mobile banking/wallet app and enter the transaction reference ID below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Amount & Status Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount Paid ({currency}) *
              </label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="h-10 bg-slate-950 border-slate-800 text-xs font-mono text-slate-100 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="COMPLETED">Completed (Paid)</option>
                <option value="PENDING">Pending Verification</option>
              </select>
            </div>
          </div>

          {/* Reference / Transaction ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1">
              <Hash className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {paymentMethod === 'ONLINE'
                  ? `${PROVIDER_CONFIG[onlineProvider].name} Transaction Ref / ID`
                  : 'Transaction Reference / Ref # (Optional)'}
              </span>
            </label>
            <Input
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder={
                paymentMethod === 'ONLINE'
                  ? PROVIDER_CONFIG[onlineProvider].placeholder
                  : 'e.g. TXN-98421, Cash Receipt #'
              }
              className="h-10 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
            />
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
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !selectedOrderId}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Record Payment ({currency} {amount.toFixed(2)})
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
