'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

interface StudentsByYearChartProps {
  data: { year: number; count: number }[];
}

export function StudentsByYearChart({ data }: StudentsByYearChartProps) {
  return (
    <div className='h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            className='stroke-zinc-200 dark:stroke-zinc-700'
          />
          <XAxis
            dataKey='year'
            className='text-xs fill-zinc-600 dark:fill-zinc-400'
          />
          <YAxis className='text-xs fill-zinc-600 dark:fill-zinc-400' />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground)',
              borderRadius: '8px',
            }}
          />
          <Bar
            dataKey='count'
            fill='#3b82f6'
            radius={[4, 4, 0, 0]}
            name='Estudiantes'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GradeDistributionChartProps {
  data: { range: string; count: number }[];
}

export function GradeDistributionChart({ data }: GradeDistributionChartProps) {
  return (
    <div className='h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey='count'
            nameKey='range'
            label={({ name, percent }) =>
              `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface GraduationStatusChartProps {
  graduated: number;
  active: number;
}

export function GraduationStatusChart({
  graduated,
  active,
}: GraduationStatusChartProps) {
  const data = [
    { name: 'Graduados', value: graduated, color: '#10b981' },
    { name: 'Activos', value: active, color: '#3b82f6' },
  ];

  return (
    <div className='h-64'>
      <ResponsiveContainer width='100%' height='100%'>
        <PieChart>
          <Pie
            data={data}
            cx='50%'
            cy='50%'
            innerRadius={50}
            outerRadius={80}
            paddingAngle={5}
            dataKey='value'
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrendChartProps {
  data: { year: number; count: number; average: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className='h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray='3 3'
            className='stroke-zinc-200 dark:stroke-zinc-700'
          />
          <XAxis
            dataKey='year'
            className='text-xs fill-zinc-600 dark:fill-zinc-400'
          />
          <YAxis
            yAxisId='left'
            className='text-xs fill-zinc-600 dark:fill-zinc-400'
          />
          <YAxis
            yAxisId='right'
            orientation='right'
            className='text-xs fill-zinc-600 dark:fill-zinc-400'
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--foreground)',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            yAxisId='left'
            type='monotone'
            dataKey='count'
            stroke='#3b82f6'
            strokeWidth={2}
            name='Estudiantes'
          />
          <Line
            yAxisId='right'
            type='monotone'
            dataKey='average'
            stroke='#10b981'
            strokeWidth={2}
            name='Promedio'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
