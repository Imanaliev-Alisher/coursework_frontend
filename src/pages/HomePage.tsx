import { Link } from 'react-router-dom';
import { useGroups, useTeachers, useSubjects } from '@/shared/hooks';

export function HomePage() {
  const { data: groupsData } = useGroups();
  const { data: teachersData } = useTeachers();
  const { data: subjectsData } = useSubjects();

  const stats = [
    {
      title: 'Учебных групп',
      value: groupsData?.count || 0,
      icon: 'groups',
      color: 'bg-blue-500',
      link: '/groups',
    },
    {
      title: 'Преподавателей',
      value: teachersData?.count || 0,
      icon: 'school',
      color: 'bg-green-500',
      link: '/teachers',
    },
    {
      title: 'Предметов',
      value: subjectsData?.count || 0,
      icon: 'book',
      color: 'bg-purple-500',
      link: '/admin/schedule',
    },
  ];

  const quickLinks = [
    { title: 'Расписание занятий', icon: 'calendar_month', link: '/schedule', description: 'Просмотр расписания' },
    { title: 'Учебные группы', icon: 'groups', link: '/groups', description: 'Список всех групп' },
    { title: 'Преподаватели', icon: 'school', link: '/teachers', description: 'База преподавателей' },
    { title: 'Аудитории', icon: 'meeting_room', link: '/rooms', description: 'Доступные помещения' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Добро пожаловать!</h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Система управления учебным расписанием</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[32px]">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Быстрый доступ */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Быстрый доступ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                to={link.link}
                className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg transition-all hover:border-primary group"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span className="material-symbols-outlined text-primary text-[28px]">{link.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{link.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{link.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
