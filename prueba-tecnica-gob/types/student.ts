export interface Student {
  id: string;
  nombreEstudiante: string;
  anioInicio: number;
  nue: string;
  genero: string;
  promedioActual: number;
  promedioGraduacion: number | null;
  graduado: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentUploadRow {
  nombre_estudiante: string;
  anio_inicio: number;
  nue: number;
  genero?: string;
  promedio_actual: number;
  promedio_graduacion: number | null;
  graduado: boolean;
}

export interface UploadError {
  row: number;
  field: string;
  value: unknown;
  message: string;
}

export interface UploadResult {
  success: boolean;
  validRows: StudentUploadRow[];
  errors: UploadError[];
  totalRows: number;
}

export interface DashboardStats {
  totalStudents: number;
  graduatedStudents: number;
  activeStudents: number;
  averageScore: number;
  byGender: Record<string, number>;
  byYear: Record<number, number>;
}
