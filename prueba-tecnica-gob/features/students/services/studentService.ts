import { api } from '@/lib/api';
import type { Student, DashboardStats, StudentUploadRow } from '@/types';

export interface BulkUploadResponse {
  success: boolean;
  inserted: number;
  errors: { row: number; message: string }[];
}

export const studentService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    students: Student[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.search) queryParams.search = params.search;

    return api.get('/students', queryParams);
  },

  getById: async (id: string): Promise<Student> => {
    return api.get<Student>(`/students/${id}`);
  },

  bulkUpload: async (
    students: StudentUploadRow[]
  ): Promise<BulkUploadResponse> => {
    return api.post<BulkUploadResponse>('/students/bulk', { students });
  },

  getStats: async (): Promise<DashboardStats> => {
    return api.get<DashboardStats>('/students/stats');
  },

  delete: async (id: string): Promise<void> => {
    return api.delete(`/students/${id}`);
  },

  checkNueExists: async (nue: number): Promise<boolean> => {
    const response = await api.get<{ exists: boolean }>(
      `/students/check-nue/${nue}`
    );
    return response.exists;
  },

  checkNameExists: async (name: string): Promise<boolean> => {
    const response = await api.get<{ exists: boolean }>(
      `/students/check-name`,
      { name }
    );
    return response.exists;
  },
};
