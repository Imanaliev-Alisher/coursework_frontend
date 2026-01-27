import { useState } from 'react';
import { useCurrentUser, useTheme } from '@/shared/hooks';
import { useToast } from '@/shared/ui/Toast';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { data: currentUser } = useCurrentUser();
  const { showToast } = useToast();

  // Локальное состояние для редактирования профиля
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    phone_number: (currentUser as any)?.phone_number || '',
  });

  const handleSaveProfile = () => {
    // TODO: Интеграция с API для обновления профиля
    // В будущем здесь будет вызов мутации для обновления данных пользователя
    showToast('Изменения сохранены', 'success');
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      phone_number: (currentUser as any)?.phone_number || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Настройки</h2>
        
        <div className="space-y-6">
          {/* Профиль */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Профиль пользователя</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  <span className="text-sm font-medium">Редактировать</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    <span className="text-sm font-medium">Отмена</span>
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-blue-600 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    <span className="text-sm font-medium">Сохранить</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {currentUser?.full_name || currentUser?.username || 'Пользователь'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{currentUser?.username}</p>
                {currentUser?.role && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {currentUser.role === 'STUDENT' ? 'Студент' : currentUser.role === 'TEACHER' ? 'Преподаватель' : 'Администратор'}
                  </p>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Введите имя"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Введите фамилию"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+7 (999) 999-99-99"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Email</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentUser?.email || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Имя</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentUser?.first_name || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-slate-500 dark:text-slate-400">Фамилия</span>
                  <span className="font-medium text-slate-900 dark:text-white">{currentUser?.last_name || '—'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-slate-500 dark:text-slate-400">Телефон</span>
                  <span className="font-medium text-slate-900 dark:text-white">{(currentUser as any)?.phone_number || '—'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Тема */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Внешний вид</h3>
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-3">Тема оформления</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'light'
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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
                  onClick={() => setTheme('dark')}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    theme === 'dark'
                      ? 'border-primary bg-primary/10'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
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

          {/* О системе */}
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">О системе</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Версия системы</span>
                <span className="font-medium text-slate-900 dark:text-white">0.1.0</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-500 dark:text-slate-400">Название</span>
                <span className="font-medium text-slate-900 dark:text-white">АИС Расписания</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
