import { useTeachers } from '@/shared/hooks';
import { Link } from 'react-router-dom';

export function AdminTeachersPage() {
  const { data: teachersData, isLoading } = useTeachers();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Управление преподавателями</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Просмотр и редактирование информации о преподавателях</p>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка преподавателей...</p>
          </div>
        ) : !teachersData || teachersData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">person</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Преподаватели не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Нет зарегистрированных преподавателей</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">ФИО</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Кафедра</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Кабинет</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Телефон</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {teachersData.results.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">
                          {teacher.full_name || teacher.username}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{teacher.email || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{teacher.department || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{teacher.cabinet || teacher.office || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{teacher.phone_number || teacher.phone || '-'}</div>
                      </td>
                      <td className="p-4 text-right">
                        <Link 
                          to={`/teachers/${teacher.id}`}
                          className="text-primary hover:underline text-sm font-medium"
                        >
                          Просмотр
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              Показано {teachersData.results.length} из {teachersData.count} результатов
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
