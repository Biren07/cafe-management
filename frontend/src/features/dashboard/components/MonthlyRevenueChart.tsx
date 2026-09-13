'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyRevenuePoint } from '@/types/dashboard';
import { BarChart3 } from 'lucide-react';

interface MonthlyRevenueChartProps {
  data?: MonthlyRevenuePoint[];
}

export function MonthlyRevenueChart({ data = [] }: MonthlyRevenueChartProps) {
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString()}`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-emerald-600" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              Monthly Revenue Performance
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total sales comparisons across months
          </p>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No monthly revenue data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `Rs.${val}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const revenue = payload[0].value as number;
                    const orderCount = payload[0].payload?.orderCount || 0;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-900">{label}</p>
                        <p className="text-slate-600">
                          Revenue: <span className="font-semibold text-emerald-700">{formatCurrency(revenue)}</span>
                        </p>
                        <p className="text-slate-500">
                          Orders: <span className="font-semibold text-slate-800">{orderCount}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="totalRevenue"
                fill="#059669"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
