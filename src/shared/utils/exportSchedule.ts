import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { TimetableEntry } from '@/features/schedule/types';
import { WEEK_TYPES, type WeekType } from '@/shared/constants/weekTypes';
import { WEEK_DAYS } from '@/shared/constants/weekDays';

const DAYS = [...WEEK_DAYS];

// Helpers that work with both the old TimetableEntry shape and the real SubjectScheduleBrief
// shape returned by the API (which uses different field names).
const getDay       = (e: any): string => e.week_day_name  || e.day       || '';
const getTimeSlot  = (e: any): string => e.time_slot_display || String(e.time_slot ?? '') || '';
const getSubject   = (e: any): string => e.subject_title  || e.subject   || '';
const getType      = (e: any): string => e.subject_type   || '';
const getAudience  = (e: any): string => e.audience_details?.title || e.audience || '';
const getTeachers  = (e: any): string =>
  e.teachers_details?.length
    ? e.teachers_details.map((t: any) => t.full_name).join(', ')
    : e.teacher || '-';

function sortedDayLessons(timetable: any[], day: string) {
  return timetable
    .filter(e => getDay(e) === day)
    .sort((a, b) => (Number(a.time_slot) || 0) - (Number(b.time_slot) || 0));
}

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

    doc.setFontSize(16);
    doc.text(`Расписание: ${groupTitle}`, 14, 15);
    doc.setFontSize(12);
    const weekTypeLabel =
      weekType === 'odd' ? WEEK_TYPES.ODD :
      weekType === 'even' ? WEEK_TYPES.EVEN :
      WEEK_TYPES.ALL;
    doc.text(`Тип недели: ${weekTypeLabel}`, 14, 22);

    const maxLessonsPerDay = Math.max(
      ...DAYS.map(day => sortedDayLessons(timetable as any[], day).length),
      1
    );

    const bodyRows = [];
    for (let i = 0; i < maxLessonsPerDay; i++) {
      const row = DAYS.map(day => {
        const lesson = sortedDayLessons(timetable as any[], day)[i];
        if (!lesson) return '';
        return [
          getTimeSlot(lesson),
          getSubject(lesson),
          getType(lesson),
          getAudience(lesson),
          getTeachers(lesson),
        ].join('\n');
      });
      bodyRows.push(row);
    }

    autoTable(doc, {
      startY: 30,
      head: [DAYS],
      body: bodyRows,
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'top',
      },
      headStyles: {
        fillColor: [59, 130, 246],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 38 },
        1: { cellWidth: 38 },
        2: { cellWidth: 38 },
        3: { cellWidth: 38 },
        4: { cellWidth: 38 },
        5: { cellWidth: 38 },
        6: { cellWidth: 38 },
      },
    });

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
    const weekTypeLabel =
      weekType === 'odd' ? WEEK_TYPES.ODD :
      weekType === 'even' ? WEEK_TYPES.EVEN :
      WEEK_TYPES.ALL;

    const worksheetData: any[][] = [
      ['Расписание:', groupTitle, '', '', '', '', ''],
      ['Тип недели:', weekTypeLabel, '', '', '', '', ''],
      [],
      DAYS,
    ];

    const maxLessonsPerDay = Math.max(
      ...DAYS.map(day => sortedDayLessons(timetable as any[], day).length),
      1
    );

    for (let i = 0; i < maxLessonsPerDay; i++) {
      const row = DAYS.map(day => {
        const lesson = sortedDayLessons(timetable as any[], day)[i];
        if (!lesson) return '';
        return [
          getTimeSlot(lesson),
          getSubject(lesson),
          getType(lesson),
          `📍 ${getAudience(lesson)}`,
          `👤 ${getTeachers(lesson)}`,
        ].join('\n');
      });
      worksheetData.push(row);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Расписание');

    worksheet['!cols'] = DAYS.map(() => ({ wch: 30 }));

    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 1 } },
    ];

    worksheet['!rows'] = [
      { hpt: 20 },
      { hpt: 20 },
      { hpt: 10 },
      { hpt: 25 },
      ...Array(maxLessonsPerDay).fill({ hpt: 100 }),
    ];

    XLSX.writeFile(workbook, `schedule-${groupTitle}-${weekType}.xlsx`);
  } catch (error) {
    console.error('Excel export failed:', error);
    throw new Error('Не удалось создать Excel файл');
  }
}
