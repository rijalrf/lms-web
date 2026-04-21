import axios from "axios";

/**
 * Konfigurasi HTTP Client global (Axios Instance).
 */
export const api = axios.create({
  // Pastikan VITE_API_BASE_URL mengarah ke http://lms-api.web.local/api/v1
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  // WAJIB: Agar browser mengirimkan cookie ke BE dan menerima cookie dari BE
  withCredentials: true,
});

/**
 * Request Interceptor
 * Kita tetap biarkan ini, tapi fokus hanya pada headers umum.
 * Bagian localStorage dihapus karena kita pakai strategi Cookie.
 */
api.interceptors.request.use(
  (config) => {
    // Jika nanti ada header tambahan selain auth, bisa ditaruh di sini
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => {
    // Simulasi delay visual (opsional, bisa dihapus jika sudah produksi)
    return new Promise((resolve) => {
      setTimeout(() => resolve(response), 800);
    });
  },
  (error) => {
    // Global Error Handling
    if (error.response) {
      // Jika 401 (Unauthorized), biasanya cookie sudah hangus atau tidak ada
      if (error.response.status === 401) {
        console.warn(
          "Sesi habis atau tidak berwenang. Mengalihkan ke login...",
        );
        // Mas bisa tambahkan logika redirect ke login di sini jika di browser
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
