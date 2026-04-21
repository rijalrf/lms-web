import React from 'react';
import { RegisterForm } from '../../features/auth/components/RegisterForm';
import { BookOpen } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex flex-col justify-center py-10 sm:px-6 lg:px-8 bg-grid-slate-100 dark:bg-grid-slate-800">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center mb-6">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-600/30">
          <BookOpen size={36} className="text-white" />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Bergabung Sekarang
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400 max-w-sm">
          Akses modul pelatihan, kelola kelas, dan pandu peserta didik menuju kesuksesan.
        </p>
      </div>

      <div className="sm:mx-auto w-full max-w-lg px-4 flex justify-center">
        <RegisterForm />
      </div>
      
    </div>
  );
};
