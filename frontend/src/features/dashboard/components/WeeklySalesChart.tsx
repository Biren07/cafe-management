'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WeeklySalesPoint } from '@/types/dashboard';
import { TrendingUp } from 'lucide-react';

interface WeeklySalesChartProps {
  data?: WeeklySalesPoint[];
}

export function WeeklySalesChart({ data = [] }: WeeklySalesChartProps) {
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString()}`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-amber-600" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              7-Day Weekly Sales Trend
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily revenue and order volume over the last 7 days
          </p>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No weekly sales data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="day"
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
                tickFormatter={(value) => `Rs.${value}`}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const sales = payload[0].value as number;
                    const orderCount = payload[0].payload?.orderCount || 0;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl text-xs space-y-1">
                        <p className="font-bold text-slate-900">{label}</p>
                        <p className="text-slate-600">
                          Sales: <span className="font-semibold text-amber-700">{formatCurrency(sales)}</span>
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
              <Area
                type="monotone"
                dataKey="totalSales"
                stroke="#d97706"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#salesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
