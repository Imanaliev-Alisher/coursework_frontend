import { useState } from 'react';
import { useGroups, useGroupTimetable } from '@/shared/hooks';

export function ScheduleViewer() {
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined);
  
  const { data: groupsData, isLoading: isLoadingGroups } = useGroups();
  const { data: timetable, isLoading: isLoadingTimetable } = useGroupTimetable(selectedGroupId);

  if (isLoadingGroups) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Загрузка групп...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Выбор группы */}
      <div>
        <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
          Выберите группу
        </label>
        <select
          id="group"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedGroupId || ''}
          onChange={(e) => setSelectedGroupId(Number(e.target.value) || undefined)}
        >
          <option value="">-- Выберите группу --</option>
          {groupsData?.results.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title} ({group.students_count} студентов)
            </option>
          ))}
        </select>
      </div>

      {/* Расписание */}
      {selectedGroupId && (
        <div>
          {isLoadingTimetable ? (
            <div className="text-center py-8 text-gray-500">Загрузка расписания...</div>
          ) : timetable && Array.isArray(timetable) && timetable.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      День
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Время
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Предмет
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тип
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Аудитория
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Преподаватель
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timetable.map((entry: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {entry.day}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.time_slot}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {entry.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.subject_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.audience}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {entry.teacher || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Расписание для этой группы не найдено
            </div>
          )}
        </div>
      )}
    </div>
  );
}
