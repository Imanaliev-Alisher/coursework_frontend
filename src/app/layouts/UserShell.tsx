import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useLogout, useCurrentUser } from '@/shared/hooks';

export function UserShell() {
  const navigate = useNavigate();
  const logout = useLogout();
  const { data: currentUser } = useCurrentUser();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        // Принудительная перезагрузка страницы для полной очистки состояния
        window.location.href = '/login';
      },
    });
  };

  const isAdmin = currentUser?.is_staff;
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-white h-screen flex overflow-hidden">
      <aside className="w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col h-full">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-base font-bold leading-tight">Учебная часть</h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Система управления</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">home</span>
              <span className="text-sm font-medium">Главная</span>
            </NavLink>

            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">calendar_month</span>
              <span className="text-sm font-medium">Расписание</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/groups"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                    : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                }
              >
                <span className="material-symbols-outlined">groups</span>
                <span className="text-sm font-medium">Группы</span>
              </NavLink>
            )}

            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">school</span>
              <span className="text-sm font-medium">Преподаватели</span>
            </NavLink>

            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                isActive
                  ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                  : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
              }
            >
              <span className="material-symbols-outlined">meeting_room</span>
              <span className="text-sm font-medium">Аудитории</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin/schedule"
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary'
                    : 'flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                }
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                <span className="text-sm font-medium">Админ</span>
              </NavLink>
            )}
          </nav>

          <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <Link
                to="/profile/edit"
                className="flex flex-col min-w-0 flex-1 hover:text-primary transition-colors"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentUser?.full_name || `${currentUser?.first_name} ${currentUser?.last_name}` || currentUser?.username || 'Пользователь'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || (currentUser?.is_staff ? 'Администратор' : currentUser?.role === 'TEACHER' ? 'Преподаватель' : 'Студент')}
                </p>
              </Link>
              <button 
                className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                onClick={handleLogout}
                type="button"
                title="Выход"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Outlet />
      </main>
    </div>
  );
}
