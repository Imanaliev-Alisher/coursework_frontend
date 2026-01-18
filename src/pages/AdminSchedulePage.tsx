import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSubjects, useDeleteSubject } from '@/shared/hooks';
import { Badge } from '../shared/ui/Badge';
import { useToast } from '@/shared/ui/Toast';

function typeBadge(type: string) {
  if (type === 'Лекция') return <Badge className="bg-purple-50 text-purple-700 border-purple-100">Лекция</Badge>;
  if (type === 'Практика') return <Badge className="bg-blue-50 text-blue-700 border-blue-100">Практика</Badge>;
  return <Badge className="bg-orange-50 text-orange-700 border-orange-100">Лаб.</Badge>;
}

export function AdminSchedulePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { data: subjectsData, isLoading } = useSubjects({ search: searchQuery });
  const deleteSubject = useDeleteSubject();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      showToast('Выберите предметы для удаления', 'error');
      return;
    }
    
    if (!confirm(`Удалить выбранные предметы (${selectedIds.length})?`)) return;
    
    try {
      await Promise.all(selectedIds.map(id => deleteSubject.mutateAsync(id)));
      setSelectedIds([]);
      showToast('Предметы успешно удалены', 'success');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      showToast('Ошибка при удалении предметов', 'error');
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      navigate(`/admin/schedule/${selectedIds[0]}/edit`);
    } else if (selectedIds.length === 0) {
      showToast('Выберите предмет для редактирования', 'error');
    } else {
      showToast('Выберите только один предмет для редактирования', 'error');
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

          <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center bg-white dark:bg-[#1e2936] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="w-full xl:w-96 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
              <input
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Поиск по предмету..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
              <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors" type="button">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                <span>Фильтры</span>
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                type="button"
                onClick={handleEdit}
                disabled={selectedIds.length === 0}
              >
                <span className="material-symbols-outlined text-[20px]">edit</span>
                <span className="hidden sm:inline">Редактировать</span>
              </button>
              <button 
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                type="button"
                onClick={handleDelete}
                disabled={selectedIds.length === 0 || deleteSubject.isPending}
              >
                <span className="material-symbols-outlined text-[20px]">delete</span>
                <span className="hidden sm:inline">Удалить {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}</span>
              </button>
              <Link className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all ml-auto sm:ml-0" to="/admin/schedule/new">
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Добавить занятие</span>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка предметов...</p>
              </div>
            ) : !subjectsData || subjectsData.results.length === 0 ? (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">school</span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Предметы не найдены</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Начните с создания первого предмета'}
                </p>
                <Link
                  to="/admin/schedule/new"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Добавить предмет
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                        <th className="p-4 w-12">
                          <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-primary focus:ring-primary"
                            checked={subjectsData && selectedIds.length === subjectsData.results.length}
                            onChange={(e) => setSelectedIds(e.target.checked ? subjectsData!.results.map(s => s.id) : [])}
                          />
                        </th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Предмет</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Тип</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Аудитория</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Группы</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Преподаватели</th>
                        <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {subjectsData.results.map((subject) => (
                        <tr key={subject.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="p-4 w-12">
                            <input 
                              type="checkbox" 
                              className="rounded border-slate-300 text-primary focus:ring-primary"
                              checked={selectedIds.includes(subject.id)}
                              onChange={() => toggleSelect(subject.id)}
                            />
                          </td>
                          <td className="p-4">
                            <div className="text-sm font-medium text-slate-900 dark:text-white">{subject.title}</div>
                          </td>
                          <td className="p-4">
                            {typeBadge(subject.subject_type_name)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-slate-900 dark:text-white">{subject.audience_name}</div>
                          </td>
                          <td className="p-4">
                            <Badge className="bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                              {subject.groups_count} {subject.groups_count === 1 ? 'группа' : 'групп'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                              {subject.teachers_count} {subject.teachers_count === 1 ? 'преподаватель' : 'преподавателей'}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <Link
                              className="text-primary hover:underline text-sm font-medium"
                              to={`/admin/schedule/${subject.id}/edit`}
                            >
                              Изменить
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                  Показано {subjectsData.results.length} из {subjectsData.count} результатов
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
