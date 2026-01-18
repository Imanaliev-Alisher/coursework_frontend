import { useState } from 'react';
import { useCurrentUser } from '@/shared/hooks';

export function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { data: currentUser } = useCurrentUser();

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Настройки</h2>
        
        <div className="space-y-6">
          {/* Профиль */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Профиль пользователя</h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {currentUser?.full_name || currentUser?.username || 'Пользователь'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser?.email || 'email@example.com'}</p>
              </div>
            </div>
          </div>

          {/* Тема */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Внешний вид</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Тема оформления</label>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[28px]">light_mode</span>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">Светлая</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Классический светлый дизайн</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[28px]">dark_mode</span>
                    <div className="text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">Тёмная</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Тёмный режим для глаз</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Уведомления */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Уведомления</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Email уведомления</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Получать уведомления на почту</p>
                </div>
                <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Изменения в расписании</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Уведомлять о любых изменениях</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
