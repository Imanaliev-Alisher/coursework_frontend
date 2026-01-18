import { useAudiences } from '@/shared/hooks';

export function RoomsPage() {
  const { data: audiencesData, isLoading } = useAudiences();

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-[1400px] mx-auto">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-6">Аудитории</h2>
        
        {isLoading ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Загрузка аудиторий...</p>
          </div>
        ) : !audiencesData || audiencesData.results.length === 0 ? (
          <div className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">meeting_room</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Аудитории не найдены</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Нет доступных аудиторий</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audiencesData.results.map((audience) => (
              <div key={audience.id} className="bg-white dark:bg-[#1e2936] rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[28px]">meeting_room</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">{audience.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{audience.type_name}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">business</span>
                    {audience.building_name}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[18px] text-slate-400">group</span>
                    Вместимость: {audience.capacity} чел.
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
