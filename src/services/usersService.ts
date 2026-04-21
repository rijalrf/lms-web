import { api } from './apiClient';
import type { PaginatedResponse } from './topicsService';
import type { User } from './authService';

export const usersService = {
  getUsers: async (page = 1, limit = 10): Promise<PaginatedResponse<User>> => {
    const response = await api.get('/users', { params: { page, limit } });
    return response.data;
  },
  
  // Fitur delete user bisa dtambahkan dsb
  deleteUser: async (id: number): Promise<{ success: boolean; code: number; message: string }> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }
};
