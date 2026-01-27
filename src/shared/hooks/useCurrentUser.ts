import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/shared/api';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await usersApi.getMe();
      return response;
    },
  });
};
