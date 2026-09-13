'use client';

import { TopSellingMenuItem } from '@/types/dashboard';
import { Award, Flame } from 'lucide-react';

interface TopSellingChartProps {
  data?: TopSellingMenuItem[];
}

export function TopSellingChart({ data = [] }: TopSellingChartProps) {
  const maxRevenue = Math.max(...data.map((item) => item.totalRevenue || 1), 1);
  const formatCurrency = (val: number) => `Rs.${val.toLocaleString()}`;

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-orange-600" />
            <h3 className="font-heading text-base font-bold text-slate-900">
              Top Selling Menu Items
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Most ordered food &amp; beverages by volume and revenue
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No sales item data available yet
          </div>
        ) : (
          data.slice(0, 5).map((item, index) => {
            const percentage = Math.min(Math.round((item.totalRevenue / maxRevenue) * 100), 100);
            return (
              <div key={item.menuItemId || index} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold ${
                        index === 0
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : index === 1
                          ? 'bg-slate-100 text-slate-700 border border-slate-300'
                          : index === 2
                          ? 'bg-orange-100 text-orange-800 border border-orange-300'
                          : 'bg-slate-50 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-500">
                    <span>{item.totalQuantitySold} sold</span>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.totalRevenue)}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
