// ============ Базовые типы ============

export type RoleEnum = 'STUDENT' | 'TEACHER' | 'STAFF';

export type GenderEnum = 'M' | 'F' | 'N';

export type WeekTypeEnum = 'Четные' | 'Нечетные' | 'Все';

// ============ Пользователи ============

export type User = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  date_of_birth?: string;
  gender?: GenderEnum;
  role?: RoleEnum;
  date_joined: string;
  full_name?: string;
  is_staff?: boolean;
  is_active?: boolean;
};

export type Student = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  study_groups?: StudyGroupBrief[];
};

export type Teacher = {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  patronymic?: string;
  full_name?: string;
  department?: string;
  phone_number?: string;
  cabinet?: string;
};

// ============ Учебные группы ============

export type StudyGroupBrief = {
  id: number;
  title: string;
  description: string;
  students_count: number;
};

export type StudyGroupDetail = {
  id: number;
  title: string;
  description: string;
  students_count: number;
  students: StudentBrief[];
};

export type StudentBrief = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
};

// ============ Здания и аудитории ============

export type Building = {
  id: number;
  title: string;
  country: string;
  country_name: string;
  city: string;
  street: string;
  house_number: string;
  address: string;
  audiences_count: number;
};

export type BuildingDetail = Building & {
  audiences: AudienceBrief[];
};

export type AudienceType = {
  id: number;
  title: string;
};

export type AudienceBrief = {
  id: number;
  title: string;
  auditorium_number: string;
  floor_number: number;
  building: number;
  building_name: string;
  auditorium_type: number;
  auditorium_type_name: string;
};

export type AudienceDetail = AudienceBrief & {
  building_address: string;
  auditorium_type_details: AudienceType;
};

// ============ Временные слоты и дни недели ============

export type TimeSlot = {
  id: number;
  number: number;
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  display_name: string;
};

export type Day = {
  id: number;
  title: string;
};

// ============ Расписание ============

export type ScheduleItem = {
  id: number;
  week_day: number;
  week_day_name: string;
  time_slot: number;
  time_slot_display: string;
};

export type ScheduleDetail = {
  id: number;
  week_day: number;
  week_day_details: Day;
  time_slot: number;
  time_slot_details: TimeSlot;
};

// ============ Типы предметов ============

export type SubjectType = {
  id: number;
  title: string;
};

// ============ Предметы ============

export type SubjectBrief = {
  id: number;
  title: string;
  subject_type: number;
  subject_type_name: string;
  audience: number;
  audience_name: string;
  teachers_count: number;
  groups_count: number;
};

export type SubjectDetail = {
  id: number;
  title: string;
  subject_type: number;
  subject_type_details: SubjectType;
  audience: number;
  audience_details: AudienceDetail;
  schedule: number[];
  schedule_details: ScheduleDetail[];
  teachers: number[];
  teachers_details: Teacher[];
  groups: number[];
  groups_details: StudyGroupBrief[];
};

// ============ Переопределения расписания ============

export type ScheduleOverride = {
  id: number;
  subject: number;
  subject_title: string;
  date: string; // YYYY-MM-DD
  time_slot: number;
  time_slot_display: string;
  new_audience?: number;
  audience_display: string;
  is_cancelled: boolean;
  reason?: string;
};

// ============ Таблица расписания (для отображения) ============

export type TimetableEntry = {
  day: string;
  time_slot: string;
  subject: string;
  subject_type: string;
  audience: string;
  teacher?: string;
  group?: string;
  week_parity?: 'odd' | 'even' | null;
  // Реальные поля из API
  teachers?: string[];
  groups?: string[];
  week_type?: string;
};

// ============ Пагинация ============

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

// ============ Устаревшие типы (совместимость с мок-данными) ============

export type LessonStatus = 'done' | 'planned' | 'canceled' | 'moved';

export type LessonType = 'lecture' | 'practice' | 'lab';

export type Lesson = {
  id: string;
  startsAtIso: string;
  endsAtIso: string;
  groupCode: string;
  subject: string;
  teacher: string;
  room: string;
  lessonType: LessonType;
  status: LessonStatus;
};
