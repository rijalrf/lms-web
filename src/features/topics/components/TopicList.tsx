import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Topic } from '../../../services/topicsService';
import { topicService } from '../../../services/topicsService';
import { FileText, Eye, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { TopicForm } from './TopicForm';
import { MaterialList } from '../../materials/components/MaterialList';
import { Pagination } from '../../../components/Pagination';

export const TopicList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Ambil Data dari React Query
  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuery({
    queryKey: ['topics', currentPage],
    queryFn: () => topicService.getTopics(currentPage, itemsPerPage),
    placeholderData: (previousData) => previousData,
  });

  const handleOpenCreateModal = () => {
    setEditingTopic(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (topic: Topic) => {
    setEditingTopic(topic);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus topik ini secara permanen?")) {
      setIsDeleting(id);
      try {
        await topicService.deleteTopic(id);
        refetch();
      } catch {
        alert("Gagal menghapus topik.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSuccessAction = () => {
    setIsModalOpen(false);
    refetch(); // Segarkan data saat modal berhasil edit/create
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (selectedTopic) {
    return (
      <>
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <button 
            onClick={() => setSelectedTopic(null)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
            title="Kembali ke Daftar Topik"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white line-clamp-1">
              {selectedTopic.title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Materi untuk topik ini</p>
          </div>
        </div>
        <MaterialList topicId={selectedTopic.id} onBack={() => setSelectedTopic(null)} />
      </>
    );
  }

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
        <p className="font-medium">Gagal memuat data topik pembelajaran.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <FileText className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
            Daftar Modul Topik
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Menampilkan Topik Materi Aktif</p>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm ring-1 ring-primary-600 w-full sm:w-auto"
        >
          <Plus size={18} />
          Tambah Topik Baru
        </button>
      </div>
      
      {/* CARD GRID LAYOUT */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
        {data.data.map((topic) => (
          <div key={topic.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden hover:shadow-lg transition-all hover:border-primary-200 dark:hover:border-primary-900/50 group flex flex-col">
            
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full font-mono">
                  ID: {topic.id}
                </span>
                <div className="flex gap-1 transition-opacity">
                  <button 
                    onClick={() => handleOpenEditModal(topic)}
                    className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-md transition-colors" 
                    title="Edit Data"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(topic.id)}
                    disabled={isDeleting === topic.id}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors disabled:opacity-50" 
                    title="Hapus Data"
                  >
                    {isDeleting === topic.id ? (
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight">
                {topic.title}
              </h3>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm line-clamp-3">
                {topic.description}
              </p>
            </div>

            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
               <button 
                onClick={() => setSelectedTopic(topic)}
                className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:underline flex items-center gap-1 tracking-wide"
              >
                 Lihat Materi <Eye size={14} />
               </button>
               <span className="text-xs text-slate-400">Aktif</span>
            </div>
            
          </div>
        ))}
      </div>

      {data.data.length === 0 && (
        <div className="py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center px-4">
          <FileText className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Belum Ada Topik</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm">Buat modul pembelajaran perdana untuk mulai menyusun silabus kelas.</p>
        </div>
      )}

      {data.pagination && (
        <Pagination 
          pagination={data.pagination} 
          onPageChange={handlePageChange}
          isLoading={isPlaceholderData}
        />
      )}

      {/* POPUP MODAL UNTUK FORM */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingTopic ? "Edit Topik Materi" : "Buat Topik Baru"}
        width="lg"
      >
        <TopicForm 
          initialData={editingTopic}
          onSuccess={handleSuccessAction} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
};
