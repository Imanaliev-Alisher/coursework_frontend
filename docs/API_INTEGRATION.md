# API Интеграция

## Структура

```
src/
├── shared/
│   ├── api/          # API клиенты и сервисы
│   │   ├── client.ts      # Базовый axios клиент с интерсепторами
│   │   ├── auth.ts        # Методы аутентификации
│   │   ├── subjects.ts    # Методы для работы с предметами
│   │   ├── groups.ts      # Методы для работы с группами
│   │   ├── users.ts       # Методы для работы с пользователями
│   │   └── index.ts       # Экспорты
│   └── hooks/        # React Query хуки
│       ├── useAuth.ts     # Хуки авторизации
│       ├── useSubjects.ts # Хуки для предметов
│       ├── useGroups.ts   # Хуки для групп
│       ├── useUsers.ts    # Хуки для пользователей
│       └── index.ts       # Экспорты
└── features/
    └── schedule/
        └── types.ts       # TypeScript типы на основе OpenAPI схемы
```

## Использование

### 1. Аутентификация

```tsx
import { useLogin, useIsAuthenticated } from '@/shared/hooks';

function LoginPage() {
  const login = useLogin();
  const isAuthenticated = useIsAuthenticated();

  const handleSubmit = async (username: string, password: string) => {
    try {
      await login.mutateAsync({ username, password });
      // Токены автоматически сохраняются в localStorage
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    // ...
  );
}
```

### 2. Получение данных

```tsx
import { useGroups, useGroupTimetable } from '@/shared/hooks';

function SchedulePage() {
  const { data: groups, isLoading } = useGroups();
  const { data: timetable } = useGroupTimetable(selectedGroupId);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div>
      {/* Отображение расписания */}
    </div>
  );
}
```

### 3. Создание/обновление данных

```tsx
import { useCreateSubject, useUpdateSubject } from '@/shared/hooks';

function SubjectForm() {
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  const handleSubmit = async (data) => {
    if (isEdit) {
      await updateSubject.mutateAsync({ id: subjectId, data });
    } else {
      await createSubject.mutateAsync(data);
    }
  };

  return (
    // ...
  );
}
```

## API Endpoints

### Аутентификация
- `POST /api/v1/auth/token/` - Получить JWT токены
- `POST /api/v1/auth/token/refresh/` - Обновить access токен

### Пользователи
- `GET /api/v1/users/me/` - Текущий пользователь
- `GET /api/v1/students/` - Список студентов
- `GET /api/v1/teachers/` - Список преподавателей

### Учебные группы
- `GET /api/v1/study-groups/` - Список групп
- `GET /api/v1/study-groups/{id}/` - Детали группы
- `POST /api/v1/study-groups/` - Создать группу
- `PUT /api/v1/study-groups/{id}/` - Обновить группу
- `DELETE /api/v1/study-groups/{id}/` - Удалить группу

### Предметы
- `GET /api/v1/subjects/` - Список предметов
- `GET /api/v1/subjects/{id}/` - Детали предмета
- `POST /api/v1/subjects/` - Создать предмет
- `PUT /api/v1/subjects/{id}/` - Обновить предмет
- `DELETE /api/v1/subjects/{id}/` - Удалить предмет

### Расписание
- `GET /api/v1/subjects/group_timetable/?group_id={id}` - Расписание группы
- `GET /api/v1/subjects/teacher_timetable/?teacher_id={id}` - Расписание преподавателя
- `GET /api/v1/subjects/audience_timetable/?audience_id={id}` - Расписание аудитории

### Экспорт
- `GET /api/v1/subjects/export_group_pdf/?group_id={id}` - PDF расписания группы
- `GET /api/v1/subjects/export_group_excel/?group_id={id}` - Excel расписания группы

## Переменные окружения

Создайте файл `.env` в корне проекта:

```
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Автоматическое обновление токена

API клиент автоматически:
1. Добавляет Bearer токен к запросам
2. Обновляет access токен при получении 401 ошибки
3. Перенаправляет на /login при неудачном обновлении

## React Query настройки

- `staleTime`: 5 минут - данные считаются свежими
- `refetchOnWindowFocus`: false - не перезапрашивать при фокусе окна
- `retry`: 1 - одна попытка повтора при ошибке

## TypeScript типы

Все типы данных основаны на OpenAPI схеме бэкенда и находятся в:
- `src/features/schedule/types.ts`

Основные типы:
- `User`, `Student`, `Teacher` - пользователи
- `StudyGroupBrief`, `StudyGroupDetail` - учебные группы
- `SubjectBrief`, `SubjectDetail` - предметы
- `ScheduleItem`, `ScheduleDetail` - расписание
- `TimeSlot`, `Day` - временные слоты и дни недели
- `PaginatedResponse<T>` - пагинированные ответы
