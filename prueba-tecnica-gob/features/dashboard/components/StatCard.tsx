interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
}: StatCardProps) {
  return (
    <div className='rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-sm font-medium text-zinc-500 dark:text-zinc-400'>
            {title}
          </p>
          <p className='mt-2 text-3xl font-bold text-zinc-900 dark:text-white'>
            {value}
          </p>
          {description && (
            <p className='mt-1 text-sm text-zinc-500 dark:text-zinc-400'>
              {description}
            </p>
          )}
          {trend && (
            <p
              className={`mt-2 flex items-center text-sm ${
                trend.isPositive
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              <svg
                className={`mr-1 h-4 w-4 ${!trend.isPositive && 'rotate-180'}`}
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 17l9.2-9.2M17 17V7H7'
                />
              </svg>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </p>
          )}
        </div>
        {icon && (
          <div className='rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
