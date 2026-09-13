'use client';

import { useState, ChangeEvent } from 'react';
import toast from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  Store,
  QrCode,
  Save,
  Upload,
  Percent,
  DollarSign,
  Clock,
  Receipt,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';
import {
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '@/features/settings/services/settingsApi';
import { PaymentQrCard } from '@/features/settings/components/PaymentQrCard';
import { PageGuard } from '@/components/auth/PageGuard';
import { ADMIN_ROLES } from '@/constants/permissions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { PushNotificationSettings } from '@/features/notifications/components/PushNotificationSettings';
import { Bell } from 'lucide-react';

export default function SettingsPage() {
  return (
    <PageGuard
      requiredRoles={ADMIN_ROLES}
      title="Store Settings — Admin Access Only"
      message="Store configuration, Tax/VAT percentages, and Payment QR gateway management are restricted to the Cafe Admin / Manager."
    >
      <SettingsContent />
    </PageGuard>
  );
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'PAYMENT_QR' | 'NOTIFICATIONS'>('NOTIFICATIONS');

  const { data: settingsResponse, isLoading: isFetching } = useGetSettingsQuery();
  const settings = settingsResponse?.data;

  const paymentQRs = settings?.paymentQRs || [];
  const fonepayQr = paymentQRs.find((q) => q.provider === 'FONEPAY');
  const esewaQr = paymentQRs.find((q) => q.provider === 'ESEWA');
  const khaltiQr = paymentQRs.find((q) => q.provider === 'KHALTI');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <SettingsIcon className="h-6 w-6 text-amber-600" />
            <span>Store &amp; System Settings</span>
          </h1>
          <p className="text-xs text-slate-500">
            Configure cafe profile, real-time push alerts, billing taxes &amp; digital payment QR gateways
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 border border-slate-200 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('NOTIFICATIONS')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'NOTIFICATIONS'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className="h-3.5 w-3.5" />
            <span>Push Notifications</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PAYMENT_QR')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'PAYMENT_QR'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Payment QRs</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('GENERAL')}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'GENERAL'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Store Profile</span>
          </button>
        </div>
      </div>

      {isFetching ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
          <p className="mt-3 text-xs text-slate-500">Loading store settings...</p>
        </div>
      ) : activeTab === 'NOTIFICATIONS' ? (
        /* Push Notifications Tab */
        <PushNotificationSettings />
      ) : activeTab === 'PAYMENT_QR' ? (
        /* Digital Payment QRs Tab */
        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start space-x-3">
            <QrCode className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                Customer Scan & Pay QR Setup (eSewa, Fonepay, Khalti)
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload your official QR codes below. When staff clicks &quot;Online Digital&quot; in the Billing / Payment screen, the customer will see these QRs to scan with their banking/wallet app and complete payment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Fonepay QR */}
            <PaymentQrCard
              provider="FONEPAY"
              title="Fonepay QR"
              subtitle="All Nepali Commercial & Dev Banks"
              accentColor="bg-red-500 hover:bg-red-600 shadow-red-500/20"
              badgeBg="bg-red-500/10"
              badgeBorder="border-red-500/30"
              textColor="text-red-400"
              existingQr={fonepayQr}
            />

            {/* 2. eSewa QR */}
            <PaymentQrCard
              provider="ESEWA"
              title="eSewa QR"
              subtitle="eSewa Digital Wallet & Scan to Pay"
              accentColor="bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
              badgeBg="bg-emerald-500/10"
              badgeBorder="border-emerald-500/30"
              textColor="text-emerald-400"
              existingQr={esewaQr}
            />

            {/* 3. Khalti QR */}
            <PaymentQrCard
              provider="KHALTI"
              title="Khalti QR"
              subtitle="Khalti Digital Wallet & Smart Banking"
              accentColor="bg-purple-500 hover:bg-purple-600 shadow-purple-500/20"
              badgeBg="bg-purple-500/10"
              badgeBorder="border-purple-500/30"
              textColor="text-purple-400"
              existingQr={khaltiQr}
            />
          </div>
        </div>
      ) : (
        /* Store Profile Tab */
        <StoreProfileForm settings={settings} />
      )}
    </div>
  );
}

interface StoreProfileFormProps {
  settings?: import('@/types/settings').CafeSettings;
}

