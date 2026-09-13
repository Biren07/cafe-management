export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-800/80">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded-md bg-slate-800" />
          <div className="h-8 w-64 rounded-xl bg-slate-800" />
          <div className="h-4 w-48 rounded-md bg-slate-800/60" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 rounded-xl bg-slate-800" />
          <div className="h-9 w-28 rounded-xl bg-slate-800" />
        </div>
      </div>

      {/* Summary Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-28 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-slate-800" />
              <div className="h-8 w-8 rounded-xl bg-slate-800" />
            </div>
            <div className="space-y-1">
              <div className="h-7 w-24 rounded-lg bg-slate-800" />
              <div className="h-3 w-16 rounded bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900/60 p-5" />
        <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900/60 p-5" />
      </div>

      {/* Recent Orders Skeleton */}
      <div className="h-64 rounded-2xl border border-slate-800 bg-slate-900/60 p-5" />
    </div>
  );
}
