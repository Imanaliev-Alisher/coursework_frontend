export const WEEK_TYPES = {
  ALL: 'Все',
  ODD: 'Нечетная',
  EVEN: 'Четная',
  ODD_EN: 'odd',
  EVEN_EN: 'even',
} as const;

export type WeekType = 'odd' | 'even' | 'all';