function StoreProfileForm({ settings }: StoreProfileFormProps) {
  const [updateSettings, { isLoading: isSavingGeneral }] = useUpdateSettingsMutation();

  const [cafeName, setCafeName] = useState(settings?.cafeName || '');
  const [phone, setPhone] = useState(settings?.phone || '');
  const [email, setEmail] = useState(settings?.email || '');
  const [address, setAddress] = useState(settings?.address || '');
  const [vatNumber, setVatNumber] = useState(settings?.vatNumber || '');
  const [currency, setCurrency] = useState(settings?.currency || 'NPR');
  const [taxPercentage, setTaxPercentage] = useState(settings?.taxPercentage ?? 13);
  const [serviceChargePercentage, setServiceChargePercentage] = useState(settings?.serviceChargePercentage ?? 10);
  const [businessHours, setBusinessHours] = useState(settings?.businessHours || '');
  const [receiptFooter, setReceiptFooter] = useState(settings?.receiptFooter || '');
  const [logoPreview, setLogoPreview] = useState<string | null>(settings?.logo || null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('cafeName', cafeName);
      formData.append('phone', phone);
      formData.append('email', email);
      formData.append('address', address);
      formData.append('vatNumber', vatNumber);
      formData.append('currency', currency);
      formData.append('taxPercentage', String(taxPercentage));
      formData.append('serviceChargePercentage', String(serviceChargePercentage));
      formData.append('businessHours', businessHours);
      formData.append('receiptFooter', receiptFooter);

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await updateSettings(formData).unwrap();
      if (res.success) {
        toast.success('Store settings updated successfully!');
        setLogoFile(null);
      } else {
        toast.error(res.message || 'Failed to update settings.');
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { data?: { message?: string } })?.data?.message ||
        'Failed to update settings.';
      toast.error(errorMsg);
    }
  };

  return (
    <form onSubmit={handleSaveGeneral} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
      <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
        <div className="relative group w-20 h-20 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden">
          {logoPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-1" />
          ) : (
            <Store className="h-8 w-8 text-slate-400" />
          )}
          <label className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white">
            <Upload className="h-4 w-4 text-amber-400" />
            <span className="text-[9px] font-bold mt-1">Change</span>
            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
          </label>
        </div>
        <div>
          <h3 className="font-heading text-base font-bold text-slate-900">Cafe Information &amp; Logo</h3>
          <p className="text-xs text-slate-500">Displayed on printed customer receipts &amp; billing invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Store className="h-3.5 w-3.5 text-amber-600" />
            <span>Cafe Name *</span>
          </label>
          <Input
            value={cafeName}
            onChange={(e) => setCafeName(e.target.value)}
            placeholder="My Artisan Cafe"
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Phone className="h-3.5 w-3.5 text-amber-600" />
            <span>Contact Phone</span>
          </label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+977 9801234567"
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Mail className="h-3.5 w-3.5 text-amber-600" />
            <span>Email Address</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="contact@cafe.com"
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span>Physical Address</span>
          </label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Jhamsikhel, Lalitpur, Nepal"
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <FileText className="h-3.5 w-3.5 text-amber-600" />
            <span>VAT / PAN Number</span>
          </label>
          <Input
            value={vatNumber}
            onChange={(e) => setVatNumber(e.target.value)}
            placeholder="PAN-60192841"
            className="h-10 bg-white border-slate-300 text-xs font-mono text-slate-900 rounded-xl"
          />
        </div>
      </div>

      {/* Billing Calculations Grid */}
      <div className="pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Tax &amp; Currency Configuration
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              <span>Currency Code / Symbol</span>
            </label>
            <Input
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              placeholder="NPR or Rs. or USD"
              className="h-10 bg-white border-slate-300 text-xs font-mono text-slate-900 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Percent className="h-3.5 w-3.5 text-amber-600" />
              <span>VAT / Tax Percentage (%)</span>
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              value={taxPercentage}
              onChange={(e) => setTaxPercentage(Number(e.target.value))}
              className="h-10 bg-white border-slate-300 text-xs font-mono text-slate-900 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
              <Percent className="h-3.5 w-3.5 text-sky-600" />
              <span>Service Charge (%)</span>
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              value={serviceChargePercentage}
              onChange={(e) => setServiceChargePercentage(Number(e.target.value))}
              className="h-10 bg-white border-slate-300 text-xs font-mono text-slate-900 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Receipt Customization */}
      <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Clock className="h-3.5 w-3.5 text-amber-600" />
            <span>Business Operating Hours</span>
          </label>
          <Input
            value={businessHours}
            onChange={(e) => setBusinessHours(e.target.value)}
            placeholder="Sun - Sat: 07:00 AM - 10:00 PM"
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center space-x-1">
            <Receipt className="h-3.5 w-3.5 text-amber-600" />
            <span>Receipt Footer Message</span>
          </label>
          <Input
            value={receiptFooter}
            onChange={(e) => setReceiptFooter(e.target.value)}
            placeholder="Thank you for visiting! Please come again."
            className="h-10 bg-white border-slate-300 text-xs text-slate-900 rounded-xl"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="submit"
          disabled={isSavingGeneral}
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
        >
          {isSavingGeneral ? (
            <div className="flex items-center space-x-2">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5">
              <Save className="h-4 w-4" />
              <span>Save Store Profile</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}
