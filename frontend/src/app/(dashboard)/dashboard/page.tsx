'use client';

import { useGetDashboardAnalyticsQuery } from '@/features/dashboard/services/dashboardApi';
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader';
import { SummaryCardsGrid } from '@/features/dashboard/components/SummaryCardsGrid';
import { WeeklySalesChart } from '@/features/dashboard/components/WeeklySalesChart';
import { MonthlyRevenueChart } from '@/features/dashboard/components/MonthlyRevenueChart';
import { TopSellingChart } from '@/features/dashboard/components/TopSellingChart';
import { RecentOrdersTable } from '@/features/dashboard/components/RecentOrdersTable';
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';
import { DashboardErrorState } from '@/features/dashboard/components/DashboardErrorState';
import { DashboardEmptyState } from '@/features/dashboard/components/DashboardEmptyState';
import { PageGuard } from '@/components/auth/PageGuard';
import { ROLES } from '@/constants/permissions';

export default function DashboardPage() {
  return (
    <PageGuard
      requiredRoles={[ROLES.ADMIN]}
      title="Sales Dashboard — Management Only"
      message="Revenue analytics, daily sales charts, and business performance metrics are accessible only by the Cafe Admin."
    >
      <DashboardContent />
    </PageGuard>
  );
}

function DashboardContent() {
  const { data: response, isLoading, isFetching, isError, error, refetch } =
    useGetDashboardAnalyticsQuery();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <DashboardErrorState error={error} onRetry={refetch} />;
  }

  const analyticsData = response?.data;
  const summaryCards = analyticsData?.summaryCards;
  const charts = analyticsData?.charts;
  const recentOrders = analyticsData?.recentOrders || [];

  const isEmpty =
    !summaryCards ||
    (summaryCards.todaySales === 0 &&
      summaryCards.todayOrders === 0 &&
      summaryCards.monthlySales === 0 &&
      recentOrders.length === 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader onRefresh={refetch} isFetching={isFetching} />

      {isEmpty ? (
        <DashboardEmptyState />
      ) : (
        <>
          {/* 7 Summary Cards Grid */}
          <SummaryCardsGrid data={summaryCards} />

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklySalesChart data={charts?.weeklySales} />
            <MonthlyRevenueChart data={charts?.monthlyRevenue} />
          </div>

          {/* Top Selling Items & Recent Orders Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <TopSellingChart data={charts?.topSellingMenuItems} />
            </div>
            <div className="lg:col-span-2">
              <RecentOrdersTable orders={recentOrders} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
