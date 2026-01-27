import { Link } from 'react-router-dom';
import { useGroups } from '@/shared/hooks';

export function GroupsPage() {
  const { data: groupsData, isLoading } = useGroups();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Учебные группы</h2>
        
        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка групп...</p>
          </div>
        ) : !groupsData || groupsData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">groups</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Группы не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Нет доступных учебных групп</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupsData.results.map((group) => (
              <Link 
                key={group.id} 
                to={`/groups/${group.id}`}
                className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer"
              >
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{group.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{group.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-[20px]">people</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      {group.students_count} {group.students_count === 1 ? 'студент' : 'студентов'}
                    </span>
                  </div>
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
