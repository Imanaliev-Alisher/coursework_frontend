import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser, useUpdateProfile } from '@/shared/hooks';
import { useToast } from '@/shared/ui/Toast';

export function ProfileEditPage() {
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const updateProfile = useUpdateProfile();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    first_name: currentUser?.first_name || '',
    last_name: currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await updateProfile.mutateAsync(formData);
      showToast('Профиль успешно обновлён', 'success');
      navigate(-1);
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      showToast('Ошибка при обновлении профиля', 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[960px] mx-auto">
        {/* Заголовок */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Редактирование профиля</h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Обновите свои личные данные</p>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
            <div className="space-y-6">
              {/* Основная информация */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">person</span>
                  Основная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Введите имя"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Фамилия
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Введите фамилию"
                    />
                  </div>
                </div>
              </div>

              {/* Контактная информация */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">contact_mail</span>
                  Контактная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-primary"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (999) 999-99-99"
                    />
                  </div>
                </div>
              </div>

              {/* Системная информация (только для чтения) */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[24px]">info</span>
                  Системная информация
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Логин</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">{currentUser.username}</p>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Роль</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white">
                      {currentUser.is_staff ? 'Администратор' : currentUser.role === 'TEACHER' ? 'Преподаватель' : 'Студент'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary hover:bg-blue-600 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all"
            >
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
