import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MainLayout } from './layouts/MainLayout';
import { TopicList } from './features/topics/components/TopicList';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ProtectedRoute } from './features/auth/components/ProtectedRoute';
import { UserPage } from './pages/users/UserPage';
import AssignmentPage from './pages/assignments/AssignmentPage';
import Dashboard from './pages/dashboard/Dashboard';
import { useAuthStore } from './hooks/useAuthStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { checkAuth, isChecking } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent animate-spin rounded-full"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Memverifikasi sesi...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Private Routes with ProtectedRoute and MainLayout */}
          <Route element={<ProtectedRoute><LayoutWrapper /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/assignments" element={<AssignmentPage />} />
            <Route path="/users" element={<UserPage />} />
          </Route>

          {/* Catch All Not Found */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

// Global layout wrapper for all protected routes
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default App;
