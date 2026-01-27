import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigationCallback } from '@/shared/api/client';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminShell } from './layouts/AdminShell';
import { UserShell } from './layouts/UserShell';
import { AdminGroupsPage } from '../pages/AdminGroupsPage';
import { AdminGroupFormPage } from '../pages/AdminGroupFormPage';
import { AdminSchedulePage } from '../pages/AdminSchedulePage';import { AdminScheduleGeneratorPage } from '@/pages/AdminScheduleGeneratorPage';import { AdminTeachersPage } from '../pages/AdminTeachersPage';
import { AdminLessonsPage } from '../pages/AdminLessonsPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { UserDetailPage } from '../pages/UserDetailPage';
import { ProfileEditPage } from '../pages/ProfileEditPage';
import { GroupsPage } from '../pages/GroupsPage';
import { GroupDetailPage } from '../pages/GroupDetailPage';
import { HomePage } from '../pages/HomePage';
import { LessonFormPage } from '../pages/LessonFormPage';
import { LoginPage } from '../pages/LoginPage';
import { RoomsPage } from '../pages/RoomsPage';
import { TeachersPage } from '../pages/TeachersPage';
import { TeacherDetailPage } from '../pages/TeacherDetailPage';
import { UserSchedulePage } from '../pages/UserSchedulePage';

function RootLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigationCallback(() => {
      navigate('/login', { replace: true });
    });
  }, [navigate]);

  return <Outlet />;
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/',
        element: <Navigate to="/schedule" replace />,
      },
      {
        path: '/',
        element: <UserShell />,
        children: [
          { path: 'home', element: <HomePage /> },
          { path: 'schedule', element: <UserSchedulePage /> },
          { path: 'groups', element: <GroupsPage /> },
          { path: 'groups/:id', element: <GroupDetailPage /> },
          { path: 'teachers', element: <TeachersPage /> },
          { path: 'teachers/:id', element: <TeacherDetailPage /> },
          { path: 'rooms', element: <RoomsPage /> },
          { path: 'profile/edit', element: <ProfileEditPage /> },
        ],
      },
      {
        path: '/admin',
        element: (
          <ProtectedRoute>
            <AdminShell />
          </ProtectedRoute>
        ),
        children: [
          { path: 'groups', element: <AdminGroupsPage /> },
          { path: 'groups/new', element: <AdminGroupFormPage mode="create" /> },
          { path: 'groups/:id/edit', element: <AdminGroupFormPage mode="edit" /> },
          { path: 'teachers', element: <AdminTeachersPage /> },
          { path: 'lessons', element: <AdminLessonsPage /> },
          { path: 'schedule', element: <AdminSchedulePage /> },
          { path: 'schedule/generate', element: <AdminScheduleGeneratorPage /> },
          { path: 'schedule/new', element: <LessonFormPage mode="create" /> },
          { path: 'schedule/:id/edit', element: <LessonFormPage mode="edit" /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'users/:id', element: <UserDetailPage /> },
          { path: 'profile/edit', element: <ProfileEditPage /> },
        ],
      },
      {
        path: '*',
        element: <Navigate to="/schedule" replace />,
      },
    ],
  },
]);
