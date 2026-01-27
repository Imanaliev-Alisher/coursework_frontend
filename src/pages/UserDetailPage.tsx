import { useParams, Link } from 'react-router-dom';
import { useUser } from '@/shared/hooks';

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : 0;
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка пользователя...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">person</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Пользователь не найден</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Пользователь с таким ID не существует</p>
            <Link to="/admin/users" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Вернуться к списку пользователей
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
          <Link to="/admin/users" className="hover:text-primary transition-colors">Пользователи</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
          </span>
        </div>

        {/* Заголовок с аватаром */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {(user.first_name?.charAt(0) || user.username?.charAt(0) || 'U').toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username}
              </h2>
              <div className="mt-2 flex gap-2">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  user.is_active
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                }`}>
                  {user.is_active ? 'Активен' : 'Неактивен'}
                </div>
                {user.is_staff && (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <span className="material-symbols-outlined text-[14px]">admin_panel_settings</span>
                    Администратор
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link to="/admin/users" className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            Назад
          </Link>
        </div>

        {/* Контактная информация */}
        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">contact_mail</span>
            Контактная информация
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.email && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">mail</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <a href={`mailto:${user.email}`} className="text-base font-medium text-primary hover:underline">
                    {user.email}
                  </a>
                </div>
              </div>
            )}
            {user.phone && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">phone</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Телефон</p>
                  <a href={`tel:${user.phone}`} className="text-base font-medium text-primary hover:underline">
                    {user.phone}
                  </a>
                </div>
              </div>
            )}
            {user.office && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">door_front</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Кабинет</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">Каб. {user.office}</p>
                </div>
              </div>
            )}
            {user.username && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">badge</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Логин</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">{user.username}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Дополнительная информация */}
        <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[24px]">info</span>
            Общая информация
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Имя</span>
              <span className="font-medium text-slate-900 dark:text-white">{user.first_name || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Фамилия</span>
              <span className="font-medium text-slate-900 dark:text-white">{user.last_name || '—'}</span>
            </div>
            {user.department && (
              <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
                <span className="text-slate-500 dark:text-slate-400">Кафедра</span>
                <span className="font-medium text-slate-900 dark:text-white">{user.department}</span>
              </div>
            )}
            {user.date_joined && (
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-500 dark:text-slate-400">Дата регистрации</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {new Date(user.date_joined).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

