import { useQuery } from '@tanstack/react-query';
import { usersApi, studentsApi, teachersApi } from '@/shared/api';

export const USERS_QUERY_KEY = 'users';
export const STUDENTS_QUERY_KEY = 'students';
export const TEACHERS_QUERY_KEY = 'teachers';

/**
 * Хук для получения текущего пользователя
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'me'],
    queryFn: () => usersApi.getMe(),
  });
}

/**
 * Хук для получения списка пользователей
 */
export function useUsers(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, params],
    queryFn: () => usersApi.getAll(params),
  });
}

/**
 * Хук для получения списка студентов
 */
export function useStudents(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [STUDENTS_QUERY_KEY, params],
    queryFn: () => studentsApi.getAll(params),
  });
}

/**
 * Хук для получения студента по ID
 */
export function useStudent(id: number | undefined) {
  return useQuery({
    queryKey: [STUDENTS_QUERY_KEY, id],
    queryFn: () => studentsApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для получения списка преподавателей
 */
export function useTeachers(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [TEACHERS_QUERY_KEY, params],
    queryFn: () => teachersApi.getAll(params),
  });
}

/**
 * Хук для получения преподавателя по ID
 */
export function useTeacher(id: number | undefined) {
  return useQuery({
    queryKey: [TEACHERS_QUERY_KEY, id],
    queryFn: () => teachersApi.getById(id!),
    enabled: !!id,
  });
}
