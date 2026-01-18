import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectTypesApi, timeSlotsApi, daysApi, schedulesApi } from '@/shared/api';
import type { ScheduleCreateUpdateRequest } from '@/shared/api';

export const SCHEDULES_QUERY_KEY = 'schedules';

/**
 * Хук для получения типов предметов
 */
export function useSubjectTypes() {
  return useQuery({
    queryKey: ['subjectTypes'],
    queryFn: () => subjectTypesApi.getAll(),
  });
}

/**
 * Хук для получения временных слотов
 */
export function useTimeSlots() {
  return useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => timeSlotsApi.getAll(),
  });
}

/**
 * Хук для получения дней недели
 */
export function useDays() {
  return useQuery({
    queryKey: ['days'],
    queryFn: () => daysApi.getAll(),
  });
}

/**
 * Хук для получения списка расписаний
 */
export function useSchedules(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [SCHEDULES_QUERY_KEY, params],
    queryFn: () => schedulesApi.getAll(params),
  });
}

/**
 * Хук для получения деталей расписания
 */
export function useSchedule(id: number | undefined) {
  return useQuery({
    queryKey: [SCHEDULES_QUERY_KEY, id],
    queryFn: () => schedulesApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для создания расписания
 */
export function useCreateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleCreateUpdateRequest) => schedulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
}

/**
 * Хук для обновления расписания
 */
export function useUpdateSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScheduleCreateUpdateRequest }) =>
      schedulesApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Хук для удаления расписания
 */
export function useDeleteSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => schedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
}
