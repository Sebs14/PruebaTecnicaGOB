export interface Student {
  id: string;
  nombre_estudiante: string;
  anio_inicio: number;
  nue: number;
  promedio_actual: number;
  promedio_graduacion: number | null;
  graduado: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface StudentUploadRow {
  nombre_estudiante: string;
  anio_inicio: number;
  nue: number;
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
  averageGrade: number;
  studentsByYear: { year: number; count: number }[];
  gradeDistribution: { range: string; count: number }[];
}
