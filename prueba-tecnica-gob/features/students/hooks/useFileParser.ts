'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { parseStudentRow } from '../schemas/studentSchema';
import type { StudentUploadRow, UploadError, UploadResult } from '@/types';

export function useFileParser() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const parseFile = useCallback(async (file: File): Promise<UploadResult> => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const data = await readFile(file);
      const workbook = XLSX.read(data, { type: 'array' });

      // Tomar la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convertir a JSON
      const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(
        worksheet,
        {
          defval: null,
          raw: false,
        }
      );

      const validRows: StudentUploadRow[] = [];
      const errors: UploadError[] = [];
      const totalRows = rows.length;

      // Validar unicidad de NUE y nombres dentro del archivo
      const seenNues = new Map<number, number>(); // nue -> primera fila
      const seenNames = new Map<string, number>(); // nombre -> primera fila

      for (let i = 0; i < rows.length; i++) {
        const rowNumber = i + 2; // +2 porque Excel empieza en 1 y tiene header
        const row = rows[i];

        // Actualizar progreso
        setProgress(Math.round(((i + 1) / totalRows) * 100));

        const result = parseStudentRow(row, rowNumber);

        if (result.data) {
          // Verificar duplicados dentro del archivo
          const nue = result.data.nue;
          const name = result.data.nombre_estudiante.toLowerCase();

          if (seenNues.has(nue)) {
            errors.push({
              row: rowNumber,
              field: 'nue',
              value: nue,
              message: `NUE duplicado (ya existe en fila ${seenNues.get(nue)})`,
            });
          } else if (seenNames.has(name)) {
            errors.push({
              row: rowNumber,
              field: 'nombre_estudiante',
              value: result.data.nombre_estudiante,
              message: `Nombre duplicado (ya existe en fila ${seenNames.get(
                name
              )})`,
            });
          } else {
            seenNues.set(nue, rowNumber);
            seenNames.set(name, rowNumber);
            validRows.push(result.data);
          }
        } else {
          for (const error of result.errors) {
            errors.push({
              row: rowNumber,
              field: error.field,
              value: error.value,
              message: error.message,
            });
          }
        }
      }

      return {
        success: errors.length === 0,
        validRows,
        errors,
        totalRows,
      };
    } finally {
      setIsProcessing(false);
      setProgress(100);
    }
  }, []);

  return {
    parseFile,
    isProcessing,
    progress,
  };
}

function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        resolve(e.target.result);
      } else {
        reject(new Error('Error al leer el archivo'));
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
