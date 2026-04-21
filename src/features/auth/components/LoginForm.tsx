import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";
import { authService } from "../../../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../../hooks/useAuthStore";
import axios from "axios";

// Skema validasi menggunakan Zod sesuai api.docs.md
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Too small: expected string to have >=8 characters" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setApiError(null);
    try {
      // Pemanggilan service otentikasi
      const response = await authService.login(data);
      // Simpan data user ke dalam Zustand Store
      setUser(response.data);
      // Sukses => redirect ke halaman dashboard/topics
      navigate("/topics");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setApiError(
          err.response?.data?.message ||
            "Login failed. Please check your credentials.",
        );
      } else {
        setApiError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700/60 p-8 sm:p-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          LMS Panel
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
          Masuk ke dalam panel manajemen untuk melanjutkan.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="admin@example.com"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500"
            } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all ring-1 ring-transparent focus:ring-1`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5 relative">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-slate-200 dark:border-slate-600 focus:border-primary-500 focus:ring-primary-500"
              } bg-slate-50 focus:bg-white dark:bg-slate-900/50 dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 outline-none transition-all ring-1 ring-transparent focus:ring-1`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.password.message}
            </p>
          )}
        </div>

        {/* General API Error Info */}
        {apiError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            <p>{apiError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 dark:disabled:bg-primary-800 text-white font-medium rounded-lg shadow-sm shadow-primary-600/30 transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <LogIn size={18} /> Masuk Sekarang
            </>
          )}
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 pt-2">
          Belum memiliki akun internal?{" "}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Registrasi Baru
          </Link>
        </p>
      </form>
    </div>
  );
};
