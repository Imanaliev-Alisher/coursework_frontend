import { apiClient } from './client';
import type { User, Student, Teacher, UserCreateRequest, PaginatedResponse } from '@/features/schedule/types';

export const usersApi = {
  /**
   * Получить список всех пользователей
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    role?: 'STUDENT' | 'TEACHER';
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

  /**
   * Создать пользователя
   */
  create: async (data: UserCreateRequest): Promise<User> => {
    const response = await apiClient.post<User>('/users/', data);
    return response.data;
  },

  /**
   * Обновить пользователя
   */
  update: async (id: number, data: Partial<UserCreateRequest>): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить пользователя
   */
  partialUpdate: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить пользователя
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}/`);
  },

  /**
   * Получить текущего пользователя
   */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me/');
    return response.data;
  },
};

export const studentsApi = {
  /**
   * Получить список всех студентов
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
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
};

export const teachersApi = {
  /**
   * Получить список всех преподавателей
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
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
