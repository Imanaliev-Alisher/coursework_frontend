import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectsApi } from '@/shared/api';
import type { SubjectCreateUpdateRequest } from '@/shared/api';

export const SUBJECTS_QUERY_KEY = 'subjects';

/**
 * Хук для получения списка предметов
 */
export function useSubjects(params?: { page?: number; search?: string; ordering?: string }) {
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
    mutationFn: (data: SubjectCreateUpdateRequest) => subjectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUBJECTS_QUERY_KEY] });
      // Также инвалидируем расписание, так как предмет может быть связан с расписанием
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
    },
  });
}

/**
 * Хук для обновления предмета
 */
export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: SubjectCreateUpdateRequest }) =>
      subjectsApi.update(id, data),
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

/**
 * Хук для получения расписания группы
 */
export function useGroupTimetable(groupId: number | undefined) {
  return useQuery({
    queryKey: ['timetable', 'group', groupId],
    queryFn: () => subjectsApi.getGroupTimetable(groupId!),
    enabled: !!groupId,
  });
}

/**
 * Хук для получения расписания преподавателя
 */
export function useTeacherTimetable(teacherId: number | undefined) {
  return useQuery({
    queryKey: ['timetable', 'teacher', teacherId],
    queryFn: () => subjectsApi.getTeacherTimetable(teacherId!),
    enabled: !!teacherId,
  });
}

/**
 * Хук для получения расписания аудитории
 */
export function useAudienceTimetable(audienceId: number | undefined) {
  return useQuery({
    queryKey: ['timetable', 'audience', audienceId],
    queryFn: () => subjectsApi.getAudienceTimetable(audienceId!),
    enabled: !!audienceId,
  });
}

/**
 * Экспорт расписания группы в PDF
 */
export function useExportGroupPdf() {
  return useMutation({
    mutationFn: async (groupId: number) => {
      const blob = await subjectsApi.exportGroupPdf(groupId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schedule-group-${groupId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

/**
 * Экспорт расписания группы в Excel
 */
export function useExportGroupExcel() {
  return useMutation({
    mutationFn: async (groupId: number) => {
      const blob = await subjectsApi.exportGroupExcel(groupId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `schedule-group-${groupId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}
