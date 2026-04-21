import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersService } from '../../../services/usersService';
import { Users as UsersIcon, Edit, Trash2, Plus } from 'lucide-react';
import { Pagination } from '../../../components/Pagination';

export const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ['users', currentPage],
    queryFn: () => usersService.getUsers(currentPage, itemsPerPage),
    placeholderData: (previousData) => previousData,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (isError || !data?.success) {
    return <div className="text-red-500">Gagal memuat data pengguna.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <UsersIcon className="text-primary-600 dark:text-primary-400" size={24} />
            </div>
            Daftar Pengguna Aktif
          </h2>
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm shadow-sm ring-1 ring-primary-600">
            <Plus size={16} />
            Registrasi
          </button>
        </div>
        
        <div className={`overflow-x-auto transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Nama User</th>
                <th className="px-6 py-4">Kontak</th>
                <th className="px-6 py-4">Posisi</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {data.data.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className="block text-slate-800 dark:text-slate-200">{user.position}</span>
                    <span className="text-xs text-slate-400">{user.divisi}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      user.role === 'TRAINER' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-amber-600 bg-amber-50 rounded-md" title="Edit"><Edit size={16} /></button>
                      <button className="p-2 text-rose-600 bg-rose-50 rounded-md" title="Hapus"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {data.pagination && (
        <Pagination 
          pagination={data.pagination} 
          onPageChange={handlePageChange}
          isLoading={isPlaceholderData}
        />
      )}
    </div>
  );
};
