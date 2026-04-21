import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UserPlus, AlertCircle } from 'lucide-react';
import { authService, type RegisterPayload } from '../../../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama minimal 3 karakter" }),
  email: z.string().email({ message: "Alamat email tidak valid" }),
  password: z.string().min(8, { message: "Kata sandi minimal 8 karakter" }),
  divisi: z.string().min(2, { message: "Divisi wajib diisi" }),
  position: z.string().min(2, { message: "Posisi wajib diisi" }),
  role: z.enum(['ADMIN', 'TRAINER'])
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', divisi: '', position: '', role: 'TRAINER' }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    setApiSuccess(false);
    try {
      await authService.register(data as RegisterPayload);
      setApiSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(err.response?.data?.message || 'Registrasi gagal. Cek kembali data Anda atau pastikan email belum terdaftar (jika ada DB).');
      } else {
        setApiError('Terjadi kesalahan yang tidak terduga.');
      }
    }
  };

  return (
    <div className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/60 p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registrasi LMS</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Daftarkan akun karyawan atau trainer baru.</p>
      </div>

      {apiSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm rounded-lg border border-emerald-100 dark:border-emerald-800 flex items-center justify-center">
          Pendaftaran berhasil! Mengalihkan ke halaman login...
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nama Lengkap</label>
          <input
            {...register('name')}
            type="text"
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Utama</label>
            <input
              {...register('email')}
              type="email"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Kata Sandi</label>
            <input
              {...register('password')}
              type="password"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.password.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Divisi Asal</label>
            <input
              {...register('divisi')}
              type="text"
              placeholder="Misal: Akademik"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.divisi ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.divisi && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.divisi.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Posisi/Jabatan</label>
            <input
              {...register('position')}
              type="text"
              placeholder="Misal: Dosen"
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.position ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all`}
            />
            {errors.position && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.position.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5 pb-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Peranan (Role)</label>
          <select
            {...register('role')}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.role ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-600 focus:border-primary-500'} bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all appearance-none cursor-pointer`}
          >
            <option value="TRAINER">Trainer / Pengajar</option>
            <option value="ADMIN">Administrator</option>
          </select>
          {errors.role && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.role.message}</p>}
        </div>

        {apiError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || apiSuccess}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-primary-800 text-white font-medium rounded-lg shadow-sm shadow-primary-600/30 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <UserPlus size={18} /> Daftarkan Akun
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 pt-2">
          Sudah memiliki akun instansi?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Masuk ke Panel
          </Link>
        </p>

      </form>
    </div>
  );
};
