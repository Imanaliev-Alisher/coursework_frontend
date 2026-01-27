# АИС Расписания (Frontend)

Frontend приложение для автоматизированной информационной системы управления расписанием учебных занятий.

## Стек технологий

- **React 18** + **TypeScript**
- **Vite** - сборщик и dev-сервер
- **React Router** - маршрутизация
- **TanStack Query (React Query)** - управление серверным состоянием
- **Axios** - HTTP клиент с JWT interceptors
- **Tailwind CSS** - стили
- **jsPDF** + **jspdf-autotable** - экспорт в PDF
- **XLSX** - экспорт в Excel

## Требования

### Локальная разработка
- Node.js >= 18
- pnpm (рекомендуется) или npm
- Бэкенд API запущен на `http://localhost:8888`

### Docker
- Docker >= 20.10
- Docker Compose >= 2.0

## Установка и запуск

### Вариант 1: Локальная разработка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd aes
```

2. Установите зависимости:
```bash
pnpm install
```

3. Создайте файл `.env` на основе `.env.example`:
```bash
cp .env.example .env
```

4. Убедитесь, что бэкенд запущен на `http://localhost:8888`

5. Запустите dev-сервер:
```bash
pnpm dev
```

Приложение будет доступно по адресу: http://localhost:5173

### Вариант 2: Docker (Production)

1. Соберите и запустите контейнеры:
```bash
docker-compose up -d --build
```

Приложение будет доступно по адресу: http://localhost:3000

2. Остановка контейнеров:
```bash
docker-compose down
```

### Вариант 3: Docker (Development с Hot Reload)

1. Запустите dev-контейнер:
```bash
docker-compose -f docker-compose.dev.yml up -d --build
```

Приложение будет доступно по адресу: http://localhost:5173
- Изменения в коде автоматически применяются (hot reload)

2. Просмотр логов:
```bash
docker-compose -f docker-compose.dev.yml logs -f frontend-dev
```

3. Остановка:
```bash
docker-compose -f docker-compose.dev.yml down
```

### Другие команды

#### Локальная сборка
```bash
pnpm build
```

#### Предпросмотр продакшен-сборки
```bash
pnpm preview
```

#### Docker: пересборка без кэша
```bash
docker-compose build --no-cache
```

#### Docker: просмотр логов
```bash
docker-compose logs -f frontend
```

## Структура проекта

```
src/
├── app/                    # Инициализация приложения
│   ├── App.tsx            # Корневой компонент с провайдерами
│   ├── router.tsx         # Конфигурация маршрутов
│   ├── ProtectedRoute.tsx # HOC для защищенных роутов
│   └── layouts/           # Shell-лейауты (Admin, User)
├── features/              # Доменные фичи
│   └── schedule/          # Фича расписания
│       ├── types.ts       # TypeScript типы
│       └── mock.ts        # Мок-данные (legacy)
├── pages/                 # Страницы приложения
│   ├── UserSchedulePage.tsx      # Просмотр расписания
│   ├── AdminSchedulePage.tsx     # Управление предметами
│   ├── LessonFormPage.tsx        # Форма создания/редактирования
│   └── ...                       # Другие страницы
├── shared/                # Переиспользуемые модули
│   ├── api/              # API клиенты
│   │   ├── client.ts     # Axios instance с interceptors
│   │   ├── auth.ts       # Аутентификация
│   │   ├── subjects.ts   # Предметы и расписание
│   │   ├── groups.ts     # Учебные группы
│   │   ├── users.ts      # Пользователи, студенты, преподаватели
│   │   └── ...           # Другие API модули
│   ├── hooks/            # React хуки
│   │   ├── useAuth.ts    # Хуки аутентификации
│   │   ├── useSubjects.ts # Хуки для предметов
│   │   ├── useGroups.ts  # Хуки для групп
│   │   └── ...           # Другие хуки
│   ├── ui/               # UI компоненты
│   │   ├── Toast.tsx     # Система уведомлений
│   │   ├── ErrorBoundary.tsx # Обработчик ошибок
│   │   └── Badge.tsx     # Бейджи
│   ├── utils/            # Утилиты
│   │   └── exportSchedule.ts # Экспорт PDF/Excel
│   └── constants/        # Константы
│       ├── weekTypes.ts  # Типы недель
│       └── weekDays.ts   # Дни недели
└── main.tsx              # Точка входа
```

## API Интеграция

Подробная документация по интеграции с бэкендом находится в [docs/API_INTEGRATION.md](./docs/API_INTEGRATION.md)

### Основные эндпоинты

- `POST /api/v1/auth/token/` - Аутентификация
- `GET /api/v1/study-groups/` - Учебные группы
- `GET /api/v1/subjects/group_timetable/` - Расписание группы
- `GET /api/v1/teachers/` - Преподаватели
- `GET /api/v1/students/` - Студенты

### Пример использования

```tsx
import { useGroups, useGroupTimetable } from '@/shared/hooks';

function SchedulePage() {
  const { data: groups } = useGroups();
  const { data: timetable } = useGroupTimetable(groupId);

  return (
    // ...
  );
}
```

