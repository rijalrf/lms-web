import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { assignmentsService, type Assignment, type AssignmentStatus } from '../../../services/assignmentsService';
import { Calendar, Clock, Users, Link as LinkIcon, Edit, Trash2, Plus, Filter, CheckCircle, Clock4 } from 'lucide-react';
import { Modal } from '../../../components/Modal';
import { AssignmentForm } from './AssignmentForm';
import { Pagination } from '../../../components/Pagination';

export const AssignmentList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const itemsPerPage = 8;

  const { data, isLoading, isError, refetch, isPlaceholderData } = useQuery({
    queryKey: ['assignments', currentPage, statusFilter],
    queryFn: () => assignmentsService.getAssignments(currentPage, itemsPerPage, statusFilter),
    placeholderData: (previousData) => previousData,
  });

  const formatDate = (dateString: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        weekday: 'short'
      };
      return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    // Replace . with : to normalize and take only HH:mm
    const normalized = timeString.replace('.', ':');
    const cleanTime = normalized.substring(0, 5);
    return `${cleanTime} WIB`;
  };

  const handleOpenCreateModal = () => {
    setEditingAssignment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus penugasan ini?")) {
      setIsDeleting(id);
      try {
        await assignmentsService.deleteAssignment(id);
        refetch();
      } catch {
        alert("Gagal menghapus penugasan.");
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: AssignmentStatus) => {
    try {
      await assignmentsService.updateAssignmentStatus(id, newStatus);
      refetch();
    } catch {
      alert("Gagal memperbarui status.");
    }
  };

  const handleSuccessAction = () => {
    setIsModalOpen(false);
    refetch();
  };

  const getStatusStyle = (status: AssignmentStatus) => {
    switch (status) {
      case 'PUBLISH': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200';
      case 'DRAFT': return 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border-slate-200';
      case 'CANCEL': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading && !isPlaceholderData) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Jadwal Penugasan Trainer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola jadwal pelatihan dan alokasi trainer</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-primary-500/20 appearance-none"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISH">Terbit (Publish)</option>
              <option value="COMPLETED">Selesai</option>
              <option value="CANCEL">Dibatalkan</option>
            </select>
          </div>
          
          <button 
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm shadow-md"
          >
            <Plus size={18} />
            Buat Penugasan
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 xl:grid-cols-2 gap-6 transition-opacity ${isPlaceholderData ? 'opacity-50' : 'opacity-100'}`}>
        {data?.data.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col md:flex-row group">
            <div className="w-full md:w-48 bg-slate-50 dark:bg-slate-900/50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700/60">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl mb-3">
                {item.trainer.name.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-bold text-slate-800 dark:text-white line-clamp-1">{item.trainer.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.trainer.email}</p>
            </div>

            <div className="flex-1 p-6 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2 line-clamp-1">
                    {item.topic.title}
                  </h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {item.material.title}
                  </p>
                </div>
                
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting === item.id}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  <Calendar size={14} className="text-primary-500" />
                  <span>{formatDate(item.trainingDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium">
                  <Clock size={14} className="text-primary-500" />
                  <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <Users size={14} className="text-slate-400" />
                  <span>Maks. {item.maxParticipant}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                  <LinkIcon size={14} className="text-slate-400" />
                  <a href={item.classRoomLink} target="_blank" rel="noreferrer" className="text-primary-600 hover:underline line-clamp-1">Link Kelas</a>
                </div>
              </div>

              {item.status === 'DRAFT' && (
                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(item.id, 'PUBLISH')}
                    className="flex-1 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <CheckCircle size={12} /> Terbitkan Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data?.data.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <Clock4 size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">Belum Ada Jadwal</h3>
          <p className="text-slate-500 mt-2">Mulai buat penugasan untuk trainer dan atur jadwal pelatihan.</p>
        </div>
      )}

      {data?.pagination && (
        <Pagination 
          pagination={data.pagination} 
          onPageChange={setCurrentPage}
          isLoading={isPlaceholderData}
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingAssignment ? "Edit Penugasan" : "Buat Penugasan Baru"}
        width="2xl"
      >
        <AssignmentForm 
          initialData={editingAssignment}
          onSuccess={handleSuccessAction}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
