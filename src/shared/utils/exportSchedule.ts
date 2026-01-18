import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { TimetableEntry } from '@/features/schedule/types';
import { WEEK_TYPES, type WeekType } from '@/shared/constants/weekTypes';
import { WEEK_DAYS } from '@/shared/constants/weekDays';

const DAYS = [...WEEK_DAYS];

/**
 * Экспорт расписания в PDF (календарный вид)
 */
export function exportToPDF(
  timetable: TimetableEntry[],
  groupTitle: string,
  weekType: WeekType
) {
  if (!timetable || timetable.length === 0) {
    throw new Error('Нет данных для экспорта');
  }

  try {
    const doc = new jsPDF('landscape');
    
    // Заголовок
    doc.setFontSize(16);
    doc.text(`Расписание: ${groupTitle}`, 14, 15);
    doc.setFontSize(12);
    const weekTypeLabel = weekType === 'odd' ? WEEK_TYPES.ODD : 
                         weekType === 'even' ? WEEK_TYPES.EVEN : 
                         WEEK_TYPES.ALL;
    doc.text(`Тип недели: ${weekTypeLabel}`, 14, 22);

  // Находим максимальное количество занятий в день
  const maxLessonsPerDay = Math.max(...DAYS.map(day => 
    timetable.filter(entry => entry.day === day).length
  ), 1);

  // Создаём строки для таблицы
  const bodyRows = [];
  for (let i = 0; i < maxLessonsPerDay; i++) {
    const row = DAYS.map(day => {
      const dayLessons = timetable.filter(entry => entry.day === day);
      const lesson = dayLessons[i];
      if (lesson) {
        return `${lesson.time_slot}\n${lesson.subject}\n${lesson.subject_type}\n${lesson.audience}\n${lesson.teacher || '-'}`;
      }
      return '';
    });
    bodyRows.push(row);
  }

  // Таблица с календарным видом
  autoTable(doc, {
    startY: 30,
    head: [DAYS],
    body: bodyRows,
    styles: { 
      font: 'helvetica', 
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      valign: 'top'
    },
    headStyles: { 
      fillColor: [59, 130, 246],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 38 },
      1: { cellWidth: 38 },
      2: { cellWidth: 38 },
      3: { cellWidth: 38 },
      4: { cellWidth: 38 },
      5: { cellWidth: 38 },
      6: { cellWidth: 38 }
    }
  });

    // Сохранение
    doc.save(`schedule-${groupTitle}-${weekType}.pdf`);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Не удалось создать PDF файл');
  }
}

/**
 * Экспорт расписания в Excel (календарный вид)
 */
export function exportToExcel(
  timetable: TimetableEntry[],
  groupTitle: string,
  weekType: WeekType
) {
  if (!timetable || timetable.length === 0) {
    throw new Error('Нет данных для экспорта');
  }

  try {
    const weekTypeLabel = weekType === 'odd' ? WEEK_TYPES.ODD : 
                         weekType === 'even' ? WEEK_TYPES.EVEN : 
                         WEEK_TYPES.ALL;
    
    // Заголовок
    const worksheetData: any[][] = [
      ['Расписание:', groupTitle, '', '', '', '', ''],
      ['Тип недели:', weekTypeLabel, '', '', '', '', ''],
    [],
    DAYS
  ];

  // Находим максимальное количество занятий в один день
  const maxLessonsPerDay = Math.max(...DAYS.map(day => 
    timetable.filter(entry => entry.day === day).length
  ), 1);

  // Заполняем данные по дням
  for (let i = 0; i < maxLessonsPerDay; i++) {
    const row = DAYS.map(day => {
      const dayLessons = timetable.filter(entry => entry.day === day);
      const lesson = dayLessons[i];
      if (lesson) {
        return `${lesson.time_slot}\n${lesson.subject}\n${lesson.subject_type}\n📍 ${lesson.audience}\n👤 ${lesson.teacher || '-'}`;
      }
      return '';
    });
    worksheetData.push(row);
  }

  // Создание книги и листа
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Расписание');

  // Настройка ширины колонок (первая колонка шире для заголовков)
  worksheet['!cols'] = [
    { wch: 20 }, // Первая колонка для заголовков
    ...DAYS.slice(1).map(() => ({ wch: 30 }))
  ];

  // Объединение ячеек для заголовков
  worksheet['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }, // Расписание
    { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } }, // Тип недели
  ];

  // Настройка высоты строк
  worksheet['!rows'] = [
    { hpt: 20 }, // Заголовок 1
    { hpt: 20 }, // Заголовок 2
    { hpt: 10 }, // Пустая строка
    { hpt: 25 }, // Дни недели
    ...Array(maxLessonsPerDay).fill({ hpt: 100 }) // Строки с занятиями
  ];

  // Сохранение
  XLSX.writeFile(workbook, `schedule-${groupTitle}-${weekType}.xlsx`);
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Не удалось создать Excel файл');
  }
}
