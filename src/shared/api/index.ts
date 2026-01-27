export { apiClient, setNavigationCallback } from './client';
export { authApi } from './auth';
export { groupsApi } from './groups';
export { usersApi, studentsApi, teachersApi } from './users';
export { audiencesApi, buildingsApi, audienceTypesApi } from './audiences';
export {
  subjectTypesApi,
  timeSlotsApi,
  daysApi,
  subjectsApi,
  subjectSchedulesApi,
  scheduleOverridesApi,
  scheduleGeneratorApi,
} from './schedules';

export type { LoginRequest, LoginResponse } from './auth';
export type { StudyGroupCreateRequest } from '@/features/schedule/types';
export type { SubjectCreateRequest as SubjectCreateUpdateRequest } from '@/features/schedule/types';
