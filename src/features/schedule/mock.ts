import type { Lesson } from './types';

export const mockLessons: Lesson[] = [
  {
    id: '1',
    startsAtIso: '2023-10-24T08:30:00+03:00',
    endsAtIso: '2023-10-24T10:00:00+03:00',
    groupCode: 'ИКТ-41',
    subject: 'Высшая математика',
    teacher: 'Смирнова Е.А.',
    room: 'Ауд. 305',
    lessonType: 'lecture',
    status: 'planned',
  },
  {
    id: '2',
    startsAtIso: '2023-10-24T10:10:00+03:00',
    endsAtIso: '2023-10-24T11:40:00+03:00',
    groupCode: 'ПМИ-203',
    subject: 'Английский язык',
    teacher: 'Петрова Е.С.',
    room: 'Ауд. 201',
    lessonType: 'practice',
    status: 'canceled',
  },
  {
    id: '3',
    startsAtIso: '2023-10-25T08:30:00+03:00',
    endsAtIso: '2023-10-25T10:00:00+03:00',
    groupCode: 'ИКТ-41',
    subject: 'Информатика',
    teacher: 'Волков Д.А.',
    room: 'Ауд. 410',
    lessonType: 'lab',
    status: 'done',
  },
];
