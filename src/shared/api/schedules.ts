import { apiClient } from './client';
import type {
  TimeSlot,
  Day,
  SubjectType,
  SubjectBrief,
  SubjectDetail,
  SubjectCreateRequest,
  SubjectScheduleBrief,
  SubjectScheduleDetail,
  SubjectScheduleCreateRequest,
  ScheduleOverride,
  ScheduleOverrideCreateRequest,
  ScheduleGeneratorRequest,
  ScheduleGeneratorResponse,
  PaginatedResponse,
} from '@/features/schedule/types';

// ============ Временные слоты ============

export const timeSlotsApi = {
  /**
   * Получить список временных слотов
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<TimeSlot>> => {
    const response = await apiClient.get<PaginatedResponse<TimeSlot>>('/time-slots/', { params });
    return response.data;
  },

  /**
   * Создать временной слот
   */
  create: async (data: { number: number; start_time: string; end_time: string }): Promise<TimeSlot> => {
    const response = await apiClient.post<TimeSlot>('/time-slots/', data);
    return response.data;
  },
};

// ============ Дни недели ============

export const daysApi = {
  /**
   * Получить список дней недели
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<Day>> => {
    const response = await apiClient.get<PaginatedResponse<Day>>('/days/', { params });
    return response.data;
  },
};

// ============ Типы предметов ============

export const subjectTypesApi = {
  /**
   * Получить список типов предметов
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
  }): Promise<PaginatedResponse<SubjectType>> => {
    const response = await apiClient.get<PaginatedResponse<SubjectType>>('/subject-types/', { params });
    return response.data;
  },

  /**
   * Создать тип предмета
   */
  create: async (data: { title: string }): Promise<SubjectType> => {
    const response = await apiClient.post<SubjectType>('/subject-types/', data);
    return response.data;
  },
};

// ============ Предметы ============

export const subjectsApi = {
  /**
   * Получить список всех предметов
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    search?: string;
    subject_type?: number;
    audience?: number;
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
  create: async (data: SubjectCreateRequest): Promise<SubjectDetail> => {
    const response = await apiClient.post<SubjectDetail>('/subjects/', data);
    return response.data;
  },

  /**
   * Обновить предмет
   */
  update: async (id: number, data: SubjectCreateRequest): Promise<SubjectDetail> => {
    const response = await apiClient.put<SubjectDetail>(`/subjects/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить предмет
   */
  partialUpdate: async (id: number, data: Partial<SubjectCreateRequest>): Promise<SubjectDetail> => {
    const response = await apiClient.patch<SubjectDetail>(`/subjects/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить предмет
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/subjects/${id}/`);
  },
};

// ============ Расписание предметов ============

export const subjectSchedulesApi = {
  /**
   * Получить список расписаний
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    subject?: number;
    week_day?: number;
    time_slot?: number;
    week_type?: 'EVEN' | 'ODD' | 'BOTH';
    teachers?: number;
    groups?: number;
  }): Promise<PaginatedResponse<SubjectScheduleBrief>> => {
    const response = await apiClient.get<PaginatedResponse<SubjectScheduleBrief>>('/subject-schedules/', { params });
    return response.data;
  },

  /**
   * Получить детальное расписание предмета
   */
  getById: async (id: number): Promise<SubjectScheduleDetail> => {
    const response = await apiClient.get<SubjectScheduleDetail>(`/subject-schedules/${id}/`);
    return response.data;
  },

  /**
   * Создать расписание
   */
  create: async (data: SubjectScheduleCreateRequest): Promise<SubjectScheduleDetail> => {
    const response = await apiClient.post<SubjectScheduleDetail>('/subject-schedules/', data);
    return response.data;
  },

  /**
   * Обновить расписание
   */
  update: async (id: number, data: SubjectScheduleCreateRequest): Promise<SubjectScheduleDetail> => {
    const response = await apiClient.put<SubjectScheduleDetail>(`/subject-schedules/${id}/`, data);
    return response.data;
  },

  /**
   * Частично обновить расписание
   */
  partialUpdate: async (id: number, data: Partial<SubjectScheduleCreateRequest>): Promise<SubjectScheduleDetail> => {
    const response = await apiClient.patch<SubjectScheduleDetail>(`/subject-schedules/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить расписание
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/subject-schedules/${id}/`);
  },
};

// ============ Переопределения расписания ============

export const scheduleOverridesApi = {
  /**
   * Получить список переопределений
   */
  getAll: async (params?: {
    page?: number;
    page_size?: number;
    schedule?: number;
    date?: string;
  }): Promise<PaginatedResponse<ScheduleOverride>> => {
    const response = await apiClient.get<PaginatedResponse<ScheduleOverride>>('/schedule-overrides/', { params });
    return response.data;
  },

  /**
   * Получить детали переопределения
   */
  getById: async (id: number): Promise<ScheduleOverride> => {
    const response = await apiClient.get<ScheduleOverride>(`/schedule-overrides/${id}/`);
    return response.data;
  },

  /**
   * Создать переопределение
   */
  create: async (data: ScheduleOverrideCreateRequest): Promise<ScheduleOverride> => {
    const response = await apiClient.post<ScheduleOverride>('/schedule-overrides/', data);
    return response.data;
  },

  /**
   * Обновить переопределение
   */
  update: async (id: number, data: ScheduleOverrideCreateRequest): Promise<ScheduleOverride> => {
    const response = await apiClient.put<ScheduleOverride>(`/schedule-overrides/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить переопределение
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/schedule-overrides/${id}/`);
  },
};

// ============ Генератор расписания ============

export const scheduleGeneratorApi = {
  /**
   * Сгенерировать расписание для группы за период
   */
  generate: async (params: ScheduleGeneratorRequest): Promise<ScheduleGeneratorResponse> => {
    const response = await apiClient.post<ScheduleGeneratorResponse>('/schedule-generator/generate/', params);
    return response.data;
  },
};
