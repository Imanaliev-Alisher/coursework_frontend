import { useParams, Link } from 'react-router-dom';
import { useGroup } from '@/shared/hooks';

export function GroupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: group, isLoading } = useGroup(id ? parseInt(id) : undefined);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка группы...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">groups</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Группа не найдена</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Группа с таким ID не существует</p>
            <Link to="/groups" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Вернуться к списку групп
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Хлебные крошки */}
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
          <Link to="/groups" className="hover:text-primary transition-colors">Группы</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">{group.title}</span>
        </div>

        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{group.title}</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">{group.description}</p>
          </div>
          <Link to="/groups" className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Назад
          </Link>
        </div>

        {/* Информация о группе */}
        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">info</span>
            Информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Название группы</p>
              <p className="text-base font-medium text-slate-900 dark:text-white">{group.title}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Количество студентов</p>
              <p className="text-base font-medium text-slate-900 dark:text-white">
                {group.students_count} {group.students_count === 1 ? 'студент' : group.students_count > 1 && group.students_count < 5 ? 'студента' : 'студентов'}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Описание</p>
              <p className="text-base text-slate-900 dark:text-white">{group.description}</p>
            </div>
          </div>
        </div>

        {/* Список студентов */}
        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">people</span>
            Список студентов ({group.students?.length || 0})
          </h3>
          
          {!group.students || group.students.length === 0 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600">person_off</span>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">В группе пока нет студентов</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.students.map((student) => (
                <div key={student.id} className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">person</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 dark:text-white truncate">
                      {student.full_name || `${student.first_name} ${student.last_name}`}
                    </p>
                    {student.email && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{student.email}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
