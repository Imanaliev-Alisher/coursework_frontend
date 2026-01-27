import { useQuery } from '@tanstack/react-query';
import { subjectSchedulesApi } from '@/shared/api';

/**
 * Получить расписание группы
 * Использует GET /subject-schedules/ с фильтром по группе
 */
export const useGroupTimetable = (
  groupId: number | undefined
) => {
  return useQuery({
    queryKey: ['groupTimetable', groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const response = await subjectSchedulesApi.getAll({
        groups: groupId,
      });
      // Возвращаем массив расписаний
      return response.results || [];
    },
    enabled: !!groupId,
    staleTime: 0, // Данные сразу считаются устаревшими
    gcTime: 0, // Не кэшировать данные вообще (заменяет cacheTime в новых версиях)
    refetchOnMount: true, // Перезапрашивать при монтировании
  });
};
