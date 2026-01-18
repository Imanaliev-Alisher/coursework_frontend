import { apiClient } from './client';

export type SubjectType = {
  id: number;
  title: string;
};

export type TimeSlot = {
  id: number;
  start_time: string;
  end_time: string;
  order: number;
};

export type Day = {
  id: number;
  title: string;
  order: number;
};

export type Schedule = {
  id: number;
  subject: number;
  subject_title: string;
  day: number;
  day_title: string;
  time_slot: number;
  time_slot_start: string;
  time_slot_end: string;
  week_parity: 'odd' | 'even' | null;
};

export type ScheduleCreateUpdateRequest = {
  subject: number;
  day: number;
  time_slot: number;
  week_parity?: 'odd' | 'even' | null;
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export const subjectTypesApi = {
  /**
   * Получить список типов предметов
   */
  getAll: async (): Promise<PaginatedResponse<SubjectType>> => {
    const response = await apiClient.get<PaginatedResponse<SubjectType>>('/subject-types/');
    return response.data;
  },
};

export const timeSlotsApi = {
  /**
   * Получить список временных слотов
   */
  getAll: async (): Promise<PaginatedResponse<TimeSlot>> => {
    const response = await apiClient.get<PaginatedResponse<TimeSlot>>('/time-slots/');
    return response.data;
  },
};

export const daysApi = {
  /**
   * Получить список дней недели
   */
  getAll: async (): Promise<PaginatedResponse<Day>> => {
    const response = await apiClient.get<PaginatedResponse<Day>>('/days/');
    return response.data;
  },
};

export const schedulesApi = {
  /**
   * Получить список расписаний
   */
  getAll: async (params?: {
    page?: number;
    search?: string;
    ordering?: string;
  }): Promise<PaginatedResponse<Schedule>> => {
    const response = await apiClient.get<PaginatedResponse<Schedule>>('/schedules/', { params });
    return response.data;
  },

  /**
   * Получить детали расписания
   */
  getById: async (id: number): Promise<Schedule> => {
    const response = await apiClient.get<Schedule>(`/schedules/${id}/`);
    return response.data;
  },

  /**
   * Создать расписание
   */
  create: async (data: ScheduleCreateUpdateRequest): Promise<Schedule> => {
    const response = await apiClient.post<Schedule>('/schedules/', data);
    return response.data;
  },

  /**
   * Обновить расписание
   */
  update: async (id: number, data: ScheduleCreateUpdateRequest): Promise<Schedule> => {
    const response = await apiClient.put<Schedule>(`/schedules/${id}/`, data);
    return response.data;
  },

  /**
   * Удалить расписание
   */
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/schedules/${id}/`);
  },
};
