import { create } from 'zustand';
import type { User } from '../services/authService';
import { authService } from '../services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isChecking: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, 
  isAuthenticated: false,
  isChecking: true,
  
  setUser: (user) => set({ user, isAuthenticated: !!user, isChecking: false }),
  
  checkAuth: async () => {
    set({ isChecking: true });
    try {
      const response = await authService.getMe();
      if (response.success) {
        set({ user: response.data, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isChecking: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  }
}));
