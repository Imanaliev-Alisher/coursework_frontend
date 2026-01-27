import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groupsApi } from '@/shared/api';
import type { StudyGroupCreateRequest } from '@/features/schedule/types';

export const GROUPS_QUERY_KEY = 'groups';

/**
 * Хук для получения списка учебных групп
 */
export function useGroups(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [GROUPS_QUERY_KEY, params],
    queryFn: () => groupsApi.getAll(params),
  });
}

/**
 * Хук для получения деталей учебной группы
 */
export function useGroup(id: number | undefined) {
  return useQuery({
    queryKey: [GROUPS_QUERY_KEY, id],
    queryFn: () => groupsApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для создания учебной группы
 */
export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudyGroupCreateRequest) => groupsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
    },
  });
}

/**
 * Хук для обновления учебной группы
 */
export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: StudyGroupCreateRequest }) =>
      groupsApi.update(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Хук для удаления учебной группы
 */
export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => groupsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY] });
    },
  });
}

/**
 * Хук для добавления студентов в группу
 */
export function useAddStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, studentIds }: { id: number; studentIds: number[] }) =>
      groupsApi.addStudents(id, studentIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY, variables.id] });
    },
  });
}

/**
 * Хук для удаления студентов из группы
 */
export function useRemoveStudents() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, studentIds }: { id: number; studentIds: number[] }) =>
      groupsApi.removeStudents(id, studentIds),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: [GROUPS_QUERY_KEY, variables.id] });
    },
  });
}
