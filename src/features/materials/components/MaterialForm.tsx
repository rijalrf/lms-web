import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, AlertCircle } from 'lucide-react';
import { materialsService, type Material } from '../../../services/materialsService';
import { topicService } from '../../../services/topicsService';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const materialSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(5, { message: "Description minimal 5 karakter" }),
  topicId: z.number().min(1, { message: "Pilih topik penginduk" }),
  fileUrl: z.string().url({ message: "Harus berupa URL yang valid" })
});

type MaterialFormData = z.infer<typeof materialSchema>;

interface MaterialFormProps {
  initialData?: Material | null;
  defaultTopicId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const MaterialForm: React.FC<MaterialFormProps> = ({ initialData, defaultTopicId, onSuccess, onCancel }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  // Only fetch topics if we don't have a pre-selected topic
  const shouldShowTopicSelect = !defaultTopicId && !initialData;

  const { data: topicsData, isLoading: isLoadingTopics } = useQuery({
    queryKey: ['topicsOptions'],
    queryFn: () => topicService.getTopics(1, 100),
    enabled: shouldShowTopicSelect,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: { title: '', description: '', fileUrl: '', topicId: defaultTopicId || 0 }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description,
        topicId: initialData.topicId,
        fileUrl: initialData.fileUrl
      });
    } else {
      reset({ title: '', description: '', fileUrl: '', topicId: defaultTopicId || 0 });
    }
  }, [initialData, defaultTopicId, reset]);

  const onSubmit = async (data: MaterialFormData) => {
    setApiError(null);
    try {
      if (initialData) {
        await materialsService.updateMaterial(initialData.id, data);
      } else {
        await materialsService.createMaterial(data);
      }
      if (onSuccess) onSuccess();
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message || `Gagal ${initialData ? 'memperbarui' : 'menyimpan'} materi.`);
      } else {
        setApiError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-b-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Judul Bab Materi <span className="text-red-500">*</span></label>
            <input
              {...register('title')}
              type="text"
              placeholder="Contoh: Modul 1: React Context"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1"><AlertCircle size={12} className="inline mr-1" />{errors.title.message}</p>}
          </div>

          {shouldShowTopicSelect ? (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Topik Penginduk <span className="text-red-500">*</span></label>
              <select
                {...register('topicId', { valueAsNumber: true })}
                disabled={isLoadingTopics}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.topicId ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
                } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all appearance-none cursor-pointer`}
              >
                <option value="0" disabled>-- Pilih Topik Induk --</option>
                {topicsData?.data.map((t) => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
              {errors.topicId && <p className="text-red-500 text-xs mt-1"><AlertCircle size={12} className="inline mr-1" />{errors.topicId.message}</p>}
            </div>
          ) : (
            <input type="hidden" {...register('topicId', { valueAsNumber: true })} />
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">URL File Tambahan</label>
            <input
              {...register('fileUrl')}
              type="url"
              placeholder="https://example.com/file.pdf"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.fileUrl ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.fileUrl && <p className="text-red-500 text-xs mt-1"><AlertCircle size={12} className="inline mr-1" />{errors.fileUrl.message}</p>}
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Singkat</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Deskripsi..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
          </div>
        </div>

        {apiError && <p className="text-red-500 text-sm mt-3">{apiError}</p>}

        <div className="pt-4 flex gap-3">
          <button type="submit" disabled={isSubmitting} className="py-2.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm flex-1">
            {isSubmitting ? <span className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full inline-block"></span> : <Save size={18} />} 
            {initialData ? 'Perbarui Materi' : 'Simpan Materi'}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="py-2.5 px-6 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
