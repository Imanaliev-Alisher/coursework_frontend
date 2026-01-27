// ============ Базовые типы ============

export type RoleEnum = 'STUDENT' | 'TEACHER';

export type GenderEnum = 'M' | 'F' | 'O'; // M-мужской, F-женский, O-не указано

export type WeekTypeEnum = 'EVEN' | 'ODD' | 'BOTH'; // EVEN-четная, ODD-нечетная, BOTH-обе недели

// ============ Пользователи ============

export type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string; // Computed field
  gender: GenderEnum;
  role: RoleEnum;
  department?: string; // Кафедра (для преподавателей)
  phone?: string;
  office?: string; // Кабинет (для преподавателей)
  is_active: boolean;
  date_joined: string; // ISO 8601
  is_staff: boolean;
};

export type UserCreateRequest = {
  username: string;
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  gender: GenderEnum;
  role: RoleEnum;
  department?: string;
  phone?: string;
  office?: string;
};

export type Student = User & {
  role: 'STUDENT';
  study_groups?: string[]; // Array of group titles student belongs to
};

export type Teacher = User & {
  role: 'TEACHER';
  department?: string;
  phone?: string;
  phone_number?: string; // Alias for phone
  office?: string;
  cabinet?: string; // Alias for office
};

// ============ Учебные группы ============

export type StudyGroupBrief = {
  id: number;
  title: string;
  description: string;
  faculty?: string;
  course?: number; // 1-6
  is_active: boolean;
  students_count: number;
};

export type StudyGroupDetail = {
  id: number;
  title: string;
  description: string;
  faculty?: string;
  course?: number;
  is_active: boolean;
  students: StudentBrief[];
  students_count: number;
};

export type StudyGroupCreateRequest = {
  title: string;
  description: string;
  faculty?: string;
  course?: number;
  is_active: boolean;
  student_ids?: number[];
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
  country: string; // ISO код страны (KG, RU, KZ)
  region?: string;
  city: string;
  street: string;
  house_number: string;
  address: string; // Автоматически сформированный полный адрес
};

export type BuildingCreateRequest = {
  title: string;
  country: string;
  region?: string;
  city: string;
  street: string;
  house_number: string;
};

export type AudienceType = {
  id: number;
  title: string;
};

export type AudienceBrief = {
  id: number;
  title: string; // Автоматически формируется
  auditorium_number: number;
  auditorium_type: number; // FK to AudienceType
  auditorium_type_name?: string; // Только для чтения
  type_name?: string; // Alias for auditorium_type_name
  capacity?: number;
  floor_number: number;
  building: number; // FK to Building
  building_name?: string; // Только для чтения
};

export type AudienceDetail = {
  id: number;
  title: string;
  auditorium_number: number;
  auditorium_type: number;
  auditorium_type_details?: AudienceType; // Детальный view
  floor_number: number;
  building: number;
  building_name?: string;
  building_address?: string; // Только для чтения
};

export type AudienceCreateRequest = {
  auditorium_number: number;
  auditorium_type: number;
  floor_number: number;
  building: number;
  title?: string; // Необязательно, сформируется автоматически
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

export type SubjectScheduleBrief = {
  id: number;
  subject: number; // FK to Subject
  subject_title?: string; // Только для чтения
  subject_type?: string; // Тип предмета для отображения
  week_day: number; // FK to Day
  week_day_name?: string; // Только для чтения
  time_slot: number; // FK to TimeSlot
  time_slot_display?: string; // Только для чтения
  week_type: WeekTypeEnum | 'Все' | 'Четные' | 'Нечетные'; // Week type
  teachers_count?: number; // Списковый view
  groups_count?: number; // Списковый view
  audience_details?: {
    id: number;
    title: string;
    number: number;
    floor: number;
    building: string;
  };
  teachers_details?: Array<{
    id: number;
    username: string;
    full_name: string;
  }>;
  groups_details?: Array<{
    id: number;
    title: string;
  }>;
};

export type SubjectScheduleDetail = {
  id: number;
  subject: number;
  week_day: number;
  week_day_details?: Day; // Детальный view
  time_slot: number;
  time_slot_details?: TimeSlot; // Детальный view
  week_type: WeekTypeEnum;
  teachers: number[]; // FK to User (role=TEACHER)
  teachers_details?: Array<{
    id: number;
    username: string;
    full_name: string;
    email: string;
  }>; // Детальный view
  groups: number[]; // FK to StudyGroup
  groups_details?: Array<{
    id: number;
    title: string;
    is_active: boolean;
    students_count: number;
  }>; // Детальный view
};

export type SubjectScheduleCreateRequest = {
  subject: number;
  week_day: number;
  time_slot: number;
  week_type: WeekTypeEnum;
  teacher_ids: number[];
  group_ids: number[];
};

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
  title: string; // "Лекция", "Практика", "Лабораторная работа"
};

// ============ Предметы ============

export type SubjectBrief = {
  id: number;
  title: string;
  audience: number; // FK to Audience
  audience_details?: AudienceDetail; // Детальный view
  audience_name?: string; // Read-only
  subject_type: number; // FK to SubjectType
  subject_type_name?: string; // Только для чтения
  groups_count?: number;
  teachers_count?: number;
};

export type SubjectDetail = {
  id: number;
  title: string;
  audience: number;
  audience_details?: AudienceDetail;
  subject_type: number;
  subject_type_name?: string;
  teachers?: number[];
  groups?: number[];
};

export type SubjectCreateRequest = {
  title: string;
  audience: number;
  subject_type: number;
};

// ============ Переопределения расписания ============

export type ScheduleOverride = {
  id: number;
  schedule: number; // FK to SubjectSchedule
  date: string; // YYYY-MM-DD
  is_cancelled: boolean;
  replacement_audience?: number; // FK to Audience
  replacement_teacher?: number; // FK to User
  notes?: string;
};

export type ScheduleOverrideCreateRequest = {
  schedule: number;
  date: string;
  is_cancelled: boolean;
  replacement_audience?: number;
  replacement_teacher?: number;
  notes?: string;
};

// ============ Генератор расписания ============

export type ScheduleGeneratorRequest = {
  group_id: number;
  subject_ids: number[];
  clear_existing?: boolean;
  prefer_morning?: boolean;
  time_range?: string; // 'morning' | 'mixed' | 'afternoon' | 'evening' | 'full'
  custom_start_time?: string; // HH:MM format
  custom_end_time?: string; // HH:MM format
  start_day_id: number;
  end_day_id: number;
};

export type ScheduleGeneratorResponse = {
  group: {
    id: number;
    title: string;
  };
  period: {
    start: string; // YYYY-MM-DD
    end: string; // YYYY-MM-DD
  };
  schedule: ScheduleDay[];
};

export type ScheduleDay = {
  date: string; // YYYY-MM-DD
  day_name: string;
  week_number: number;
  is_even_week: boolean;
  classes: ScheduleClass[];
};

export type ScheduleClass = {
  time_slot: {
    number: number;
    start_time: string; // HH:MM:SS
    end_time: string; // HH:MM:SS
  };
  subject: {
    id: number;
    title: string;
    type: string;
  };
  audience: {
    id: number;
    title: string;
    building: string;
  };
  teachers: Array<{
    id: number;
    full_name: string;
  }>;
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
