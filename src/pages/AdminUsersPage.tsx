import { useState } from 'react';
import { useUsers } from '@/shared/hooks';

export function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: usersData, isLoading } = useUsers({ search: searchQuery });

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Управление пользователями</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Просмотр и управление учетными записями</p>
        </div>

        <div className="bg-white dark:bg-[#1e2936] p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Поиск по имени или email..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка пользователей...</p>
          </div>
        ) : !usersData || usersData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">group</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Пользователи не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {searchQuery ? 'Попробуйте изменить параметры поиска' : 'Нет зарегистрированных пользователей'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Пользователь</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Роль</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {usersData.results.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-white">
                              {user.full_name || user.username}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-slate-500 dark:text-slate-400">{user.email || '-'}</div>
                      </td>
                      <td className="p-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {user.is_staff ? 'Администратор' : 'Пользователь'}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.is_active
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                        }`}>
                          {user.is_active ? 'Активен' : 'Неактивен'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
              Показано {usersData.results.length} из {usersData.count} пользователей
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
