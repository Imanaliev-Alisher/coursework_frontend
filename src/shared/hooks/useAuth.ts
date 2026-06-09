import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginRequest } from '@/shared/api';

/**
 * Хук для авторизации
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      queryClient.clear();
      return authApi.login(data);
    },
    onSuccess: (data) => {
      sessionStorage.setItem('access_token', data.access);
      sessionStorage.setItem('refresh_token', data.refresh);
    },
  });
}

/**
 * Хук для выхода
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const refreshToken = sessionStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          await authApi.logout(refreshToken);
        } catch {
          // игнорируем ошибку сервера — локальную сессию всё равно очищаем
        }
      }
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      queryClient.clear();
    },
  });
}

/**
 * Проверка, авторизован ли пользователь
 */
export function useIsAuthenticated(): boolean {
  return !!sessionStorage.getItem('access_token');
}
