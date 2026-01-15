'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/features/students';
import type { Student } from '@/types';
import Link from 'next/link';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const response = await studentService.getAll({
          page,
          limit: 20,
          search,
        });
        setStudents(response.students);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Error fetching students:', error);
        // Datos de ejemplo para desarrollo
        setStudents([
          {
            id: '1',
            nombre_estudiante: 'Juan Pérez',
            anio_inicio: 2020,
            nue: 12345,
            promedio_actual: 8.5,
            promedio_graduacion: null,
            graduado: false,
          },
          {
            id: '2',
            nombre_estudiante: 'María García',
            anio_inicio: 2019,
            nue: 12346,
            promedio_actual: 9.2,
            promedio_graduacion: 9.2,
            graduado: true,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [page, search]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-zinc-900 dark:text-white'>
            Estudiantes
          </h1>
          <p className='mt-1 text-zinc-600 dark:text-zinc-400'>
            Lista de todos los estudiantes registrados
          </p>
        </div>
        <Link
          href='/upload'
          className='rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500'
        >
          Cargar Datos
        </Link>
      </div>

      {/* Search */}
      <div className='relative'>
        <svg
          className='absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
          />
        </svg>
        <input
          type='text'
          placeholder='Buscar por nombre o NUE...'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className='w-full rounded-lg border border-zinc-200 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white'
        />
      </div>

      {/* Table */}
      <div className='overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-zinc-200 dark:divide-zinc-700'>
            <thead className='bg-zinc-50 dark:bg-zinc-900'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                  Nombre
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                  NUE
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                  Año Inicio
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                  Promedio
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400'>
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-zinc-200 dark:divide-zinc-700'>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center'>
                    <div className='flex justify-center'>
                      <div className='h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent' />
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className='px-6 py-12 text-center text-zinc-500 dark:text-zinc-400'
                  >
                    No se encontraron estudiantes
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.id}
                    className='hover:bg-zinc-50 dark:hover:bg-zinc-900/50'
                  >
                    <td className='whitespace-nowrap px-6 py-4'>
                      <div className='font-medium text-zinc-900 dark:text-white'>
                        {student.nombreEstudiante}
                      </div>
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 font-mono text-sm text-zinc-600 dark:text-zinc-400'>
                      {student.nue}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4 text-zinc-600 dark:text-zinc-400'>
                      {student.anioInicio}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span className='font-medium text-zinc-900 dark:text-white'>
                        {student.promedioActual?.toFixed(2) ?? 'N/A'}
                      </span>
                      {student.graduado && student.promedioGraduacion && (
                        <span className='ml-2 text-sm text-zinc-500'>
                          (Grad: {student.promedioGraduacion.toFixed(2)})
                        </span>
                      )}
                    </td>
                    <td className='whitespace-nowrap px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          student.graduado
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        }`}
                      >
                        {student.graduado ? 'Graduado' : 'Activo'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex items-center justify-between border-t border-zinc-200 px-6 py-3 dark:border-zinc-700'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='rounded-lg border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
            >
              Anterior
            </button>
            <span className='text-sm text-zinc-600 dark:text-zinc-400'>
              Página {page} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='rounded-lg border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800'
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
