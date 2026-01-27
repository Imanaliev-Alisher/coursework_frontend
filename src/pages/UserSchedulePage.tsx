import { useState, useMemo, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useGroups, useGroupTimetable, useAudiences, useCurrentUser, useStudent } from '@/shared/hooks';
import { Badge } from '../shared/ui/Badge';
import { exportToPDF, exportToExcel } from '@/shared/utils/exportSchedule';
import { WEEK_TYPES, type WeekType } from '@/shared/constants/weekTypes';
import { WEEK_DAYS } from '@/shared/constants/weekDays';
import { useToast } from '@/shared/ui/Toast';

function typeBadge(type: string | undefined) {
  if (!type) return <Badge className="bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/30 dark:text-gray-300 dark:border-gray-800">Неизвестно</Badge>;
  if (type === 'Лекция') return <Badge className="bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800">Лекция</Badge>;
  if (type === 'Практика') return <Badge className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">Практика</Badge>;
  return <Badge className="bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800">Лаб.</Badge>;
}

export function UserSchedulePage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>();
  const [weekType, setWeekType] = useState<WeekType>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedAudienceId, setSelectedAudienceId] = useState<string>('');

  const { showToast } = useToast();



  const handleWeekTypeChange = useCallback((type: WeekType) => {
    setWeekType(type);
  }, []);

  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const { data: timetable, isLoading: isLoadingTimetable, dataUpdatedAt } = useGroupTimetable(selectedGroupId);
  const { data: audiencesData } = useAudiences();
  const { data: currentUser } = useCurrentUser();

  const isAdmin = currentUser?.is_staff;
  const isStudent = currentUser?.role === 'STUDENT';

  // Получаем данные студента, если текущий пользователь - студент
  const { data: studentData } = useStudent(isStudent && currentUser?.id ? currentUser.id : 0);

  // Автоматический выбор группы для студента
  useEffect(() => {
    let isMounted = true;
    
    if (isStudent && studentData?.study_groups && studentData.study_groups.length > 0 && groupsData?.results) {
      const groupTitle = studentData.study_groups[0];
      // Ищем группу по названию (API возвращает массив строк, а не объектов)
      const groupName = typeof groupTitle === 'string' ? groupTitle : (groupTitle as any).title || groupTitle;
      const group = groupsData.results.find(g => g.title === groupName);
      if (group && isMounted) {
        setSelectedGroupId(group.id);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [isStudent, studentData, groupsData]);

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
      if (selectedAudienceId && entry.audience_details?.title !== selectedAudienceId) {
        return false;
      }

      return true;
    });
  }, [timetable, weekType, selectedSubject, selectedAudienceId, dataUpdatedAt]);

  // Оптимизированный список уникальных предметов
  const uniqueSubjects = useMemo(() => 
    Array.isArray(timetable) ? [...new Set(timetable.map((entry: any) => entry.subject_title))].filter(Boolean) : [],
    [timetable]
  );

  // Объединённый хендлер экспорта
  const handleExport = useCallback((format: 'pdf' | 'excel') => {
    if (!selectedGroupId || !filteredTimetable || filteredTimetable.length === 0) {
      showToast('Выберите группу для экспорта', 'error');
      return;
    }
    
    try {
      const groupTitle = groupsData?.results.find(g => g.id === selectedGroupId)?.title || 'Группа';
      if (format === 'pdf') {
        exportToPDF(filteredTimetable as any, groupTitle, weekType);
      } else {
        exportToExcel(filteredTimetable as any, groupTitle, weekType);
      }
      showToast('Экспорт завершён', 'success');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Ошибка экспорта', 'error');
    }
  }, [selectedGroupId, filteredTimetable, groupsData, weekType, showToast]);

  const handleExportPdf = useCallback(() => handleExport('pdf'), [handleExport]);
  const handleExportExcel = useCallback(() => handleExport('excel'), [handleExport]);
  return (
    <>
      <header className="bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark z-10">
        <div className="px-6 py-5">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Расписание занятий</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Просмотр и управление учебным процессом</p>
              </div>
              <div className="flex gap-2">
                {isAdmin &&
                  <button 
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50" 
                    type="button"
                    onClick={handleExportExcel}
                    disabled={!selectedGroupId}
                  >
                    <span className="material-symbols-outlined text-[20px]">table_chart</span>
                    Excel
                  </button>
                }
                {isAdmin && (
                  <Link
                    to="/admin/schedule/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-primary/30"
                  >
                    <span className="material-symbols-outlined text-[20px]">add</span>
                    Добавить пару
                  </Link>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-border-light dark:border-border-dark">
              <div className="flex flex-col gap-1.5 min-w-[240px]">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">Тип недели</label>
                <div className="flex h-10 w-full items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-700 p-1">
                  <label className="flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm text-slate-500 dark:text-slate-400 has-[:checked]:text-primary dark:has-[:checked]:text-white">
                    <span className="text-xs font-semibold truncate">Все</span>
                    <input 
                      checked={weekType === 'all'} 
                      className="hidden" 
                      name="week_type" 
                      type="radio" 
                      value="all"
                      onChange={() => handleWeekTypeChange('all')}
                    />
                  </label>
                  <label className="flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm text-slate-500 dark:text-slate-400 has-[:checked]:text-primary dark:has-[:checked]:text-white">
                    <span className="text-xs font-semibold truncate">Нечетная (1, 3...)</span>
                    <input 
                      checked={weekType === 'odd'} 
                      className="hidden" 
                      name="week_type" 
                      type="radio" 
                      value="odd"
                      onChange={() => handleWeekTypeChange('odd')}
                    />
                  </label>
                  <label className="flex cursor-pointer h-full grow items-center justify-center rounded-md px-2 transition-all has-[:checked]:bg-white dark:has-[:checked]:bg-slate-600 has-[:checked]:shadow-sm text-slate-500 dark:text-slate-400 has-[:checked]:text-primary dark:has-[:checked]:text-white">
                    <span className="text-xs font-semibold truncate">Четная (2, 4...)</span>
                    <input 
                      checked={weekType === 'even'} 
                      className="hidden" 
                      name="week_type" 
                      type="radio" 
                      value="even"
                      onChange={() => handleWeekTypeChange('even')}
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">Группа</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 appearance-none rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-primary dark:focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    value={selectedGroupId || ''}
                    onChange={(e) => setSelectedGroupId(e.target.value ? Number(e.target.value) : undefined)}
                    disabled={isLoadingGroups || isStudent}
                  >
                    <option value="">Выберите группу</option>
                    {groupsData?.results.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.title} ({group.students_count} студентов)
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">Предмет</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 appearance-none rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-primary dark:focus:ring-primary"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value="">Все предметы</option>
                    {uniqueSubjects.map((subject: any) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 pl-1">Аудитория</label>
                <div className="relative">
                  <select 
                    className="w-full h-10 appearance-none rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 pl-3 pr-10 text-sm text-slate-900 dark:text-white focus:border-primary focus:ring-primary dark:focus:ring-primary"
                    value={selectedAudienceId}
                    onChange={(e) => setSelectedAudienceId(e.target.value)}
                  >
                    <option value="">Любая</option>
                    {audiencesData?.results.map((audience) => (
                      <option key={audience.id} value={audience.title}>
                        {audience.title}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          {!selectedGroupId ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">calendar_month</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Выберите группу</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Для просмотра расписания выберите учебную группу из списка выше</p>
            </div>
          ) : isLoadingTimetable ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка расписания...</p>
            </div>
          ) : !filteredTimetable || filteredTimetable.length === 0 ? (
            <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Расписание не найдено</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Для выбранных фильтров нет занятий</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
              {WEEK_DAYS.map((day) => {
                const dayLessons = filteredTimetable.filter((entry: any) => entry.week_day_name === day);
                return (
                  <div key={day} className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-primary/10 dark:bg-primary/20 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{day}</h3>
                    </div>
                    <div className="p-4 space-y-3 flex-1">
                      {dayLessons.length === 0 ? (
                        <div className="text-center py-8">
                          <span className="material-symbols-outlined text-3xl text-slate-300 dark:text-slate-600">event_busy</span>
                          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">Нет занятий</p>
                        </div>
                      ) : (
                        dayLessons.map((entry: any, index: number) => (
                          <div key={index} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <span className="text-xs font-semibold text-primary">{entry.time_slot_display || entry.time_slot}</span>
                              {typeBadge(entry.subject_type)}
                            </div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{entry.subject_title || entry.subject}</h4>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="material-symbols-outlined text-[16px]">meeting_room</span>
                                <span>{entry.audience_details?.title || entry.audience}</span>
                              </div>
                              {(entry.teachers_details && entry.teachers_details.length > 0) && (
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="material-symbols-outlined text-[16px]">person</span>
                                  <span>{entry.teachers_details.map((t: any) => t.full_name).join(', ')}</span>
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
