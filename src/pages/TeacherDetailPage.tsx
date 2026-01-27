import { useParams, Link } from 'react-router-dom';
import { useTeacher } from '@/shared/hooks';

export function TeacherDetailPage() {
  const { id } = useParams<{ id: string }>();
  const teacherId = id ? parseInt(id) : 0;
  const { data: teacher, isLoading } = useTeacher(teacherId);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка преподавателя...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">person</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Преподаватель не найден</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Преподаватель с таким ID не существует</p>
            <Link to="/teachers" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Вернуться к списку преподавателей
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
          <Link to="/teachers" className="hover:text-primary transition-colors">Преподаватели</Link>
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || teacher.username}
          </span>
        </div>

        {/* Заголовок с аватаром */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {(teacher.first_name?.charAt(0) || teacher.username?.charAt(0) || 'T').toUpperCase()}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() || teacher.username}
              </h2>
              {teacher.department && (
                <p className="mt-1 text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                  {teacher.department}
                </p>
              )}
            </div>
          </div>
          <Link to="/teachers" className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
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
            {teacher.email && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">mail</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                  <a href={`mailto:${teacher.email}`} className="text-base font-medium text-primary hover:underline">
                    {teacher.email}
                  </a>
                </div>
              </div>
            )}
            {(teacher.phone_number || teacher.phone) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">phone</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Телефон</p>
                  <a href={`tel:${teacher.phone_number || teacher.phone}`} className="text-base font-medium text-primary hover:underline">
                    {teacher.phone_number || teacher.phone}
                  </a>
                </div>
              </div>
            )}
            {(teacher.cabinet || teacher.office) && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">door_front</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Кабинет</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">Каб. {teacher.cabinet || teacher.office}</p>
                </div>
              </div>
            )}
            {teacher.username && (
              <div className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                <span className="material-symbols-outlined text-slate-400 text-[24px]">badge</span>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Логин</p>
                  <p className="text-base font-medium text-slate-900 dark:text-white">{teacher.username}</p>
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
              <span className="font-medium text-slate-900 dark:text-white">{teacher.first_name || '—'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Фамилия</span>
              <span className="font-medium text-slate-900 dark:text-white">{teacher.last_name || '—'}</span>
            </div>
            {teacher.department && (
              <div className="flex justify-between items-center py-3">
                <span className="text-slate-500 dark:text-slate-400">Кафедра</span>
                <span className="font-medium text-slate-900 dark:text-white">{teacher.department}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
