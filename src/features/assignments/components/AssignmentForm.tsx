import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, AlertCircle, Calendar, Clock, Users, Link as LinkIcon } from 'lucide-react';
import { assignmentsService, type Assignment, type AssignmentStatus } from '../../../services/assignmentsService';
import { topicService } from '../../../services/topicsService';
import { materialsService } from '../../../services/materialsService';
import { usersService } from '../../../services/usersService';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const assignmentSchema = z.object({
  topicId: z.number().min(1, { message: "Topik wajib dipilih" }),
  materialId: z.number().min(1, { message: "Materi wajib dipilih" }),
  userId: z.number().min(1, { message: "Trainer wajib dipilih" }),
  trainingDate: z.string().min(1, { message: "Tanggal pelatihan wajib diisi" }),
  startTime: z.string().min(1, { message: "Waktu mulai wajib diisi" }),
  endTime: z.string().min(1, { message: "Waktu selesai wajib diisi" }),
  maxParticipant: z.number().min(1, { message: "Minimal 1 peserta" }),
  classRoomLink: z.string().url({ message: "URL link kelas tidak valid" }),
  status: z.enum(['DRAFT', 'PUBLISH', 'CANCEL', 'COMPLETED'] as const)
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignmentFormProps {
  initialData?: Assignment | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      topicId: 0,
      materialId: 0,
      userId: 0,
      trainingDate: '',
      startTime: '',
      endTime: '',
      maxParticipant: 50,
      classRoomLink: '',
      status: 'DRAFT'
    }
  });

  const selectedTopicId = watch('topicId');

  const { data: topicsData } = useQuery({
    queryKey: ['topicsOptions'],
    queryFn: () => topicService.getTopics(1, 100),
  });

  const { data: materialsData } = useQuery({
    queryKey: ['materialsOptions', selectedTopicId],
    queryFn: () => materialsService.getMaterialsByTopicId(selectedTopicId, 1, 100),
    enabled: selectedTopicId > 0,
  });

  const { data: usersData } = useQuery({
    queryKey: ['trainersOptions'],
    queryFn: () => usersService.getUsers(1, 100), // In real app filter by role TRAINER
  });

  useEffect(() => {
    if (initialData) {
      // Normalize time for input type="time" (expects HH:mm)
      const normalizeTime = (t: string) => {
        if (!t) return '';
        const clean = t.replace('.', ':');
        return clean.substring(0, 5);
      };

      reset({
        topicId: initialData.topic.id,
        materialId: initialData.material.id,
        userId: initialData.trainer.id,
        trainingDate: initialData.trainingDate,
        startTime: normalizeTime(initialData.startTime),
        endTime: normalizeTime(initialData.endTime),
        maxParticipant: initialData.maxParticipant,
        classRoomLink: initialData.classRoomLink,
        status: initialData.status
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: AssignmentFormData) => {
    setApiError(null);
    try {
      if (initialData) {
        await assignmentsService.updateAssignment(initialData.id, data);
      } else {
        await assignmentsService.createAssignment(data);
      }
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message || 'Gagal menyimpan penugasan.');
      } else {
        setApiError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-b-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic & Material */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Topik Pelatihan <span className="text-red-500">*</span></label>
              <select
                {...register('topicId', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
                onChange={(e) => {
                  setValue('topicId', Number(e.target.value));
                  setValue('materialId', 0);
                }}
              >
                <option value="0">-- Pilih Topik --</option>
                {topicsData?.data.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
              {errors.topicId && <p className="text-red-500 text-xs mt-1">{errors.topicId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Materi Spesifik <span className="text-red-500">*</span></label>
              <select
                {...register('materialId', { valueAsNumber: true })}
                disabled={!selectedTopicId}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="0">-- Pilih Materi --</option>
                {materialsData?.data.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
              {errors.materialId && <p className="text-red-500 text-xs mt-1">{errors.materialId.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Trainer <span className="text-red-500">*</span></label>
              <select
                {...register('userId', { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="0">-- Pilih Trainer --</option>
                {usersData?.data.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
              {errors.userId && <p className="text-red-500 text-xs mt-1">{errors.userId.message}</p>}
            </div>
          </div>

          {/* Schedule & Link */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tanggal Pelatihan <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register('trainingDate')}
                  type="date"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
              {errors.trainingDate && <p className="text-red-500 text-xs mt-1">{errors.trainingDate.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jam Mulai <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...register('startTime')}
                    type="time"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Jam Selesai <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...register('endTime')}
                    type="time"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maks. Peserta <span className="text-red-500">*</span></label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  {...register('maxParticipant', { valueAsNumber: true })}
                  type="number"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Link Virtual Class (Meet/Zoom) <span className="text-red-500">*</span></label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              {...register('classRoomLink')}
              type="url"
              placeholder="https://meet.google.com/abc-defg-hij"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-100 outline-none"
            />
          </div>
          {errors.classRoomLink && <p className="text-red-500 text-xs mt-1">{errors.classRoomLink.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status Awal</label>
          <div className="flex gap-4">
            {(['DRAFT', 'PUBLISH'] as AssignmentStatus[]).map((s) => (
              <label key={s} className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register('status')}
                  type="radio"
                  value={s}
                  className="w-4 h-4 text-primary-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-400">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

        <div className="pt-4 flex gap-3">
          <button type="submit" disabled={isSubmitting} className="py-3 px-8 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-200 dark:shadow-none flex-1">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div> : <Save size={20} />} 
            {initialData ? 'Perbarui Penugasan' : 'Konfirmasi Penugasan'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-3 px-8 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
