import { useTeachers } from '@/shared/hooks';

export function TeachersPage() {
  const { data: teachersData, isLoading } = useTeachers();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Преподаватели</h2>
        
        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка преподавателей...</p>
          </div>
        ) : !teachersData || teachersData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">person</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Преподаватели не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Нет доступных преподавателей</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachersData.results.map((teacher) => (
              <div key={teacher.id} className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[28px]">person</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{teacher.full_name || teacher.username}</h3>
                    {teacher.email && <p className="text-sm text-slate-500 dark:text-slate-400">{teacher.email}</p>}
                  </div>
                </div>
                {(teacher.department || teacher.cabinet) && (
                  <div className="mt-4 space-y-2">
                    {teacher.department && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">school</span>
                        {teacher.department}
                      </div>
                    )}
                    {teacher.cabinet && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">door_front</span>
                        Каб. {teacher.cabinet}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
