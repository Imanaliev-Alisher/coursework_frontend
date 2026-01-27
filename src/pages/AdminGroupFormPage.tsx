import { useState, useEffect, FormEvent, useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGroup, useCreateGroup, useUpdateGroup, useStudents } from '@/shared/hooks';
import type { StudyGroupCreateRequest } from '@/features/schedule/types';

export function AdminGroupFormPage(props: { mode: 'create' | 'edit' }) {
  const params = useParams();
  const navigate = useNavigate();
  const isEdit = props.mode === 'edit';
  const groupId = isEdit ? Number(params.id) : undefined;

  const { data: group, isLoading: isLoadingGroup } = useGroup(groupId);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();
  
  const [studentSearch, setStudentSearch] = useState('');
  const { data: studentsData, isLoading: isLoadingStudents } = useStudents({ 
    page_size: 100,
    search: studentSearch 
  });

  const [formData, setFormData] = useState<StudyGroupCreateRequest>({
    title: '',
    description: '',
    faculty: '',
    course: undefined,
    is_active: true,
    student_ids: [],
  });

  useEffect(() => {
    if (group && isEdit) {
      setFormData({
        title: group.title,
        description: group.description,
        faculty: group.faculty || '',
        course: group.course || undefined,
        is_active: group.is_active,
        student_ids: group.students?.map(s => s.id) || [],
      });
    }
  }, [group, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && groupId) {
        await updateGroup.mutateAsync({ id: groupId, data: formData });
      } else {
        await createGroup.mutateAsync(formData);
      }
      navigate('/admin/groups');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  if (isEdit && isLoadingGroup) {
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
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[960px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link className="hover:text-primary" to="/admin/groups">
              Группы
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span>{isEdit ? `Редактирование группы ${params.id ?? ''}` : 'Новая группа'}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? 'Редактирование группы' : 'Создание группы'}
          </h1>
        </div>

        <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Название группы *
                  <span className="ml-2 text-xs font-normal text-slate-500">Максимум 50 символов</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  placeholder="Например, ИВТ-21"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  maxLength={50}
                  required
                />
                <p className="mt-1 text-xs text-slate-500">Введите наименование учебной группы</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Описание *
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  placeholder="Описание группы..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <p className="mt-1 text-xs text-slate-500">Введите описание (дополнительную информацию) об учебной группе</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Факультет
                  <span className="ml-2 text-xs font-normal text-slate-500">Максимум 255 символов</span>
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  placeholder="Например, Факультет информационных технологий"
                  value={formData.faculty}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                  maxLength={255}
                />
                <p className="mt-1 text-xs text-slate-500">Факультет, к которому относится группа</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Курс
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  value={formData.course ?? ''}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">Не указан</option>
                  <option value="1">1 курс</option>
                  <option value="2">2 курс</option>
                  <option value="3">3 курс</option>
                  <option value="4">4 курс</option>
                  <option value="5">5 курс</option>
                  <option value="6">6 курс</option>
                </select>
                <p className="mt-1 text-xs text-slate-500">Курс обучения (1-6)</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-slate-900 dark:text-white">
                    Студенты
                    {formData.student_ids && formData.student_ids.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {formData.student_ids.length}
                      </span>
                    )}
                  </label>
                  {studentsData?.results && studentsData.results.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-xs text-primary hover:text-blue-700 font-medium"
                        onClick={() => {
                          const allIds = studentsData.results.map(s => s.id);
                          setFormData({ ...formData, student_ids: allIds });
                        }}
                      >
                        Выбрать все
                      </button>
                      <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                      <button
                        type="button"
                        className="text-xs text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 font-medium"
                        onClick={() => setFormData({ ...formData, student_ids: [] })}
                      >
                        Снять выбор
                      </button>
                    </div>
                  )}
                </div>

                {/* Поиск студентов */}
                <div className="relative mb-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[18px]">
                    search
                  </span>
                  <input
                    type="text"
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/50"
                    placeholder="Поиск по имени или email..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                  {studentSearch && (
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={() => setStudentSearch('')}
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>

                {isLoadingStudents ? (
                  <div className="p-8 text-center border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Загрузка студентов...</p>
                  </div>
                ) : (
                  <div className=" rounded-lg overflow-hidden">
                    {/* Выбранные студенты */}
                    {formData.student_ids && formData.student_ids.length > 0 && (
                      <div className="border border-slate-300 dark:border-slate-700 bg-primary/5 border-b border-slate-300 dark:border-slate-700 border-b-rounded-t-lg">
                        <div className="px-4 py-2 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            Выбранные студенты
                          </span>
                        </div>
                        <div className="max-h-32 overflow-y-auto">
                          {studentsData?.results
                            ?.filter(s => formData.student_ids?.includes(s.id))
                            .map((student) => (
                              <div
                                key={student.id}
                                className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 last:border-b-0"
                              >
                                <button
                                  type="button"
                                  className="p-0.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                  onClick={() => {
                                    const newIds = formData.student_ids?.filter(id => id !== student.id) || [];
                                    setFormData({ ...formData, student_ids: newIds });
                                  }}
                                  title="Удалить"
                                >
                                  <span className="material-symbols-outlined text-[18px]">close</span>
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    {student.full_name || student.username || `Student ${student.id}`}
                                  </div>
                                  {student.email && (
                                    <div className="text-xs text-slate-500 truncate">{student.email}</div>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Список всех студентов */}
                    <div className='border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden mt-4'>
                    <div className="px-4 py-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">people</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                          Список всех студентов
                        </span>
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                      {studentsData?.results && studentsData.results.length > 0 ? (
                        <div className="divide-y divide-slate-200 dark:divide-slate-800">
                          {studentsData.results.map((student) => {
                            const isSelected = formData.student_ids?.includes(student.id) || false;
                            return (
                              <label
                                key={student.id}
                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'bg-primary/5 hover:bg-primary/10'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-900'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/50"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const currentIds = formData.student_ids || [];
                                    const newIds = e.target.checked
                                      ? [...currentIds, student.id]
                                      : currentIds.filter(id => id !== student.id);
                                    setFormData({ ...formData, student_ids: newIds });
                                  }}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                      {student.full_name || student.username || `Student ${student.id}`}
                                    </span>
                                    {isSelected && (
                                      <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                                    )}
                                  </div>
                                  {student.email && (
                                    <div className="text-xs text-slate-500 truncate flex items-center gap-1">
                                      <span className="material-symbols-outlined text-[14px]">mail</span>
                                      {student.email}
                                    </div>
                                  )}
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">
                            person_off
                          </span>
                          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {studentSearch ? 'Студенты не найдены по запросу' : 'Студенты не найдены'}
                          </p>
                          {studentSearch && (
                            <button
                              type="button"
                              className="mt-2 text-xs text-primary hover:underline"
                              onClick={() => setStudentSearch('')}
                            >
                              Очистить поиск
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    </div>
                    {studentsData?.count && studentsData.count > 100 && (
                      <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                          Показано {studentsData.results.length} из {studentsData.count} студентов. Используйте поиск для уточнения.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <p className="mt-2 text-xs text-slate-500 flex items-start gap-1">
                  <span className="material-symbols-outlined text-[14px] mt-0.5">info</span>
                  <span>Выберите студентов, которые будут входить в эту группу. Используйте поиск для быстрого нахождения нужных студентов.</span>
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-950/50 rounded-lg border border-slate-200 dark:border-slate-800">
                <input
                  type="checkbox"
                  id="is_active"
                  className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-primary focus:ring-2 focus:ring-primary/50"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <label htmlFor="is_active" className="flex-1 cursor-pointer">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Активна</div>
                  <div className="text-xs text-slate-500">Действующая группа или нет (неактивные группы скрываются из основных списков)</div>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Link
                to="/admin/groups"
                className="px-5 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-all"
              >
                Отмена
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-white bg-primary hover:bg-blue-600 font-medium text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createGroup.isPending || updateGroup.isPending}
              >
                {createGroup.isPending || updateGroup.isPending ? (
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
