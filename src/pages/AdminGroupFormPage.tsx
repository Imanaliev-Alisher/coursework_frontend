import { useState, useEffect, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGroup, useCreateGroup, useUpdateGroup } from '@/shared/hooks';
import type { StudyGroupCreateUpdateRequest } from '@/shared/api';

export function AdminGroupFormPage(props: { mode: 'create' | 'edit' }) {
  const params = useParams();
  const navigate = useNavigate();
  const isEdit = props.mode === 'edit';
  const groupId = isEdit ? Number(params.id) : undefined;

  const { data: group, isLoading: isLoadingGroup } = useGroup(groupId);
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();

  const [formData, setFormData] = useState<StudyGroupCreateUpdateRequest>({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (group && isEdit) {
      setFormData({
        title: group.title,
        description: group.description,
      });
    }
  }, [group, isEdit]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && groupId) {
        await updateGroup.mutateAsync({ id: groupId, data: formData });
      } else {
        await createGroup.mutateAsync(formData);
      }
      navigate('/admin/groups');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    }
  };

  if (isEdit && isLoadingGroup) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[960px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link className="hover:text-primary" to="/admin/groups">
              Группы
            </Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span>{isEdit ? `Редактирование группы ${params.id ?? ''}` : 'Новая группа'}</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {isEdit ? 'Редактирование группы' : 'Создание группы'}
          </h1>
        </div>

        <div className="bg-white dark:bg-[#1e2936] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Название группы *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  placeholder="Например, ИВТ-21"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Описание
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/50"
                  rows={4}
                  placeholder="Описание группы..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
              <Link
                to="/admin/groups"
                className="px-5 py-2.5 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-sm transition-all"
              >
                Отмена
              </Link>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg text-white bg-primary hover:bg-blue-600 font-medium text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createGroup.isPending || updateGroup.isPending}
              >
                {createGroup.isPending || updateGroup.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
