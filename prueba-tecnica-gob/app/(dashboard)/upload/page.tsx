'use client';

import { UploadForm } from '@/features/students';
import { useRouter } from 'next/navigation';

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold text-zinc-900 dark:text-white'>
          Cargar Datos
        </h1>
        <p className='mt-1 text-zinc-600 dark:text-zinc-400'>
          Sube un archivo CSV o Excel con los datos de estudiantes
        </p>
      </div>

      {/* Formato esperado */}
      <div className='rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800'>
        <h3 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-white'>
          Formato del Archivo
        </h3>
        <p className='mb-4 text-sm text-zinc-600 dark:text-zinc-400'>
          El archivo debe contener las siguientes columnas:
        </p>
        <div className='overflow-x-auto'>
          <table className='min-w-full text-sm'>
            <thead>
              <tr className='border-b border-zinc-200 dark:border-zinc-700'>
                <th className='px-4 py-2 text-left font-medium text-zinc-900 dark:text-white'>
                  Columna
                </th>
                <th className='px-4 py-2 text-left font-medium text-zinc-900 dark:text-white'>
                  Tipo
                </th>
                <th className='px-4 py-2 text-left font-medium text-zinc-900 dark:text-white'>
                  Validaciones
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-zinc-200 dark:divide-zinc-700'>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  nombre_estudiante
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Texto
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Único, requerido
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  anio_inicio
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Número
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Requerido, no mayor al año actual
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  nue
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Número
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Único, numérico positivo
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  promedio_actual
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Número
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Entre 0 y 10
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  promedio_graduacion
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Número / Vacío
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Igual a promedio_actual si graduado
                </td>
              </tr>
              <tr>
                <td className='px-4 py-2 font-mono text-zinc-700 dark:text-zinc-300'>
                  graduado
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  Booleano
                </td>
                <td className='px-4 py-2 text-zinc-600 dark:text-zinc-400'>
                  true/false, si/no, 1/0
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Form */}
      <div className='rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800'>
        <h3 className='mb-4 text-lg font-semibold text-zinc-900 dark:text-white'>
          Subir Archivo
        </h3>
        <UploadForm onSuccess={() => router.push('/students')} />
      </div>
    </div>
  );
}
