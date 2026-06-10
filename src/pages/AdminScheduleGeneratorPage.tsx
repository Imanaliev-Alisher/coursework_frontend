import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGroups, useScheduleGenerator, useDays, useSubjects } from '@/shared/hooks';
import { useToast } from '@/shared/ui/Toast';
import { getApiErrorMessage } from '@/shared/utils/apiError';

export function AdminScheduleGeneratorPage() {
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<number[]>([]);
  const [clearExisting, setClearExisting] = useState(false);
  const [preferMorning, setPreferMorning] = useState(true);
  const [timeRange, setTimeRange] = useState<string>('morning');
  const [customStartTime, setCustomStartTime] = useState('08:00');
  const [customEndTime, setCustomEndTime] = useState('18:00');
  const [startDayId, setStartDayId] = useState<number>(0);
  const [endDayId, setEndDayId] = useState<number>(0);
  
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const { data: subjectsData, isLoading: isLoadingSubjects } = useSubjects();
  const { data: daysData } = useDays();
  const generateSchedule = useScheduleGenerator();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubjectToggle = (subjectId: number) => {
    setSelectedSubjectIds(prev => 
      prev.includes(subjectId) 
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedGroupId) {
      showToast('Выберите группу', 'error');
      return;
    }

    if (selectedSubjectIds.length === 0) {
      showToast('Выберите хотя бы один предмет', 'error');
      return;
    }

    if (!startDayId || !endDayId) {
      showToast('Выберите диапазон дней', 'error');
      return;
    }

    try {
      await generateSchedule.mutateAsync({
        group_id: selectedGroupId,
        subject_ids: selectedSubjectIds,
        clear_existing: clearExisting,
        prefer_morning: preferMorning,
        time_range: timeRange,
        custom_start_time: customStartTime,
        custom_end_time: customEndTime,
        start_day_id: startDayId,
        end_day_id: endDayId,
      });
      showToast('Расписание успешно сгенерировано', 'success');
      navigate('/admin/schedule');
    } catch (error: any) {
      console.error('Ошибка генерации:', error);
      showToast(getApiErrorMessage(error, 'Ошибка при генерации расписания'), 'error');
    }
  };

  return (
    <>
      <header className="flex-shrink-0 bg-white/80 dark:bg-[#15202b]/90 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Главная</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-500">Расписание</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-slate-900 dark:text-white font-medium">Генератор</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[800px] mx-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Автоматическая генерация расписания</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Создайте полное расписание для группы на указанный период</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="space-y-6">
              {/* Выбор группы */}
              <div>
                <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                  Группа *
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">groups</span>
                  <select
                    className="w-full pl-10 pr-10 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                    required
                    disabled={isLoadingGroups}
                  >
                    <option value={0}>Выберите группу</option>
                    {groupsData?.results.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.title}
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                </div>
              </div>

              {/* Выбор предметов */}
              <div>
                <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                  Предметы *
                </label>
                <div className="border border-slate-300 dark:border-slate-700 rounded-lg p-4 bg-slate-50 dark:bg-slate-950 max-h-[200px] overflow-y-auto">
                  {isLoadingSubjects ? (
                    <p className="text-slate-500">Загрузка...</p>
                  ) : (
                    <div className="space-y-2">
                      {subjectsData?.results.map((subject) => (
                        <label key={subject.id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded">
                          <input
                            type="checkbox"
                            checked={selectedSubjectIds.includes(subject.id)}
                            onChange={() => handleSubjectToggle(subject.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                          />
                          <span className="text-slate-900 dark:text-white">{subject.title}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Выбрано: {selectedSubjectIds.length}</p>
              </div>

              {/* Диапазон дней */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                    День начала *
                  </label>
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-10 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      value={startDayId}
                      onChange={(e) => setStartDayId(Number(e.target.value))}
                      required
                    >
                      <option value={0}>Выберите день</option>
                      {daysData?.results.map((day) => (
                        <option key={day.id} value={day.id}>
                          {day.title}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                    День окончания *
                  </label>
                  <div className="relative">
                    <select
                      className="w-full pl-4 pr-10 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      value={endDayId}
                      onChange={(e) => setEndDayId(Number(e.target.value))}
                      required
                    >
                      <option value={0}>Выберите день</option>
                      {daysData?.results.map((day) => (
                        <option key={day.id} value={day.id}>
                          {day.title}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                  </div>
                </div>
              </div>

              {/* Временной диапазон */}
              <div>
                <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                  Временной диапазон
                </label>
                <div className="relative">
                  <select
                    className="w-full pl-4 pr-10 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                  >
                    <option value="morning">Утренние пары (08:00-14:30)</option>
                    <option value="mixed">Смешанные пары (11:30-17:00)</option>
                    <option value="afternoon">Послеобеденные пары (13:00-18:20)</option>
                    <option value="evening">Вечерние пары (16:00-21:00)</option>
                    <option value="full">Весь день (08:00-21:00)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">expand_more</span>
                </div>
              </div>

              {/* Кастомное время */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                    Начало занятий (HH:MM)
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                    value={customStartTime}
                    onChange={(e) => setCustomStartTime(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-slate-900 dark:text-white text-sm font-semibold mb-2">
                    Окончание занятий (HH:MM)
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                    value={customEndTime}
                    onChange={(e) => setCustomEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Дополнительные опции */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={clearExisting}
                    onChange={(e) => setClearExisting(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-900 dark:text-white text-sm">Удалить существующее расписание</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferMorning}
                    onChange={(e) => setPreferMorning(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-slate-900 dark:text-white text-sm">Предпочитать утренние занятия</span>
                </label>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                  <div className="text-sm text-blue-900 dark:text-blue-200">
                    <p className="font-semibold mb-1">Как работает генератор:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
                      <li>Автоматически создаст расписание для выбранной группы</li>
                      <li>Распределит выбранные предметы по дням недели</li>
                      <li>Назначит преподавателей и аудитории</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => navigate('/admin/schedule')}
                className="flex-1 px-4 py-2.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={generateSchedule.isPending}
                className="flex-1 px-4 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generateSchedule.isPending ? 'Генерация...' : 'Сгенерировать расписание'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
