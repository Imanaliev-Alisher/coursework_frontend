import { apiClient } from './client';
import type { User, Student, Teacher, PaginatedResponse } from '@/features/schedule/types';

export const usersApi = {
  /**
   * Получить текущего пользователя
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },

  /**
   * Получить список всех пользователей
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<PaginatedResponse<User>>('/users/', { params });
    return response.data;
  },

  /**
   * Получить пользователя по ID
   */
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}/`);
    return response.data;
  },
};

export const studentsApi = {
  /**
   * Получить список всех студентов
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Student>> => {
    const response = await apiClient.get<PaginatedResponse<Student>>('/students/', { params });
    return response.data;
  },

  /**
   * Получить студента по ID
   */
  getById: async (id: number): Promise<Student> => {
    const response = await apiClient.get<Student>(`/students/${id}/`);
    return response.data;
  },

  /**
   * Получить группы студента
   */
  getStudyGroups: async (id: number) => {
    const response = await apiClient.get(`/students/${id}/study_groups/`);
    return response.data;
  },
};

export const teachersApi = {
  /**
   * Получить список всех преподавателей
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Teacher>> => {
    const response = await apiClient.get<PaginatedResponse<Teacher>>('/teachers/', { params });
    return response.data;
  },

  /**
   * Получить преподавателя по ID
   */
  getById: async (id: number): Promise<Teacher> => {
    const response = await apiClient.get<Teacher>(`/teachers/${id}/`);
    return response.data;
  },
};
