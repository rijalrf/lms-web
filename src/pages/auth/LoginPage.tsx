import React from 'react';
import { LoginForm } from '../../features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      {/* Ornamen Background Pemanis (opsional) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-primary-50/50 to-transparent dark:from-slate-800/50"></div>
      </div>
      
      {/* Kontainer Utama Form */}
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};
