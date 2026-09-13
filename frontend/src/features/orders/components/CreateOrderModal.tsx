'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  X,
  Plus,
  Minus,
  Trash2,
  UtensilsCrossed,
  Armchair,
  ShoppingBag,
  Search,
  CheckCircle,
  Percent,
  Receipt,
} from 'lucide-react';
import { useGetTablesQuery } from '@/features/tables/services/tableApi';
import { useGetMenuItemsQuery } from '@/features/menu/services/menuApi';
import { useGetCategoriesQuery } from '@/features/categories/services/categoryApi';
import { useCreateOrderMutation } from '../services/orderApi';
import { MenuItem } from '@/types/menu';
import { OrderType } from '../types/order.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrderModal({ isOpen, onClose }: CreateOrderModalProps) {
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchMenu, setSearchMenu] = useState<string>('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [taxPercent, setTaxPercent] = useState<number>(13);
  const [serviceChargePercent, setServiceChargePercent] = useState<number>(10);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Fetch queries
  const { data: tablesResponse } = useGetTablesQuery({ limit: 100 });
  const tablesList = tablesResponse?.data?.items || [];
  const availableTables = tablesList.filter((t) => t.status === 'AVAILABLE' || t._id === selectedTableId);

  const { data: categoriesResponse } = useGetCategoriesQuery({ limit: 100 });
  const categoriesList = categoriesResponse?.data?.items || [];

  const { data: menuResponse, isLoading: isLoadingMenu } = useGetMenuItemsQuery({
    limit: 100,
    search: searchMenu || undefined,
    category: selectedCategory || undefined,
    isAvailable: true,
  });
  const menuItems = menuResponse?.data?.items || [];

  const [createOrder, { isLoading: isSubmitting }] = useCreateOrderMutation();

  if (!isOpen) return null;

  // Cart helper functions
  const handleAddToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem._id === item._id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem._id === item._id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const handleIncreaseQty = (itemId: string) => {
    setCart((prev) =>
      prev.map((c) =>
        c.menuItem._id === itemId ? { ...c, quantity: c.quantity + 1 } : c
      )
    );
  };

  const handleDecreaseQty = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItem._id === itemId) {
            return { ...c, quantity: c.quantity - 1 };
          }
          return c;
        })
        .filter((c) => c.quantity > 0)
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem._id !== itemId));
  };

  // Summary math calculations
  const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
  const taxVal = (subtotal * (taxPercent || 0)) / 100;
  const serviceChargeVal = (subtotal * (serviceChargePercent || 0)) / 100;
  const discountVal = Math.min(discountAmount || 0, subtotal);
  const grandTotal = Math.max(0, subtotal + taxVal + serviceChargeVal - discountVal);

  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      toast.error('Please add at least one menu item to the order.');
      return;
    }

    if (orderType === 'DINE_IN' && !selectedTableId) {
      toast.error('Please select a dining table for Dine-In order.');
      return;
    }

    try {
      const payload = {
        orderType,
        table: orderType === 'DINE_IN' ? selectedTableId : null,
        items: cart.map((c) => ({
          menuItem: c.menuItem._id,
          quantity: c.quantity,
        })),
        tax: taxVal,
        discount: discountVal,
        serviceCharge: serviceChargeVal,
        notes: notes || undefined,
      };

      const response = await createOrder(payload).unwrap();

      if (response.success) {
        toast.success(`Order #${response.data.orderNumber || ''} created successfully!`);
        // Reset modal state
        setCart([]);
        setSelectedTableId('');
        setNotes('');
        onClose();
      } else {
        toast.error(response.message || 'Failed to create order.');
      }
    } catch (err: unknown) {
      const errorMsg = (err as { data?: { message?: string } })?.data?.message || 'Failed to create order.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-6xl h-[92vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-100">Create New Order</h2>
              <p className="text-xs text-slate-400">Point of Sale (POS) Order Entry</p>
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

        {/* Modal Main Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Panel: Table & Menu Item Selection (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 p-4 sm:p-5 overflow-y-auto space-y-4">
            {/* Order Type & Table Selection */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Order Type</span>
                <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setOrderType('DINE_IN')}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'DINE_IN'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Armchair className="h-3.5 w-3.5" />
                    <span>Dine-In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOrderType('TAKE_AWAY');
                      setSelectedTableId('');
                    }}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      orderType === 'TAKE_AWAY'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    <span>Take-Away</span>
                  </button>
                </div>
              </div>

              {/* Table Picker dropdown for Dine In */}
              {orderType === 'DINE_IN' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">
                    Select Available Dining Table *
                  </label>
                  <select
                    value={selectedTableId}
                    onChange={(e) => setSelectedTableId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-800 bg-slate-900 px-3 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="">-- Choose a Table --</option>
                    {availableTables.map((t) => (
                      <option key={t._id} value={t._id}>
                        Table #{t.tableNumber} - {t.tableName} ({t.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Menu Item Filters (Categories & Search) */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-1/2">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <Input
                  value={searchMenu}
                  onChange={(e) => setSearchMenu(e.target.value)}
                  placeholder="Search food / beverage..."
                  className="pl-9 h-9 bg-slate-950 border-slate-800 text-xs text-slate-100 rounded-xl"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-1/2 h-9 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="">All Categories</option>
                {categoriesList.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Cards Grid */}
            <div className="flex-1 overflow-y-auto min-h-[260px]">
              {isLoadingMenu ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
                  ))}
                </div>
              ) : menuItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                  <UtensilsCrossed className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-xs">No available menu items found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {menuItems.map((item) => {
                    const cartCount = cart.find((c) => c.menuItem._id === item._id)?.quantity || 0;

                    return (
                      <button
                        key={item._id}
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`group relative flex flex-col justify-between p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                          cartCount > 0
                            ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-850'
                        }`}
                      >
                        {cartCount > 0 && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-slate-950 shadow">
                            {cartCount}
                          </span>
                        )}

                        <div>
                          <p className="font-semibold text-xs text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {typeof item.category === 'object' ? item.category?.name : ''}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-amber-400">
                            Rs.{item.price.toFixed(2)}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                            + Add
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Cart & Order Summary (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col bg-slate-950/40 p-4 sm:p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-heading text-sm font-bold text-slate-200">Order Cart</span>
              <span className="text-xs text-slate-400 font-mono">
                {cart.reduce((acc, c) => acc + c.quantity, 0)} Items
              </span>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto my-3 space-y-2.5 max-h-[220px]">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-slate-500">
                  <ShoppingBag className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-xs">Cart is empty. Click menu items to add.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.menuItem._id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/80"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-100 truncate">{item.menuItem.name}</p>
                      <p className="text-[11px] text-amber-400 font-mono">
                        Rs.{item.menuItem.price.toFixed(2)} x {item.quantity} = Rs.{(item.menuItem.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Increase / Decrease Controls */}
                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDecreaseQty(item.menuItem._id)}
                        className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-6 text-center text-xs font-extrabold font-mono text-slate-100">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleIncreaseQty(item.menuItem._id)}
                        className="h-6 w-6 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromCart(item.menuItem._id)}
                        className="h-6 w-6 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 flex items-center justify-center ml-1 cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3.5 space-y-2 text-xs shrink-0">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-slate-200">Rs.{subtotal.toFixed(2)}</span>
              </div>

              {/* Tax %, Service Charge %, Discount */}
              <div className="grid grid-cols-3 gap-2 py-1">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Tax (%)</label>
                  <Input
                    type="number"
                    min={0}
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="h-7 text-xs bg-slate-900 border-slate-800 px-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Service (%)</label>
                  <Input
                    type="number"
                    min={0}
                    value={serviceChargePercent}
                    onChange={(e) => setServiceChargePercent(Number(e.target.value))}
                    className="h-7 text-xs bg-slate-900 border-slate-800 px-2 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-0.5">Disc (Rs.)</label>
                  <Input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="h-7 text-xs bg-slate-900 border-slate-800 px-2 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Tax ({taxPercent}%):</span>
                <span className="font-mono">Rs.{taxVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Service Charge ({serviceChargePercent}%):</span>
                <span className="font-mono">Rs.{serviceChargeVal.toFixed(2)}</span>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-emerald-400 text-[11px]">
                  <span>Discount:</span>
                  <span className="font-mono">-Rs.{discountVal.toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-sm">
                <span className="text-slate-100">Grand Total</span>
                <span className="font-mono text-amber-400 text-base">Rs.{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-3">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Order notes / instructions (optional)..."
                className="h-8 text-xs bg-slate-950 border-slate-800 text-slate-200 rounded-xl"
              />
            </div>

            {/* Submit */}
            <Button
              type="button"
              onClick={handleSubmitOrder}
              disabled={isSubmitting || cart.length === 0}
              className="mt-4 w-full h-11 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Placing Order...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Place Order (Rs.{grandTotal.toFixed(2)})</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
