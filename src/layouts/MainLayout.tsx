import React, { useState } from 'react';
import { Menu, X, Bell, User, CalendarRange, LogOut, FileText, Users, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuthStore';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Fungsi helper untuk menentukan menu aktif
  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/') return true;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-white dark:bg-slate-800 shadow-xl transition-all duration-300 z-20 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-700">
          {isSidebarOpen && <span className="text-xl font-bold text-primary-600 truncate ml-2">LMS Admin</span>}
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 focus:outline-none transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            to="/dashboard" 
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('/dashboard')
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <LayoutDashboard size={20} className={isActive('/dashboard') ? 'text-primary-500' : 'text-slate-400'} />
            {isSidebarOpen && <span className="ml-3 truncate">Dashboard</span>}
          </Link>

          <Link 
            to="/topics" 
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('/topics')
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <FileText size={20} className={isActive('/topics') ? 'text-primary-500' : 'text-slate-400'} />
            {isSidebarOpen && <span className="ml-3 truncate">Topik Materi</span>}
          </Link>

          <Link 
            to="/assignments" 
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('/assignments') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <CalendarRange size={20} className={isActive('/assignments') ? 'text-primary-500' : 'text-slate-400'} />
            {isSidebarOpen && <span className="ml-3 truncate">Penugasan</span>}
          </Link>

          <Link 
            to="/users" 
            className={`flex items-center p-3 rounded-lg transition-colors ${
              isActive('/users') 
                ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <Users size={20} className={isActive('/users') ? 'text-primary-500' : 'text-slate-400'} />
            {isSidebarOpen && <span className="ml-3 truncate">Karyawan</span>}
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Menu */}
        <header className="h-16 bg-white dark:bg-slate-800 shadow-sm flex items-center justify-between px-6 z-10 transition-colors duration-300 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-500 font-medium dark:text-slate-400 capitalize">
              Dashboard <span className="text-slate-300 dark:text-slate-600 px-2">/</span> {location.pathname.split('/')[1] || 'Home'}
            </span>
          </div>
          <div className="flex items-center space-x-5">
            <button className="text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 -mr-1 -mt-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center space-x-3 border-l border-slate-200 dark:border-slate-700 pl-4 ml-1">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role || 'Administrator'}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 ring-2 ring-primary-50 cursor-pointer transition-all hover:ring-primary-100 dark:ring-slate-700">
                <User size={16} />
              </div>
              <button 
                onClick={handleLogout}
                className="ml-2 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Keluar"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
