import { useQuery } from '@tanstack/react-query';
import { studentsApi } from '@/shared/api';

export const useStudent = (id: number) => {
  return useQuery({
    queryKey: ['student', id],
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
};
