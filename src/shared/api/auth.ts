import { apiClient } from './client';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access: string;
  refresh: string;
};

export type RefreshTokenRequest = {
  refresh: string;
};

export type RefreshTokenResponse = {
  access: string;
};

export const authApi = {
  /**
   * Получить токены доступа
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/token/', data);
    return response.data;
  },

  /**
   * Обновить access токен
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/token/refresh/', data);
    return response.data;
  },

  /**
   * Проверить токен
   */
  verifyToken: async (token: string): Promise<void> => {
    await apiClient.post('/auth/token/verify/', { token });
  },

  /**
   * Выйти из системы (инвалидировать refresh-токен на сервере)
   */
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/users/logout/', { refresh: refreshToken });
  },
};
