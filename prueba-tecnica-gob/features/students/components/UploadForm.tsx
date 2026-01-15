'use client';

import { useState, useCallback, useRef } from 'react';
import { useFileParser } from '../hooks/useFileParser';
import { studentService } from '../services/studentService';
import type { UploadResult, UploadError } from '@/types';
import { toast } from 'sonner';

interface UploadFormProps {
  onSuccess?: () => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { parseFile, isProcessing, progress } = useFileParser();

  const [file, setFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<UploadResult | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile) return;

      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];

      const extension = selectedFile.name.split('.').pop()?.toLowerCase();
      const isValidExtension =
        extension === 'csv' || extension === 'xlsx' || extension === 'xls';

      if (!validTypes.includes(selectedFile.type) && !isValidExtension) {
        toast.error(
          'Formato de archivo no válido. Use CSV o Excel (.xlsx, .xls)'
        );
        return;
      }

      setFile(selectedFile);
      setParseResult(null);

      try {
        const result = await parseFile(selectedFile);
        setParseResult(result);

        if (result.errors.length === 0) {
          toast.success(
            `${result.validRows.length} registros válidos encontrados`
          );
        } else {
          toast.warning(
            `${result.errors.length} errores encontrados. Revise los detalles.`
          );
        }
      } catch (error) {
        toast.error('Error al procesar el archivo');
        console.error(error);
      }
    },
    [parseFile]
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleUpload = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;

    setIsUploading(true);
    try {
      const response = await studentService.bulkUpload(parseResult.validRows);

      if (response.success && response.errors.length === 0) {
        // Todos insertados sin errores
        toast.success(
          `${response.inserted} estudiantes insertados exitosamente`
        );
        setFile(null);
        setParseResult(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onSuccess?.();
      } else if (response.inserted > 0) {
        // Algunos insertados, algunos con errores (inserción parcial)
        const backendErrors = response.errors.map((err) => ({
          row: err.row,
          field: err.field || 'desconocido',
          value: '',
          message: err.message,
        }));
        setParseResult({
          ...parseResult,
          success: false,
          errors: backendErrors,
        });
        toast.success(`${response.inserted} estudiantes insertados.`);
        if (response.errors.length > 0) {
          toast.warning(`${response.errors.length} registros ignorados por errores.`);
        }
        onSuccess?.();
      } else {
        // Ninguno insertado, todos con errores
        const backendErrors = response.errors.map((err) => ({
          row: err.row,
          field: err.field || 'desconocido',
          value: '',
          message: err.message,
        }));
        setParseResult({
          ...parseResult,
          success: false,
          errors: [...parseResult.errors, ...backendErrors],
        });
        toast.error(`No se pudo insertar ningún registro. Revisa los detalles abajo.`);
      }
    } catch (error: unknown) {
      // Manejar errores de la API con mensaje específico
      const apiError = error as { message?: string | string[]; errors?: Array<{ row: number; field: string; message: string }> };
      
      if (apiError.errors && Array.isArray(apiError.errors)) {
        const backendErrors = apiError.errors.map((err) => ({
          row: err.row,
          field: err.field || 'desconocido',
          value: '',
          message: err.message,
        }));
        setParseResult({
          ...parseResult,
          success: false,
          errors: [...parseResult.errors, ...backendErrors],
        });
        toast.error(`Error del servidor: ${apiError.errors.length} errores. Revisa los detalles abajo.`);
      } else {
        const message = Array.isArray(apiError.message) 
          ? apiError.message.join(', ') 
          : (apiError.message || 'Error al subir los datos');
        toast.error(message);
      }
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParseResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='space-y-6'>
      {/* Zona de Drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept='.csv,.xlsx,.xls'
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
          disabled={isProcessing || isUploading}
        />

        <svg
          className='mb-4 h-12 w-12 text-zinc-400'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
          />
        </svg>

        <p className='mb-2 text-lg font-medium text-zinc-700 dark:text-zinc-300'>
          {file ? file.name : 'Arrastra tu archivo aquí'}
        </p>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>
          o haz clic para seleccionar (CSV, XLSX)
        </p>
      </div>

      {/* Barra de progreso */}
      {isProcessing && (
        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-zinc-600 dark:text-zinc-400'>
            <span>Procesando archivo...</span>
            <span>{progress}%</span>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700'>
            <div
              className='h-full rounded-full bg-blue-600 transition-all duration-300'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Resultados de validación */}
      {parseResult && (
        <div className='space-y-4'>
          {/* Resumen */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800'>
              <p className='text-2xl font-bold text-zinc-900 dark:text-white'>
                {parseResult.totalRows}
              </p>
              <p className='text-sm text-zinc-500'>Total filas</p>
            </div>
            <div className='rounded-lg bg-green-100 p-4 dark:bg-green-900/20'>
              <p className='text-2xl font-bold text-green-700 dark:text-green-400'>
                {parseResult.validRows.length}
              </p>
              <p className='text-sm text-green-600 dark:text-green-500'>
                Válidos
              </p>
            </div>
            <div className='rounded-lg bg-red-100 p-4 dark:bg-red-900/20'>
              <p className='text-2xl font-bold text-red-700 dark:text-red-400'>
                {parseResult.errors.length}
              </p>
              <p className='text-sm text-red-600 dark:text-red-500'>Errores</p>
            </div>
          </div>

          {/* Lista de errores */}
          {parseResult.errors.length > 0 && (
            <ErrorList errors={parseResult.errors} />
          )}

          {/* Acciones */}
          <div className='flex gap-4'>
            <button
              onClick={handleReset}
              className='flex-1 rounded-lg border border-zinc-300 px-4 py-3 font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
            >
              Cancelar
            </button>
            <button
              onClick={handleUpload}
              disabled={parseResult.validRows.length === 0 || isUploading}
              className='flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {isUploading ? (
                <span className='flex items-center justify-center gap-2'>
                  <svg
                    className='h-4 w-4 animate-spin'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    />
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                    />
                  </svg>
                  Subiendo...
                </span>
              ) : (
                `Subir ${parseResult.validRows.length} registros`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ErrorList({ errors }: { errors: UploadError[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayErrors = showAll ? errors : errors.slice(0, 5);

  return (
    <div className='rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20'>
      <h4 className='mb-3 font-medium text-red-800 dark:text-red-300'>
        Errores encontrados ({errors.length})
      </h4>
      <ul className='space-y-2'>
        {displayErrors.map((error, index) => (
          <li key={index} className='text-sm text-red-700 dark:text-red-400'>
            <span className='font-medium'>Fila {error.row}:</span>{' '}
            <span className='font-mono text-xs'>{error.field}</span> ={' '}
            <span className='font-mono text-xs'>"{String(error.value)}"</span> →{' '}
            {error.message}
          </li>
        ))}
      </ul>
      {errors.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className='mt-3 text-sm font-medium text-red-600 hover:underline dark:text-red-400'
        >
          {showAll ? 'Mostrar menos' : `Ver ${errors.length - 5} errores más`}
        </button>
      )}
    </div>
  );
}
