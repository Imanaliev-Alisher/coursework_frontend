export const WEEK_DAYS = [
  'Понедельник',
  'Вторник',
  'Среда',
  'Четверг',
  'Пятница',
  'Суббота',
  'Воскресенье'
] as const;

export type WeekDay = typeof WEEK_DAYS[number];
