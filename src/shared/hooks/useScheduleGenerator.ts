import { useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleGeneratorApi } from '@/shared/api';

export interface GenerateScheduleParams {
  group_id: number;
  subject_ids: number[];
  clear_existing?: boolean;
  prefer_morning?: boolean;
  time_range?: string; // 'morning' | 'mixed' | 'afternoon' | 'evening' | 'full'
  custom_start_time?: string; // HH:MM format
  custom_end_time?: string; // HH:MM format
  start_day_id: number;
  end_day_id: number;
}

export function useScheduleGenerator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GenerateScheduleParams) => {
      const response = await scheduleGeneratorApi.generate(params);
      return response;
    },
    onSuccess: () => {
      // Invalidate schedules and timetable queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      queryClient.invalidateQueries({ queryKey: ['timetable'] });
      queryClient.invalidateQueries({ queryKey: ['scheduleGenerator'] });
    },
  });
}
