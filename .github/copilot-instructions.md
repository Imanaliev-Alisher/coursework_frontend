# Copilot instructions (frontend АИС расписания)

## Контекст
- Проект: frontend для АИС управления расписанием (публичный просмотр + админ‑управление).
- UX ориентирован на макеты (Tailwind‑разметка), без лишних фич.

## Стек и команды
- Package manager: **pnpm** (см. `package.json` → `packageManager`).
- React 18 + TypeScript + Vite + Tailwind.
- Запуск/сборка:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm build`
  - `pnpm preview`

## Архитектура и важные файлы
- Точка входа: `src/main.tsx` → `src/app/App.tsx`.
- Роутинг: `src/app/router.tsx` (React Router). Тип `router` задан явно через `ReturnType<typeof createBrowserRouter>` — не меняй обратно на неявный (иначе возможна ошибка TS2742 в сборке).
- Глобальные стили/тема:
  - `src/index.css` — Tailwind + CSS‑переменные (цвета), `darkMode: 'class'`.
  - `index.html` — подключены Inter и Material Symbols.

## Структура модулей (следуй ей)
- `src/app/` — bootstrap, роутер, shell‑лейауты (`src/app/layouts/*`).
- `src/pages/` — страницы по маршрутам.
- `src/features/` — доменные фичи. Сейчас: `src/features/schedule/` (типы + мок‑данные).
- `src/shared/` — переиспользуемые UI/утилиты (напр. `src/shared/ui/Badge.tsx`).

## Маршруты, которые уже существуют
- `/schedule` — пользовательский просмотр (страница `src/pages/UserSchedulePage.tsx`).
- `/admin/schedule` — админ‑таблица (страница `src/pages/AdminSchedulePage.tsx`).
- `/admin/schedule/new` и `/admin/schedule/:id/edit` — форма занятия (`src/pages/LessonFormPage.tsx`).

## Конвенции
- Зависимости: не добавляй пакеты “для удобства” без явного запроса.
- Дата/время: пока контракт бэкенда не определён, в доменных типах держим ISO‑строки (см. `src/features/schedule/types.ts`).
