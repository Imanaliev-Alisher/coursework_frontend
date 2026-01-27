import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTeachers } from '@/shared/hooks';

export function TeachersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: teachersData, isLoading } = useTeachers({ search: searchQuery });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Преподаватели</h2>
        
        <div className="mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1e2936] border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Поиск по имени, email..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Нет доступных преподавателей</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachersData.results.map((teacher) => (
              <Link
                key={teacher.id}
                to={`/teachers/${teacher.id}`}
                className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[28px]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{teacher.full_name || teacher.username}</h3>
                    {teacher.email && <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{teacher.email}</p>}
                  </div>
                </div>
                {(teacher.department || teacher.cabinet || teacher.office) && (
                  <div className="mt-4 space-y-2">
                    {teacher.department && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">school</span>
                        <span className="truncate">{teacher.department}</span>
                      </div>
                    )}
                    {(teacher.cabinet || teacher.office) && (
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined text-[18px] text-slate-400">door_front</span>
                        Каб. {teacher.cabinet || teacher.office}
                      </div>
                    )}
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <span className="material-symbols-outlined text-primary text-[20px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
