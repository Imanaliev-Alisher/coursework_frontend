/**
 * Определяет, является ли неделя четной
 * @param date - Дата для проверки (по умолчанию - текущая дата)
 * @returns true, если неделя четная
 * 
 * Примечание: Первая неделя года считается нечетной
 */
export function isEvenWeek(date: Date = new Date()): boolean {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return weekNumber % 2 === 0;
}

/**
 * Возвращает номер недели в году
 * @param date - Дата для проверки (по умолчанию - текущая дата)
 * @returns Номер недели (1-53)
 */
export function getWeekNumber(date: Date = new Date()): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
}

/**
 * Возвращает тип недели для отображения
 * @param date - Дата для проверки (по умолчанию - текущая дата)
 * @returns 'EVEN' для четной недели, 'ODD' для нечетной
 */
export function getWeekType(date: Date = new Date()): 'EVEN' | 'ODD' {
  return isEvenWeek(date) ? 'EVEN' : 'ODD';
}

/**
 * Получить даты начала и конца недели
 * @param date - Дата для проверки (по умолчанию - текущая дата)
 * @returns Объект с датами начала и конца недели
 */
export function getWeekBounds(date: Date = new Date()): { start: Date; end: Date } {
  const today = new Date(date);
  const dayOfWeek = today.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Понедельник как начало недели
  
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diff);
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { start: weekStart, end: weekEnd };
}

/**
 * Форматирует дату в формат YYYY-MM-DD для API
 * @param date - Дата для форматирования
 * @returns Строка в формате YYYY-MM-DD
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Получить даты начала и конца текущей недели в формате для API
 * @returns Объект с датами в формате YYYY-MM-DD
 */
export function getCurrentWeekForAPI(): { start_date: string; end_date: string } {
  const { start, end } = getWeekBounds();
  return {
    start_date: formatDateForAPI(start),
    end_date: formatDateForAPI(end),
  };
}
