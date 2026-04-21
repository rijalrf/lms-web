import { api } from './apiClient';

export interface Pagination {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T[];
  pagination: Pagination;
}

export interface SingleResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
}

export interface TopicPayload {
  title: string;
  description: string;
}

export const topicService = {
  // Ambil daftar topik (Tabel ListView)
  getTopics: async (page = 1, limit = 10): Promise<PaginatedResponse<Topic>> => {
    const response = await api.get('/topics', { params: { page, limit } });
    return response.data;
  },

  // Ambil detail topik
  getTopicById: async (id: number): Promise<SingleResponse<Topic>> => {
    const response = await api.get(`/topics/${id}`);
    return response.data;
  },

  // Buat topik baru
  createTopic: async (payload: TopicPayload): Promise<SingleResponse<Topic>> => {
    const response = await api.post('/topics', payload);
    return response.data;
  },

  // Update topik
  updateTopic: async (id: number, payload: TopicPayload): Promise<SingleResponse<Topic>> => {
    const response = await api.put(`/topics/${id}`, payload);
    return response.data;
  },

  // Hapus topik
  deleteTopic: async (id: number): Promise<{ success: boolean; code: number; message: string }> => {
    const response = await api.delete(`/topics/${id}`);
    return response.data;
  },

  getPopularTopics: async (): Promise<SingleResponse<Array<{ title: string; description: string; countAssignment: number }>>> => {
    const response = await api.get('/topics/topic/populars');
    return response.data;
  }
};
