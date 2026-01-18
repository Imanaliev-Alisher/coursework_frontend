export { apiClient } from './client';
export { authApi } from './auth';
export { subjectsApi } from './subjects';
export { groupsApi } from './groups';
export { usersApi, studentsApi, teachersApi } from './users';
export { audiencesApi, buildingsApi } from './audiences';
export { subjectTypesApi, timeSlotsApi, daysApi, schedulesApi } from './schedules';

export type { LoginRequest, LoginResponse } from './auth';
export type { SubjectCreateUpdateRequest } from './subjects';
export type { StudyGroupCreateUpdateRequest } from './groups';
export type { Audience, AudienceType, Building } from './audiences';
export type { SubjectType, TimeSlot, Day, Schedule, ScheduleCreateUpdateRequest } from './schedules';
