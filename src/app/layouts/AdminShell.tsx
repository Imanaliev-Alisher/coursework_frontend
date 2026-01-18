import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useLogout } from '@/shared/hooks';

export function AdminShell() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/login'),
    });
  };
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display antialiased">
      <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-[#15202b] border-r border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-primary/10 rounded-lg p-2 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>
                school
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-none">EduAdmin</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Университет</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/admin/groups"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">groups</span>
              <span className="text-sm font-medium">Группы</span>
            </NavLink>

            <NavLink
              to="/admin/teachers"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">person</span>
              <span className="text-sm font-medium">Преподаватели</span>
            </NavLink>

            <NavLink
              to="/admin/lessons"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">book</span>
              <span className="text-sm font-medium">Занятия</span>
            </NavLink>

            <NavLink
              to="/admin/schedule"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="text-sm font-bold">Расписание</span>
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span className="text-sm font-medium">Пользователи</span>
            </NavLink>

            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">visibility</span>
              <span className="text-sm font-medium">Пользовательский вид</span>
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">admin@university.edu</p>
            </div>
            <button 
              className="ml-auto text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" 
              type="button"
              onClick={handleLogout}
              title="Выход"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
