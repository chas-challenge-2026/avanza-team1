import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

function ProtectedRoute(): JSX.Element {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export { ProtectedRoute };