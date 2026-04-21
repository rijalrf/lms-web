import { api } from './apiClient';
import type { SingleResponse } from './topicsService';

export interface User {
  id: number;
  name: string;
  email: string;
  divisi: string;
  position: string;
  role: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  divisi: string;
  position: string;
  role: string;
}

export interface LoginResponse {
  code: number;
  success: boolean;
  message: string;
  data: User;
  token?: string;
  accessToken?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', payload);
    // Mencari kunci token baik di akar object maupun bersarang dari Backend Express/NestJS
    const token = response.data?.token || response.data?.data?.token || response.data?.accessToken;
    if (token) {
      localStorage.setItem('accessToken', token);
    }
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<SingleResponse<User>> => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    localStorage.removeItem('accessToken');
    const response = await api.delete('/auth/logout');
    return response.data;
  },

  getMe: async (): Promise<SingleResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
