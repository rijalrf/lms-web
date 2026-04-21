import { api } from './apiClient';
import type { SingleResponse, PaginatedResponse } from './topicsService';

export interface Material {
  id: number;
  title: string;
  description: string;
  topicId: number;
  fileUrl: string;
}

export interface MaterialPayload {
  title: string;
  description: string;
  topicId: number;
  fileUrl: string;
}

export const materialsService = {
  getMaterials: async (page = 1, limit = 10, topicId?: number): Promise<PaginatedResponse<Material>> => {
    const params = topicId ? { page, limit, topicId } : { page, limit };
    const response = await api.get('/materials', { params });
    return response.data;
  },

  getMaterialsByTopicId: async (topicId: number, page = 1, limit = 10): Promise<PaginatedResponse<Material>> => {
    const id = Number(topicId);
    if (isNaN(id)) {
      throw new Error("Validation failed (numeric string is expected)");
    }
    const response = await api.get(`/materials/topic/${id}`, { params: { page, limit } });
    return response.data;
  },

  createMaterial: async (payload: MaterialPayload): Promise<SingleResponse<Material>> => {
    const response = await api.post('/materials', payload);
    return response.data;
  },

  updateMaterial: async (id: number, payload: MaterialPayload): Promise<SingleResponse<Material>> => {
    const response = await api.put(`/materials/${id}`, payload);
    return response.data;
  },

  deleteMaterial: async (id: number): Promise<{ success: boolean; code: number; message: string }> => {
    const response = await api.delete(`/materials/${id}`);
    return response.data;
  },

  getPopularMaterials: async (): Promise<SingleResponse<Array<{ title: string; description: string; countAssignment: number }>>> => {
    const response = await api.get('/materials/material/populars');
    return response.data;
  }
};
