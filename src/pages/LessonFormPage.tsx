import { useState, useEffect, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  useSubject,
  useCreateSubject,
  useUpdateSubject,
  useGroups,
  useTeachers,
  useAudiences,
  useSubjectTypes,
  useDays,
  useTimeSlots,
} from '@/shared/hooks';
import type { SubjectCreateUpdateRequest } from '@/shared/api';
import { useToast } from '@/shared/ui/Toast';

export function LessonFormPage(props: { mode: 'create' | 'edit' }) {
  const params = useParams();
  const navigate = useNavigate();
  const isEdit = props.mode === 'edit';
  const subjectId = isEdit ? Number(params.id) : undefined;

  // Загрузка данных для формы
  const { data: subject, isLoading: isLoadingSubject } = useSubject(subjectId);
  const { data: groupsData } = useGroups();
  const { data: teachersData } = useTeachers();
  const { data: audiencesData } = useAudiences();
  const { data: subjectTypesData } = useSubjectTypes();
  const { data: daysData } = useDays();
  const { data: timeSlotsData } = useTimeSlots();

  const { showToast } = useToast();

  // Мутации
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  // Состояние формы
  const [formData, setFormData] = useState<SubjectCreateUpdateRequest>({
    title: '',
    subject_type: 0,
    audience: 0,
    teachers: [],
    groups: [],
    schedule: [],
  });

  // Дополнительные поля для расписания
  const [scheduleDay, setScheduleDay] = useState<number>(0);
  const [scheduleTimeSlot, setScheduleTimeSlot] = useState<number>(0);
  const [scheduleWeekParity, setScheduleWeekParity] = useState<'odd' | 'even' | ''>('');

  // Заполнение формы при редактировании
  useEffect(() => {
    if (subject && isEdit) {
      setFormData({
        title: subject.title,
        subject_type: subject.subject_type,
        audience: subject.audience,
        teachers: subject.teachers || [],
        groups: subject.groups || [],
      });
    }
  }, [subject, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && subjectId) {
        await updateSubject.mutateAsync({ id: subjectId, data: formData });
        showToast('Предмет успешно обновлён', 'success');
      } else {
        await createSubject.mutateAsync(formData);
        showToast('Предмет успешно создан', 'success');
      }
      navigate('/admin/schedule');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      showToast('Ошибка при сохранении предмета', 'error');
    }
  };

  if (isEdit && isLoadingSubject) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="w-full max-w-[960px] mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
              <Link className="hover:text-primary" to="/admin/schedule">
                Расписание
              </Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span>{isEdit ? `Редактирование предмета ${params.id ?? ''}` : 'Новый предмет'}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isEdit ? 'Редактирование предмета' : 'Создание предмета'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Заполните форму ниже, чтобы сохранить предмет в расписании.
            </p>
          </div>
        </div>

        <div className="bg-surface-light dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <div className="p-6 lg:p-8 space-y-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                    Название предмета *
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined">menu_book</span>
                    </span>
                    <input
                      className="form-input w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-4 py-3 focus:border-primary focus:ring-primary placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                      placeholder="Например, Высшая математика"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <label className="block">
                  <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                    Тип занятия *
                  </span>
                  <div className="relative">
                    <select
                      className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-4 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      value={formData.subject_type}
                      onChange={(e) => setFormData({ ...formData, subject_type: Number(e.target.value) })}
                      required
                    >
                      <option value={0}>Выберите тип</option>
                      {subjectTypesData?.results.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                    Аудитория *
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined">meeting_room</span>
                    </span>
                    <select
                      className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      value={formData.audience}
                      onChange={(e) => setFormData({ ...formData, audience: Number(e.target.value) })}
                      required
                    >
                      <option value={0}>Выберите аудиторию</option>
                      {audiencesData?.results.map((aud) => (
                        <option key={aud.id} value={aud.id}>
                          {aud.title} ({aud.building_name})
                        </option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">
                      expand_more
                    </span>
                  </div>
                </label>

                <label className="block">
                  <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">Группы</span>
                  <div className="relative">
                    <select
                      className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-4 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      multiple
                      value={formData.groups?.map(String) || []}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          groups: Array.from(e.target.selectedOptions, (opt) => Number(opt.value)),
                        })
                      }
                      size={4}
                    >
                      {groupsData?.results.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Удерживайте Ctrl/Cmd для выбора нескольких
                  </p>
                </label>

                <label className="block">
                  <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                    Преподаватели
                  </span>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined">person</span>
                    </span>
                    <select
                      className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-10 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                      multiple
                      value={formData.teachers?.map(String) || []}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          teachers: Array.from(e.target.selectedOptions, (opt) => Number(opt.value)),
                        })
                      }
                      size={4}
                    >
                      {teachersData?.results.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.full_name || teacher.username}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Удерживайте Ctrl/Cmd для выбора нескольких
                  </p>
                </label>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4">Расписание</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <label className="block">
                    <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                      День недели
                    </span>
                    <div className="relative">
                      <select
                        className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-4 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                        value={scheduleDay}
                        onChange={(e) => setScheduleDay(Number(e.target.value))}
                      >
                        <option value={0}>Выберите день</option>
                        {daysData?.results.map((day) => (
                          <option key={day.id} value={day.id}>
                            {day.title}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                      Время занятия
                    </span>
                    <div className="relative">
                      <select
                        className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-4 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                        value={scheduleTimeSlot}
                        onChange={(e) => setScheduleTimeSlot(Number(e.target.value))}
                      >
                        <option value={0}>Выберите время</option>
                        {timeSlotsData?.results.map((slot) => (
                          <option key={slot.id} value={slot.id}>
                            {slot.start_time.substring(0, 5)} - {slot.end_time.substring(0, 5)}
                          </option>
                        ))}
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </label>

                  <label className="block">
                    <span className="text-slate-900 dark:text-white text-sm font-semibold mb-2 block">
                      Тип недели
                    </span>
                    <div className="relative">
                      <select
                        className="form-select w-full rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pl-4 pr-10 py-3 focus:border-primary focus:ring-primary appearance-none cursor-pointer"
                        value={scheduleWeekParity}
                        onChange={(e) => setScheduleWeekParity(e.target.value as 'odd' | 'even' | '')}
                      >
                        <option value="">Любая неделя</option>
                        <option value="odd">Нечетная</option>
                        <option value="even">Четная</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[20px]">
                        expand_more
                      </span>
                    </div>
                  </label>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Укажите день, время и тип недели для занятия
                </p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950/50 px-6 py-4 lg:px-8 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Link
                className="px-5 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-all focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 focus:outline-none"
                to="/admin/schedule"
              >
                Отмена
              </Link>
              <button
                className="px-5 py-2.5 rounded-lg text-white bg-primary hover:bg-blue-600 font-medium text-sm shadow-sm transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={createSubject.isPending || updateSubject.isPending}
              >
                {createSubject.isPending || updateSubject.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
