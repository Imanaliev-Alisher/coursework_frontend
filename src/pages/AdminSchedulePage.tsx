import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGroups, useGroupTimetable, useDeleteSubjectSchedule } from '@/shared/hooks';
import { Badge } from '../shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';
import { WEEK_DAYS } from '@/shared/constants/weekDays';
import type { WeekType } from '@/shared/constants/weekTypes';

function typeBadge(type: string | undefined) {
  if (!type) return <Badge className="bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800">Неизвестно</Badge>;
  if (type === 'Лекция') return <Badge className="bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">Лекция</Badge>;
  if (type === 'Практика') return <Badge className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">Практика</Badge>;
  return <Badge className="bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">Лаб.</Badge>;
}

export function AdminSchedulePage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [weekType, setWeekType] = useState<WeekType>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAudience, setSelectedAudience] = useState<string>('');

  const { showToast } = useToast();
  const handleWeekTypeChange = useCallback((type: WeekType) => {
    setWeekType(type);
  }, []);

  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const { data: timetable, isLoading: isLoadingTimetable, dataUpdatedAt } = useGroupTimetable(selectedGroupId);
  const deleteSchedule = useDeleteSubjectSchedule();

  // Фильтрация расписания
  const filteredTimetable = useMemo(() => {
    if (!timetable || !Array.isArray(timetable)) return [];

    return timetable.filter((entry: any) => {
      // Фильтр по типу недели
      if (weekType !== 'all') {
        const weekTypeValue = entry.week_type;
        if (weekTypeValue && weekTypeValue !== 'Все') {
          const normalizedWeekType = weekTypeValue === 'Нечетные' ? 'odd' : 'even';
          if (normalizedWeekType !== weekType) {
            return false;
          }
        }
      }

      // Фильтр по предмету
      if (selectedSubject && entry.subject_title !== selectedSubject) {
        return false;
      }

      // Фильтр по аудитории
      if (selectedAudience && entry.audience_details?.title !== selectedAudience) {
        return false;
      }

      return true;
    });
  }, [timetable, weekType, selectedSubject, selectedAudience, dataUpdatedAt]);

  // Оптимизированный список уникальных предметов
  const uniqueSubjects = useMemo(() => 
    Array.isArray(timetable) ? [...new Set(timetable.map((entry: any) => entry.subject_title))].filter(Boolean) : [],
    [timetable]
  );

  // Список уникальных аудиторий
  const uniqueAudiences = useMemo(() =>
    Array.isArray(timetable) ? [...new Set(timetable.map((entry: any) => entry.audience_details?.title).filter(Boolean))] : [],
    [timetable]
  );

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить это занятие?')) return;
    
    try {
      await deleteSchedule.mutateAsync(id);
      showToast('Занятие успешно удалено', 'success');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      showToast('Ошибка при удалении занятия', 'error');
    }
  };

  return (
    <>
      <header className="flex-shrink-0 bg-white/80 dark:bg-[#15202b]/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Главная</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Расписание</span>
          </div>
          <button className="md:hidden p-2 text-slate-500" type="button">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Управление расписанием</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1">Просмотр, редактирование и создание новых учебных занятий</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-white dark:bg-[#1e2936] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex flex-wrap gap-3">
              <Link 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-green-500/20 transition-all" 
                to="/admin/schedule/generate"
              >
                <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                <span>Генератор</span>
              </Link>
              <Link className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all" to="/admin/schedule/new">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Добавить занятие</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex flex-col gap-4">
              {/* Выбор группы */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Группа
                </label>
                <select
                  className="w-full md:w-80 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                  value={selectedGroupId || ''}
                  onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={isLoadingGroups}
                >
                  <option value="">Выберите группу</option>
                  {groupsData?.results?.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Фильтры типа недели */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Тип недели
                </label>
                <div className="flex gap-2">
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      weekType === 'all'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => handleWeekTypeChange('all')}
                  >
                    Все
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      weekType === 'odd'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => handleWeekTypeChange('odd')}
                  >
                    Нечетные
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      weekType === 'even'
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => handleWeekTypeChange('even')}
                  >
                    Четные
                  </button>
                </div>
              </div>

              {/* Фильтры по предмету и аудитории */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Предмет
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">Все предметы</option>
                    {uniqueSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Аудитория
                  </label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                  >
                    <option value="">Все аудитории</option>
                    {uniqueAudiences.map((audience) => (
                      <option key={audience} value={audience}>
                        {audience}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {!selectedGroupId ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">calendar_month</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Выберите группу</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Для просмотра расписания выберите группу из списка выше
              </p>
            </div>
          ) : isLoadingTimetable ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка расписания...</p>
            </div>
          ) : !timetable || timetable.length === 0 ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Расписание не найдено</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Для этой группы пока нет занятий. Создайте расписание вручную или используйте генератор.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Link
                  to="/admin/schedule/generate"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-green-500/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                  Генератор
                </Link>
                <Link
                  to="/admin/schedule/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Добавить занятие
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {WEEK_DAYS.map((day) => {
                const dayLessons = filteredTimetable.filter(
                  (entry: any) => entry.week_day_name === day
                );

                return (
                  <div
                    key={day}
                    className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden"
                  >
                    <div className="bg-primary text-white px-4 py-3 text-center">
                      <h3 className="font-bold text-sm">{day}</h3>
                    </div>
                    <div className="p-3 space-y-3">
                      {dayLessons.length === 0 ? (
                        <p className="text-center text-xs text-slate-400 dark:text-slate-500 py-4">
                          Нет занятий
                        </p>
                      ) : (
                        dayLessons.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-[18px]">
                                  schedule
                                </span>
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {lesson.time_slot_display || lesson.time_slot}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                <Link
                                  to={`/admin/schedule/${lesson.id}/edit`}
                                  className="p-1 text-primary hover:bg-primary/10 rounded transition-colors"
                                  title="Редактировать"
                                >
                                  <span className="material-symbols-outlined text-[18px]">edit</span>
                                </Link>
                                <button
                                  onClick={() => handleDelete(lesson.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  title="Удалить"
                                  type="button"
                                >
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                              {lesson.subject_title || lesson.subject}
                            </h4>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {typeBadge(lesson.subject_type)}
                            </div>
                            <div className="space-y-1 text-xs">
                              <div className="flex items-start gap-1.5">
                                <span className="material-symbols-outlined text-slate-400 text-[16px] flex-shrink-0 mt-0.5">
                                  location_on
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                  {lesson.audience_details?.title || 'Не указано'}
                                </span>
                              </div>
                              {lesson.teachers_details && Array.isArray(lesson.teachers_details) && lesson.teachers_details.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                  <span className="material-symbols-outlined text-slate-400 text-[16px] flex-shrink-0 mt-0.5">
                                    person
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {lesson.teachers_details.map((t: any) => t.full_name || t.name).join(', ')}
                                  </span>
                                </div>
                              )}
                              {lesson.groups_details && Array.isArray(lesson.groups_details) && lesson.groups_details.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                  <span className="material-symbols-outlined text-slate-400 text-[16px] flex-shrink-0 mt-0.5">
                                    group
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {lesson.groups_details.map((g: any) => g.name).join(', ')}
                                  </span>
                                </div>
                              )}
                              {lesson.week_type && lesson.week_type !== 'Все' && (
                                <div className="flex items-start gap-1.5">
                                  <span className="material-symbols-outlined text-slate-400 text-[16px] flex-shrink-0 mt-0.5">
                                    calendar_month
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {lesson.week_type}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
