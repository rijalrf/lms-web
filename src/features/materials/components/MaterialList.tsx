import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { materialsService, type Material } from '../../../services/materialsService';
import { BookOpen, ExternalLink, Edit, Trash2, Plus } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { MaterialForm } from './MaterialForm';
import { Pagination } from '../../../components/Pagination';

interface MaterialListProps {
  topicId?: number;
  onBack?: () => void;
}

export const MaterialList: React.FC<MaterialListProps> = ({ topicId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuery({
    queryKey: ['materials', topicId, currentPage],
    queryFn: () => {
      if (typeof topicId === 'number') {
        return materialsService.getMaterialsByTopicId(topicId, currentPage, itemsPerPage);
      }
      return materialsService.getMaterials(currentPage, itemsPerPage);
    },
    placeholderData: (previousData) => previousData,
  });

  const handleOpenCreateModal = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: Material) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus materi ini secara permanen?")) {
      setIsDeleting(id);
      try {
        await materialsService.deleteMaterial(id);
        refetch();
      } catch {
        alert("Gagal menghapus materi.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleSuccessAction = () => {
    setIsModalOpen(false);
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 animate-pulse">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-100">
        <p className="font-medium">Gagal memuat data materi.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <div className="p-2 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
              <BookOpen className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
            Daftar Materi Kuliah
          </h2>
        </div>
        
        <button 
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-sm ring-1 ring-primary-600 w-full sm:w-auto"
        >
          <Plus size={18} />
          Tambah Materi Baru
        </button>
      </div>
      
      {/* CARD GRID LAYOUT UNTUK MATERI */}
      <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
        {data.data.map((material) => (
          <div key={material.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700/60 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/50 transition-all group flex flex-col relative">
            
            <div className="absolute top-4 right-4 flex gap-1.5 transition-opacity z-10">
              <button 
                onClick={() => handleOpenEditModal(material)}
                className="p-1.5 bg-white/90 dark:bg-slate-800/90 shadow rounded-lg text-slate-500 hover:text-amber-500 backdrop-blur-sm" 
                title="Edit Data"
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => handleDelete(material.id)}
                disabled={isDeleting === material.id}
                className="p-1.5 bg-white/90 dark:bg-slate-800/90 shadow rounded-lg text-slate-500 hover:text-rose-500 backdrop-blur-sm disabled:opacity-50" 
                title="Hapus Data"
              >
                {isDeleting === material.id ? (
                  <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>

            <div className="h-32 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center p-6 border-b border-slate-100 dark:border-slate-700/50 relative">
              <BookOpen size={48} className="text-primary-200 dark:text-slate-600" />
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <span className="text-[10px] font-bold tracking-wider text-primary-600 dark:text-primary-400 uppercase mb-2">
                Topik ID: #{material.topicId}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 pr-12 line-clamp-2">
                {material.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 flex-1 mt-1">
                {material.description}
              </p>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/60 mt-auto">
              <a 
                href={material.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-200 transition-colors shadow-sm"
              >
                Buka File Terlampir <ExternalLink size={14} />
              </a>
            </div>
            
          </div>
        ))}
      </div>

      {data.data.length === 0 && (
        <div className="py-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed flex flex-col items-center justify-center text-center px-4">
          <BookOpen className="text-slate-300 dark:text-slate-600 mb-4" size={48} />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Materi Masih Kosong</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm">Siapkan fail presentasi dan dokumen pdf untuk mengawali modul ini.</p>
        </div>
      )}

      {data.pagination && (
        <Pagination 
          pagination={data.pagination} 
          onPageChange={handlePageChange}
          isLoading={isPlaceholderData}
        />
      )}

      {/* POPUP MODAL MATERI */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingMaterial ? "Edit Materi" : "Form Unggah Materi"}
        width="lg"
      >
        <MaterialForm 
          initialData={editingMaterial}
          defaultTopicId={topicId}
          onSuccess={handleSuccessAction} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
};
