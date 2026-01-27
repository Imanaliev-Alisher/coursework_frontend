import { apiClient } from './client';
import type {
  Building,
  BuildingCreateRequest,
  AudienceType,
  AudienceBrief,
  AudienceDetail,
  AudienceCreateRequest,
  PaginatedResponse,
} from '@/features/schedule/types';

export const buildingsApi = {
  /**
   * Получить список всех зданий
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    ordering?: string;
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

  /**
   * Создать здание
   */
  create: async (data: BuildingCreateRequest): Promise<Building> => {
    const response = await apiClient.post<Building>('/buildings/', data);
    return response.data;
  },

  /**
   * Обновить здание
   */
  update: async (id: number, data: BuildingCreateRequest): Promise<Building> => {
    const response = await apiClient.put<Building>(`/buildings/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить здание
   */
  partialUpdate: async (id: number, data: Partial<BuildingCreateRequest>): Promise<Building> => {
    const response = await apiClient.patch<Building>(`/buildings/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить здание
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/buildings/${id}/`);
  },
};

export const audienceTypesApi = {
  /**
   * Получить список типов аудиторий
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<AudienceType>> => {
    const response = await apiClient.get<PaginatedResponse<AudienceType>>('/audience-types/', { params });
    return response.data;
  },

  /**
   * Создать тип аудитории
   */
  create: async (data: { title: string }): Promise<AudienceType> => {
    const response = await apiClient.post<AudienceType>('/audience-types/', data);
    return response.data;
  },
};

export const audiencesApi = {
  /**
   * Получить список всех аудиторий
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    building?: number;
    auditorium_type?: number;
    floor_number?: number;
    ordering?: string;
  }): Promise<PaginatedResponse<AudienceBrief>> => {
    const response = await apiClient.get<PaginatedResponse<AudienceBrief>>('/audiences/', { params });
    return response.data;
  },

  /**
   * Получить детали аудитории
   */
  getById: async (id: number): Promise<AudienceDetail> => {
    const response = await apiClient.get<AudienceDetail>(`/audiences/${id}/`);
    return response.data;
  },

  /**
   * Создать аудиторию
   */
  create: async (data: AudienceCreateRequest): Promise<AudienceDetail> => {
    const response = await apiClient.post<AudienceDetail>('/audiences/', data);
    return response.data;
  },

  /**
   * Обновить аудиторию
   */
  update: async (id: number, data: AudienceCreateRequest): Promise<AudienceDetail> => {
    const response = await apiClient.put<AudienceDetail>(`/audiences/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить аудиторию
   */
  partialUpdate: async (id: number, data: Partial<AudienceCreateRequest>): Promise<AudienceDetail> => {
    const response = await apiClient.patch<AudienceDetail>(`/audiences/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить аудиторию
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/audiences/${id}/`);
  },

  /**
   * Получить список типов аудиторий (alias)
   */
  getTypes: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<AudienceType>> => {
    return audienceTypesApi.getAll(params);
  },
};
