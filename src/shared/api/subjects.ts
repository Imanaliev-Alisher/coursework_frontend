import { apiClient } from './client';
import type {
  SubjectBrief,
  SubjectDetail,
  PaginatedResponse,
  TimetableEntry,
} from '@/features/schedule/types';

export type SubjectCreateUpdateRequest = {
  title: string;
  subject_type: number;
  audience: number;
  teachers?: number[];
  groups?: number[];
  schedule?: number[];
};

export const subjectsApi = {
  /**
   * Получить список всех предметов
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<SubjectBrief>> => {
    const response = await apiClient.get<PaginatedResponse<SubjectBrief>>('/subjects/', { params });
    return response.data;
  },

  /**
   * Получить детали предмета
   */
  getById: async (id: number): Promise<SubjectDetail> => {
    const response = await apiClient.get<SubjectDetail>(`/subjects/${id}/`);
    return response.data;
  },

  /**
   * Создать предмет
   */
  create: async (data: SubjectCreateUpdateRequest): Promise<SubjectDetail> => {
    const response = await apiClient.post<SubjectDetail>('/subjects/', data);
    return response.data;
  },

  /**
   * Обновить предмет
   */
  update: async (id: number, data: SubjectCreateUpdateRequest): Promise<SubjectDetail> => {
    const response = await apiClient.put<SubjectDetail>(`/subjects/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить предмет
   */
  partialUpdate: async (id: number, data: Partial<SubjectCreateUpdateRequest>): Promise<SubjectDetail> => {
    const response = await apiClient.patch<SubjectDetail>(`/subjects/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить предмет
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/subjects/${id}/`);
  },

  /**
   * Получить расписание группы
   */
  getGroupTimetable: async (groupId: number): Promise<TimetableEntry[]> => {
    const response = await apiClient.get<TimetableEntry[]>('/subjects/group_timetable/', {
      params: { group_id: groupId },
    });
    return response.data;
  },

  /**
   * Получить расписание преподавателя
   */
  getTeacherTimetable: async (teacherId: number): Promise<TimetableEntry[]> => {
    const response = await apiClient.get<TimetableEntry[]>('/subjects/teacher_timetable/', {
      params: { teacher_id: teacherId },
    });
    return response.data;
  },

  /**
   * Получить расписание аудитории
   */
  getAudienceTimetable: async (audienceId: number): Promise<TimetableEntry[]> => {
    const response = await apiClient.get<TimetableEntry[]>('/subjects/audience_timetable/', {
      params: { audience_id: audienceId },
    });
    return response.data;
  },

  /**
   * Экспорт расписания группы в PDF
   */
  exportGroupPdf: async (groupId: number): Promise<Blob> => {
    const response = await apiClient.get('/subjects/export_group_pdf/', {
      params: { group_id: groupId },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Экспорт расписания группы в Excel
   */
  exportGroupExcel: async (groupId: number): Promise<Blob> => {
    const response = await apiClient.get('/subjects/export_group_excel/', {
      params: { group_id: groupId },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Экспорт расписания преподавателя в PDF
   */
  exportTeacherPdf: async (teacherId: number): Promise<Blob> => {
    const response = await apiClient.get('/subjects/export_teacher_pdf/', {
      params: { teacher_id: teacherId },
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Экспорт расписания преподавателя в Excel
   */
  exportTeacherExcel: async (teacherId: number): Promise<Blob> => {
    const response = await apiClient.get('/subjects/export_teacher_excel/', {
      params: { teacher_id: teacherId },
      responseType: 'blob',
    });
    return response.data;
  },
};
