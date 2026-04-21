import React from 'react';
import { UserList } from '../../features/users/components/UserList';

export const UserPage: React.FC = () => {
  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin & Karyawan</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Mengelola akun staff internal dan trainer aktif.</p>
      </div>
      <UserList />
    </>
  );
};
