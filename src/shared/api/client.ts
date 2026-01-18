import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Callback для навигации при ошибке авторизации
let navigationCallback: (() => void) | null = null;

export const setNavigationCallback = (cb: () => void) => {
  navigationCallback = cb;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерсептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор для обработки ошибок авторизации
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Если обновление токена не удалось, очищаем localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Перенаправляем на страницу входа через callback
        if (navigationCallback) {
          navigationCallback();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
