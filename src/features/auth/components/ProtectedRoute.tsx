import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../hooks/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect ke login, namun simpan tujuan agar bisa kembali (optional)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
