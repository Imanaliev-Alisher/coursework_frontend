import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  subjectTypesApi,
  timeSlotsApi,
  daysApi,
  subjectsApi,
  subjectSchedulesApi,
  scheduleOverridesApi,
  scheduleGeneratorApi,
} from '@/shared/api';
import type {
  SubjectCreateRequest,
  SubjectScheduleCreateRequest,
  ScheduleOverrideCreateRequest,
  ScheduleGeneratorRequest,
} from '@/features/schedule/types';

export const SUBJECTS_QUERY_KEY = 'subjects';
export const SCHEDULES_QUERY_KEY = 'schedules';
export const OVERRIDES_QUERY_KEY = 'schedule-overrides';

// ============ Типы предметов ============

/**
 * Хук для получения типов предметов
 */
export function useSubjectTypes() {
  return useQuery({
    queryKey: ['subjectTypes'],
    queryFn: () => subjectTypesApi.getAll(),
  });
}

// ============ Временные слоты ============

/**
 * Хук для получения временных слотов
 */
export function useTimeSlots() {
  return useQuery({
    queryKey: ['timeSlots'],
    queryFn: () => timeSlotsApi.getAll(),
  });
}

// ============ Дни недели ============

/**
 * Хук для получения дней недели
 */
export function useDays() {
  return useQuery({
    queryKey: ['days'],
    queryFn: () => daysApi.getAll(),
  });
}

// ============ Предметы ============

/**
 * Хук для получения списка предметов
 */
export function useSubjects(params?: {
  page?: number;
  page_size?: number;
  search?: string;
  subject_type?: number;
  audience?: number;
  ordering?: string;
}) {
  return useQuery({
    queryKey: [SUBJECTS_QUERY_KEY, params],
    queryFn: () => subjectsApi.getAll(params),
  });
}

/**
 * Хук для получения деталей предмета
 */
export function useSubject(id: number | undefined) {
  return useQuery({
    queryKey: [SUBJECTS_QUERY_KEY, id],
    queryFn: () => subjectsApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для создания предмета
 */
export function useCreateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubjectCreateRequest) => subjectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
    },
  });
}

/**
 * Хук для обновления предмета
 */
export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectCreateRequest }) => subjectsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Хук для удаления предмета
 */
export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subjectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
    },
  });
}

// ============ Расписание предметов ============

/**
 * Хук для получения списка расписаний
 */
export function useSubjectSchedules(params?: {
  page?: number;
  page_size?: number;
  subject?: number;
  week_day?: number;
  time_slot?: number;
  week_type?: 'EVEN' | 'ODD' | 'BOTH';
  teachers?: number;
  groups?: number;
}) {
  return useQuery({
    queryKey: [SCHEDULES_QUERY_KEY, params],
    queryFn: () => subjectSchedulesApi.getAll(params),
  });
}

/**
 * Хук для получения деталей расписания
 */
export function useSubjectSchedule(id: number | undefined) {
  return useQuery({
    queryKey: [SCHEDULES_QUERY_KEY, id],
    queryFn: () => subjectSchedulesApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для создания расписания
 */
export function useCreateSubjectSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubjectScheduleCreateRequest) => subjectSchedulesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
}

/**
 * Хук для обновления расписания
 */
export function useUpdateSubjectSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectScheduleCreateRequest }) =>
      subjectSchedulesApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Хук для удаления расписания
 */
export function useDeleteSubjectSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => subjectSchedulesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SCHEDULES_QUERY_KEY] });
    },
  });
}

// ============ Переопределения расписания ============

/**
 * Хук для получения списка переопределений
 */
export function useScheduleOverrides(params?: {
  page?: number;
  page_size?: number;
  schedule?: number;
  date?: string;
}) {
  return useQuery({
    queryKey: [OVERRIDES_QUERY_KEY, params],
    queryFn: () => scheduleOverridesApi.getAll(params),
  });
}

/**
 * Хук для создания переопределения
 */
export function useCreateScheduleOverride() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ScheduleOverrideCreateRequest) => scheduleOverridesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OVERRIDES_QUERY_KEY] });
    },
  });
}

// ============ Генератор расписания ============

/**
 * Хук для получения расписания группы за период (только для чтения)
 * Примечание: для генерации расписания используйте useScheduleGenerator из отдельного файла
 */
export function useScheduleGeneratorQuery(params: ScheduleGeneratorRequest) {
  return useQuery({
    queryKey: ['scheduleGenerator', params],
    queryFn: () => scheduleGeneratorApi.generate(params),
    enabled: !!params.group_id && !!params.subject_ids && params.subject_ids.length > 0,
  });
}
