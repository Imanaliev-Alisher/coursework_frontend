import { apiClient } from './client';
import type { StudyGroupBrief, StudyGroupDetail, PaginatedResponse } from '@/features/schedule/types';

export type StudyGroupCreateUpdateRequest = {
  title: string;
  description: string;
};

export const groupsApi = {
  /**
   * Получить список всех учебных групп
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<StudyGroupBrief>> => {
    const response = await apiClient.get<PaginatedResponse<StudyGroupBrief>>('/study-groups/', { params });
    return response.data;
  },

  /**
   * Получить детали учебной группы
   */
  getById: async (id: number): Promise<StudyGroupDetail> => {
    const response = await apiClient.get<StudyGroupDetail>(`/study-groups/${id}/`);
    return response.data;
  },

  /**
   * Создать учебную группу
   */
  create: async (data: StudyGroupCreateUpdateRequest): Promise<StudyGroupDetail> => {
    const response = await apiClient.post<StudyGroupDetail>('/study-groups/', data);
    return response.data;
  },

  /**
   * Обновить учебную группу
   */
  update: async (id: number, data: StudyGroupCreateUpdateRequest): Promise<StudyGroupDetail> => {
    const response = await apiClient.put<StudyGroupDetail>(`/study-groups/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить учебную группу
   */
  partialUpdate: async (id: number, data: Partial<StudyGroupCreateUpdateRequest>): Promise<StudyGroupDetail> => {
    const response = await apiClient.patch<StudyGroupDetail>(`/study-groups/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить учебную группу
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/study-groups/${id}/`);
  },

  /**
   * Добавить студентов в группу
   */
  addStudents: async (id: number, studentIds: number[]): Promise<StudyGroupDetail> => {
    const response = await apiClient.post<StudyGroupDetail>(
      `/study-groups/${id}/add_students/`,
      { student_ids: studentIds }
    );
    return response.data;
  },

  /**
   * Удалить студентов из группы
   */
  removeStudents: async (id: number, studentIds: number[]): Promise<StudyGroupDetail> => {
    const response = await apiClient.post<StudyGroupDetail>(
      `/study-groups/${id}/remove_students/`,
      { student_ids: studentIds }
    );
    return response.data;
  },
};
