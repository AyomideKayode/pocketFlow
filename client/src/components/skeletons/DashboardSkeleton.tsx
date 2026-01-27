export const DashboardSkeleton = () => {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      {/* Header Section */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-2'>
          <div className='h-8 w-48 rounded-md bg-slate-800 animate-pulse' />
          <div className='h-4 w-64 rounded-md bg-slate-800 animate-pulse' />
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          {/* Date Picker Placeholder */}
          <div className='h-10 w-[240px] rounded-lg bg-slate-800 animate-pulse' />
          {/* Export Button Placeholder */}
          <div className='h-10 w-24 rounded-lg bg-slate-800 animate-pulse' />
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-3'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm'
          >
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 rounded-full bg-slate-800 animate-pulse' />
              <div className='space-y-2'>
                <div className='h-4 w-24 rounded bg-slate-800 animate-pulse' />
                <div className='h-8 w-32 rounded bg-slate-800 animate-pulse' />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 h-auto'>
        {/* TrendLine Chart Placeholder */}
        <div className='lg:col-span-4 h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 p-6'>
          <div className='h-6 w-48 mb-4 rounded bg-slate-800 animate-pulse' />
          <div className='h-[300px] w-full rounded bg-slate-800/50 animate-pulse' />
        </div>

        {/* IncomeExpense Chart Placeholder */}
        <div className='lg:col-span-3 h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 p-6'>
          <div className='h-6 w-48 mb-4 rounded bg-slate-800 animate-pulse' />
          <div className='flex items-center justify-center h-[300px]'>
             <div className='h-48 w-48 rounded-full bg-slate-800/50 animate-pulse' />
          </div>
        </div>
      </div>

      {/* Category Breakdown Chart Placeholder */}
      <div className='grid gap-4 md:grid-cols-1'>
        <div className='h-[400px] rounded-xl border border-slate-800 bg-slate-900/50 p-6'>
          <div className='h-6 w-48 mb-4 rounded bg-slate-800 animate-pulse' />
          <div className='h-[300px] w-full rounded bg-slate-800/50 animate-pulse' />
        </div>
      </div>

      {/* Transactions Section */}
      <div className='space-y-4 pt-4'>
        <div className='flex items-center justify-between'>
          <div className='h-8 w-48 rounded bg-slate-800 animate-pulse' />
          <div className='h-10 w-40 rounded-lg bg-slate-800 animate-pulse' />
        </div>

        {/* Transaction List Skeleton */}
        <div className='rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden'>
             {/* Table Header */}
             <div className='h-12 bg-slate-800/50 border-b border-slate-800 flex items-center px-4 gap-4'>
                 <div className='h-4 w-1/4 bg-slate-800 animate-pulse rounded' />
                 <div className='h-4 w-1/4 bg-slate-800 animate-pulse rounded' />
                 <div className='h-4 w-1/4 bg-slate-800 animate-pulse rounded' />
                 <div className='h-4 w-1/4 bg-slate-800 animate-pulse rounded' />
             </div>

             {/* Table Rows */}
             {[1, 2, 3, 4, 5].map((i) => (
                 <div key={i} className='h-16 border-b border-slate-800 last:border-0 flex items-center px-4 gap-4'>
                     <div className='h-4 w-1/4 bg-slate-800/50 animate-pulse rounded' />
                     <div className='h-4 w-1/4 bg-slate-800/50 animate-pulse rounded' />
                     <div className='h-4 w-1/4 bg-slate-800/50 animate-pulse rounded' />
                     <div className='h-4 w-1/4 bg-slate-800/50 animate-pulse rounded' />
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};
