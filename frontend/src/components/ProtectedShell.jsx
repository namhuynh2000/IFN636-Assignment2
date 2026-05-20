import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from './AppShell';

const ProtectedShell = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Phone number requirement is enforced inside the Profile form submit.
  // We don't redirect other pages (Home/Tasks) because the user may still
  // want to browse while onboarding.

  return <AppShell />;
};

export default ProtectedShell;

