import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Save, AlertCircle } from 'lucide-react';
import type { TopicPayload, Topic } from '../../../services/topicsService';
import { topicService } from '../../../services/topicsService';
import axios from 'axios';

const topicSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(5, { message: "Description minimal 5 karakter" })
});

interface TopicFormProps {
  initialData?: Topic | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TopicForm: React.FC<TopicFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TopicPayload>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: '', description: '' }
  });

  // Jika initialData berubah (saat edit), reset form dengan data tersebut
  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title,
        description: initialData.description
      });
    } else {
      reset({ title: '', description: '' });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: TopicPayload) => {
    setApiError(null);
    try {
      if (initialData) {
        await topicService.updateTopic(initialData.id, data);
      } else {
        await topicService.createTopic(data);
      }
      if (onSuccess) onSuccess(); // Signal ke Parent
      reset(); // Reset form state
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message || `Gagal ${initialData ? 'memperbarui' : 'membuat'} topik.`);
      } else {
        setApiError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-b-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Judul Topik <span className="text-red-500">*</span></label>
            <input
              {...register('title')}
              type="text"
              placeholder="Contoh: Pengenalan Clean Architecture"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Deskripsi Topik</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Jelaskan secara singkat mengenai bahasan topik ini..."
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500'
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.description.message}
              </p>
            )}
          </div>

        </div>

        {apiError && (
          <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="py-2.5 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-primary-800 text-white font-medium rounded-lg transition-all flex items-center gap-2 shadow-sm flex-1 justify-center"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : <Save size={18} />}
            {initialData ? 'Perbarui Topik' : 'Simpan Topik'}
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
