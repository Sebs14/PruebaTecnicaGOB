'use client';

import { useEffect, useState } from 'react';
import {
  StatCard,
  StudentsByYearChart,
  GradeDistributionChart,
  GraduationStatusChart,
} from '@/features/dashboard';
import { studentService } from '@/features/students';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await studentService.getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Datos de ejemplo para desarrollo
        setStats({
          totalStudents: 1250,
          graduatedStudents: 450,
          activeStudents: 800,
          averageScore: 7.8,
          byGender: { M: 600, F: 650 },
          byYear: {
            2019: 150,
            2020: 200,
            2021: 280,
            2022: 320,
            2023: 300,
          },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className='flex h-96 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent' />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className='text-center text-zinc-600 dark:text-zinc-400'>
        Error al cargar estadísticas
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-zinc-900 dark:text-white'>
          Dashboard
        </h1>
        <p className='mt-1 text-zinc-600 dark:text-zinc-400'>
          Resumen general de estudiantes
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
        <StatCard
          title='Total Estudiantes'
          value={stats.totalStudents.toLocaleString()}
          icon={<UsersIcon />}
        />
        <StatCard
          title='Graduados'
          value={stats.graduatedStudents.toLocaleString()}
          description={`${(
            (stats.graduatedStudents / stats.totalStudents) *
            100
          ).toFixed(1)}% del total`}
          icon={<GraduateIcon />}
        />
        <StatCard
          title='Activos'
          value={stats.activeStudents.toLocaleString()}
          icon={<ActiveIcon />}
        />
        <StatCard
          title='Promedio General'
          value={stats.averageScore?.toFixed(2) ?? 'N/A'}
          icon={<ChartIcon />}
        />
      </div>

      {/* Charts */}
      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Estudiantes por Año */}
        <div className='rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800'>
          <h3 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-white'>
            Estudiantes por Año de Ingreso
          </h3>
          <StudentsByYearChart
            data={Object.entries(stats.byYear).map(([year, count]) => ({
              year: Number(year),
              count,
            }))}
          />
        </div>

        {/* Distribución por Género */}
        <div className='rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800'>
          <h3 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-white'>
            Distribución por Género
          </h3>
          <GradeDistributionChart
            data={Object.entries(stats.byGender).map(([range, count]) => ({
              range:
                range === 'M'
                  ? 'Masculino'
                  : range === 'F'
                  ? 'Femenino'
                  : range,
              count,
            }))}
          />
        </div>
      </div>

      {/* Estado de Graduación */}
      <div className='rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800'>
        <h3 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-white'>
          Estado de Graduación
        </h3>
        <div className='mx-auto max-w-md'>
          <GraduationStatusChart
            graduated={stats.graduatedStudents}
            active={stats.activeStudents}
          />
        </div>
      </div>
    </div>
  );
}

function UsersIcon() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
      />
    </svg>
  );
}

function GraduateIcon() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 14l9-5-9-5-9 5 9 5z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z'
      />
    </svg>
  );
}

function ActiveIcon() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M13 10V3L4 14h7v7l9-11h-7z'
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      className='h-6 w-6'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1.5}
        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
      />
    </svg>
  );
}
