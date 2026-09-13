'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import { InventoryItem } from '../types/inventory.types';
import { BarChart3 } from 'lucide-react';

interface StockLevelChartProps {
  items: InventoryItem[];
}

export function StockLevelChart({ items }: StockLevelChartProps) {
  // Take top 10 items for visual clarity
  const chartData = items.slice(0, 10).map((item) => ({
    name: item.itemName,
    CurrentStock: item.currentStock,
    MinimumStock: item.minimumStock,
    isLow: item.isLowStock || item.currentStock <= item.minimumStock,
    unit: item.unit,
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <BarChart3 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-heading text-sm font-bold text-slate-100">Stock Levels vs Minimum Thresholds</h3>
            <p className="text-[11px] text-slate-400">Visual inventory health analysis</p>
          </div>
        </div>
      </div>

      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
              }}
              formatter={(value: any, name: any) => [
                `${value}`,
                name === 'CurrentStock' ? 'Current Stock' : 'Minimum Stock',
              ]}
            />
            <Legend
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
              formatter={(value) => (value === 'CurrentStock' ? 'Current Stock' : 'Minimum Threshold')}
            />
            <Bar dataKey="CurrentStock" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.isLow ? '#f43f5e' : '#f59e0b'} />
              ))}
            </Bar>
            <Bar dataKey="MinimumStock" fill="#64748b" radius={[6, 6, 0, 0]} opacity={0.6} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
