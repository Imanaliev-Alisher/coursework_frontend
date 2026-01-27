import { useQuery } from '@tanstack/react-query';
import { teachersApi } from '@/shared/api';

export const useTeacher = (id: number) => {
  return useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teachersApi.getById(id),
    enabled: !!id,
  });
};
