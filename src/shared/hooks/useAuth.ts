import { useMutation } from '@tanstack/react-query';
import { authApi, type LoginRequest } from '@/shared/api';

/**
 * Хук для авторизации
 */
export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
    },
  });
}

/**
 * Хук для выхода
 */
export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    },
  });
}

/**
 * Проверка, авторизован ли пользователь
 */
export function useIsAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}
