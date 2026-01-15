import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const studentSchema = z
  .object({
    nombre_estudiante: z
      .string({ message: 'Nombre es requerido' })
      .min(1, 'Nombre no puede estar vacío')
      .trim(),
    anio_inicio: z
      .number({ message: 'Año de inicio debe ser numérico' })
      .int('Año debe ser un número entero')
      .min(1900, 'Año debe ser mayor a 1900')
      .max(currentYear, `Año no puede ser mayor a ${currentYear}`),
    nue: z
      .number({ message: 'NUE debe ser numérico' })
      .int('NUE debe ser un número entero')
      .positive('NUE debe ser un número positivo'),
    promedio_actual: z
      .number({ message: 'Promedio debe ser numérico' })
      .min(0, 'Promedio no puede ser menor a 0')
      .max(10, 'Promedio no puede ser mayor a 10'),
    promedio_graduacion: z
      .number({ message: 'Promedio de graduación debe ser numérico' })
      .min(0, 'Promedio no puede ser menor a 0')
      .max(10, 'Promedio no puede ser mayor a 10')
      .nullable(),
    graduado: z.boolean({ message: 'Estado de graduación es requerido' }),
  })
  .refine(
    (data) => {
      if (data.graduado) {
        return data.promedio_actual === data.promedio_graduacion;
      }
      return true;
    },
    {
      message:
        'Promedio actual y promedio de graduación deben ser iguales si el estudiante está graduado',
      path: ['promedio_graduacion'],
    }
  );

export type StudentFormData = z.infer<typeof studentSchema>;

// Schema para validar filas del archivo
export const studentRowSchema = studentSchema;

// Función helper para parsear valores del Excel/CSV
export function parseStudentRow(
  row: Record<string, unknown>,
  rowIndex: number
): {
  data: StudentFormData | null;
  errors: { field: string; value: unknown; message: string }[];
} {
  const errors: { field: string; value: unknown; message: string }[] = [];

  // Normalizar nombres de columnas (case-insensitive)
  const normalizedRow: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    normalizedRow[key.toLowerCase().trim()] = value;
  }

  const rawData = {
    nombre_estudiante:
      normalizedRow['nombre_estudiante'] ?? normalizedRow['nombre'],
    anio_inicio: parseNumber(
      normalizedRow['anio_inicio'] ??
        normalizedRow['año_inicio'] ??
        normalizedRow['año']
    ),
    nue: parseNumber(normalizedRow['nue']),
    promedio_actual: parseNumber(
      normalizedRow['promedio_actual'] ?? normalizedRow['promedio']
    ),
    promedio_graduacion: parseNullableNumber(
      normalizedRow['promedio_graduacion']
    ),
    graduado: parseBoolean(normalizedRow['graduado']),
  };

  const result = studentSchema.safeParse(rawData);

  if (result.success) {
    return { data: result.data, errors: [] };
  }

  for (const issue of result.error.issues) {
    errors.push({
      field: issue.path.join('.'),
      value: rawData[issue.path[0] as keyof typeof rawData],
      message: issue.message,
    });
  }

  return { data: null, errors };
}

function parseNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function parseNullableNumber(value: unknown): number | null | undefined {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
}

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    return (
      lower === 'true' ||
      lower === 'si' ||
      lower === 'sí' ||
      lower === '1' ||
      lower === 'yes'
    );
  }
  if (typeof value === 'number') return value === 1;
  return false;
}
