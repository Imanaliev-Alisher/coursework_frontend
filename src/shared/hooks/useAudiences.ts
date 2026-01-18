import { useQuery } from '@tanstack/react-query';
import { audiencesApi, buildingsApi } from '@/shared/api';

export const AUDIENCES_QUERY_KEY = 'audiences';
export const BUILDINGS_QUERY_KEY = 'buildings';

/**
 * Хук для получения списка аудиторий
 */
export function useAudiences(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: [AUDIENCES_QUERY_KEY, params],
    queryFn: () => audiencesApi.getAll(params),
  });
}

/**
 * Хук для получения деталей аудитории
 */
export function useAudience(id: number | undefined) {
  return useQuery({
    queryKey: [AUDIENCES_QUERY_KEY, id],
    queryFn: () => audiencesApi.getById(id!),
    enabled: !!id,
  });
}

/**
 * Хук для получения типов аудиторий
 */
export function useAudienceTypes() {
  return useQuery({
    queryKey: ['audienceTypes'],
    queryFn: () => audiencesApi.getTypes(),
  });
}

/**
 * Хук для получения списка зданий
 */
export function useBuildings(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: [BUILDINGS_QUERY_KEY, params],
    queryFn: () => buildingsApi.getAll(params),
  });
}

/**
 * Хук для получения деталей здания
 */
export function useBuilding(id: number | undefined) {
  return useQuery({
    queryKey: [BUILDINGS_QUERY_KEY, id],
    queryFn: () => buildingsApi.getById(id!),
    enabled: !!id,
  });
}
