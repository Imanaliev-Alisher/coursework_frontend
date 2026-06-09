import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsAuthenticated, useCurrentUser } from '@/shared/hooks';

type ProtectedRouteProps = {
  children: ReactNode;
  requireAdmin?: boolean;
};

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const isAuthenticated = useIsAuthenticated();
  const { data: currentUser, isLoading } = useCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin) {
    if (isLoading) return null;
    if (!currentUser?.is_staff) {
      return <Navigate to="/schedule" replace />;
    }
  }

  return <>{children}</>;
}
