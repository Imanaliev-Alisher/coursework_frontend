import { Link } from 'react-router-dom';
import { useSchedules } from '@/shared/hooks';

export function AdminLessonsPage() {
  const { data: schedulesData, isLoading } = useSchedules();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Занятия в расписании</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Просмотр и управление расписанием</p>
          </div>
          <Link 
            to="/admin/schedule"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">edit_calendar</span>
            Управление расписанием
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка...</p>
          </div>
        ) : !schedulesData || schedulesData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Занятия не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Добавьте предметы через управление расписанием</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Предмет</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">День недели</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Время</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Неделя</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {schedulesData.results.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white">{schedule.subject_title}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{schedule.day_title}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {schedule.time_slot_start} - {schedule.time_slot_end}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {schedule.week_parity === 'odd' ? 'Нечетная' : schedule.week_parity === 'even' ? 'Четная' : 'Любая'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              Показано {schedulesData.results.length} из {schedulesData.count} занятий
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