## Тестовые учетные данные

Для входа в систему используйте следующие данные:

- **Администратор:** `admin` / `admin123`
- **Преподаватель:** `ivanov_i1` / `teacher123`
- **Студент:** `ivanov_a1_ивт21` / `student123`

## Маршруты

### Пользовательские
- `/login` - Страница входа
- `/schedule` - Просмотр расписания
- `/groups` - Список групп
- `/teachers` - Список преподавателей
- `/rooms` - Список аудиторий

### Административные
- `/admin/schedule` - Управление расписанием
- `/admin/schedule/new` - Создание занятия
- `/admin/schedule/:id/edit` - Редактирование занятия
- `/admin/groups` - Управление группами
- `/admin/teachers` - Управление преподавателями
- `/admin/users` - Управление пользователями

## Особенности

### Аутентификация
- JWT токены (access + refresh) хранятся в localStorage
- Автоматическое обновление access токена через interceptors
- Перенаправление на `/login` при истечении сессии через React Router
- Защищенные роуты для административной панели

### React Query
- Кэширование запросов (5 минут)
- Автоматическая инвалидация при мутациях
- Retry механизм (1 попытка)
- Оптимистичные обновления

### Система уведомлений
- Toast компонент для всех уведомлений
- Типы: success, error, info
- Автоматическое закрытие через 3 секунды
- Анимированное появление
- Используйте `pnpm` для управления зависимостями
- Не добавляйте пакеты без явного запроса
- Следуйте существующей структуре проекта
- Используйте константы для магических строк
- Добавляйте try-catch в асинхронные операции
- Используйте Toast вместо alert()
- Мемоизируйте callback функции через useCallback
- Оптимизируйте вычисления через useMemo
- Добавляйте cleanup в useEffect где необходимо

## Архитектурные решения

### Docker конфигурация

**Production** (`Dockerfile` + `docker-compose.yml`):
- Multi-stage build для оптимизации размера образа
- Nginx для раздачи статики
- Gzip сжатие и кэширование
- Безопасные HTTP заголовки
- SPA fallback для роутинга

**Development** (`Dockerfile.dev` + `docker-compose.dev.yml`):
- Hot reload при изменении файлов
- Volume mapping для исходного кода
- Dev-сервер Vite на порту 5173

**Файлы конфигурации**:
- `docker-compose.yml` - production окружение (порт 3000)
- `docker-compose.dev.yml` - development окружение (порт 5173)
- `.dockerignore` - исключения при сборке образа
- `compose/Dockerfile` - production образ с Nginx
- `compose/Dockerfile.dev` - development образ с Vite dev-server
- `compose/nginx.conf` - конфигурация Nginx для SPA

### Code Review фиксы
В проекте были применены следующие улучшения безопасности и производительности:
- ✅ Замена `alert()` на систему Toast уведомлений
- ✅ Обработка ошибок в функциях экспорта
- ✅ Redirect через React Router вместо `window.location.href`
- ✅ Cleanup функции в useEffect
- ✅ Валидация входных данных
- ✅ Оптимизация с useCallback/useMemo
- ✅ QueryClient вынесен из компонента
- ✅ Error Boundary для глобальной обработки ошибок
- ✅ Константы вместо магических строк
- ✅ Константы вместо магических строк
- Детальные сообщения об ошибках в dev режиме

### Экспорт расписания
- **PDF**: Календарный вид (7 колонок для дней недели), построчное отображение занятий
- **Excel**: Улучшенное форматирование, настраиваемая ширина колонок, объединенные ячейки для заголовков
- Фильтрация по типу недели (нечетная/четная/все)

### Производительность
- `useCallback` для мемоизации функций
- `useMemo` для дорогих вычислений (фильтрация, уникальные значения)
- QueryClient вынесен за пределы компонентов
- Cleanup функции в useEffect для предотвращения утечек памяти

### TypeScript
- Строгая типизация на основе OpenAPI схемы бэкенда
- Type-safe API клиенты
- Константы с типами (as const)
- Автодополнение в IDE

### UI/UX
- Темная/светлая тема
- Календарный вид расписания (7 дней: Пн-Вс)
- Мягкие тени вместо borders для визуальной иерархии
- Автоматический выбор группы для студентов
- Блокировка выбора группы для студентов
- Фильтры: по типу недели, предмету, аудитории

## Конвенции кода

- Используйте `pnpm` для управления зависимостями
- Не добавляйте пакеты без явного запроса
- Следуйте существующей структуре проекта
- Пишите компоненты в соответствии с Feature-Sliced Design

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `VITE_API_BASE_URL` | URL бэкенд API | `http://localhost:8888/api/v1` |

## Ссылки

- [Бэкенд репозиторий](https://github.com/Imanaliev-Alisher/coursework)
- [API документация](http://localhost:8888/api/docs/)
- [React Query документация](https://tanstack.com/query/latest)
- [Tailwind CSS документация](https://tailwindcss.com/docs)
