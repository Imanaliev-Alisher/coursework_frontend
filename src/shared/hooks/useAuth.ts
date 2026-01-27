import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi, type LoginRequest } from '@/shared/api';

/**
 * Хук для авторизации
 */
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      // Очищаем старую сессию перед входом
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Очищаем весь кэш React Query (удаляем данные предыдущего пользователя)
      queryClient.clear();
      
      // Выполняем вход
      return authApi.login(data);
    },
    onSuccess: (data) => {
      // Сохраняем новые токены
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
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
      // Удаляем токены
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      // Очищаем весь кэш React Query
      queryClient.clear();
    },
  });
}

/**
 * Проверка, авторизован ли пользователь
 */
export function useIsAuthenticated(): boolean {
  return !!localStorage.getItem('access_token');
}
