import { apiClient } from './client';

export type Audience = {
  id: number;
  title: string;
  type: number;
  type_name: string;
  building: number;
  building_name: string;
  capacity: number;
};

export type AudienceType = {
  id: number;
  title: string;
};

export type Building = {
  id: number;
  title: string;
  address: string;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const audiencesApi = {
  /**
   * Получить список аудиторий
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Audience>> => {
    const response = await apiClient.get<PaginatedResponse<Audience>>('/audiences/', { params });
    return response.data;
  },

  /**
   * Получить детали аудитории
   */
  getById: async (id: number): Promise<Audience> => {
    const response = await apiClient.get<Audience>(`/audiences/${id}/`);
    return response.data;
  },

  /**
   * Получить типы аудиторий
   */
  getTypes: async (): Promise<PaginatedResponse<AudienceType>> => {
    const response = await apiClient.get<PaginatedResponse<AudienceType>>('/audience-types/');
    return response.data;
  },
};

export const buildingsApi = {
  /**
   * Получить список зданий
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
  }): Promise<PaginatedResponse<Building>> => {
    const response = await apiClient.get<PaginatedResponse<Building>>('/buildings/', { params });
    return response.data;
  },

  /**
   * Получить детали здания
   */
  getById: async (id: number): Promise<Building> => {
    const response = await apiClient.get<Building>(`/buildings/${id}/`);
    return response.data;
  },
};
