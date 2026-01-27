export { useGroups, useGroup, useCreateGroup, useUpdateGroup, useDeleteGroup } from './useGroups';
export { useUsers, useUser, useStudents, useTeachers, useUpdateProfile } from './useUsers';
export { useLogin, useLogout, useIsAuthenticated } from './useAuth';
export { useAudiences, useAudience, useAudienceTypes, useBuildings, useBuilding } from './useAudiences';
export {
  useSubjectTypes,
  useTimeSlots,
  useDays,
  useSubjects,
  useSubject,
  useCreateSubject,
  useUpdateSubject,
  useDeleteSubject,
  useSubjectSchedules,
  useSubjectSchedule,
  useCreateSubjectSchedule,
  useUpdateSubjectSchedule,
  useDeleteSubjectSchedule,
  useScheduleOverrides,
  useCreateScheduleOverride,
} from './useSchedules';
export { useScheduleGenerator } from './useScheduleGenerator';
export { useTheme } from './useTheme';
export { useCurrentUser } from './useCurrentUser';
export { useStudent } from './useStudent';
export { useTeacher } from './useTeacher';
export { useGroupTimetable } from './useGroupTimetable';

// Alias for backwards compatibility
export { useSubjectSchedules as useSchedules } from './useSchedules';

