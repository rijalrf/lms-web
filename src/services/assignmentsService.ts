import { api } from './apiClient';
import type { PaginatedResponse, SingleResponse, Topic } from './topicsService';
import type { Material } from './materialsService';

export type AssignmentStatus = 'DRAFT' | 'PUBLISH' | 'CANCEL' | 'COMPLETED';

export interface Trainer {
  id: number;
  name: string;
  email: string;
}

export interface Assignment {
  id: number;
  trainingDate: string;
  startTime: string;
  endTime: string;
  maxParticipant: number;
  classRoomLink: string;
  status: AssignmentStatus;
  trainer: Trainer;
  topic: Topic;
  material: Material;
}

export interface AssignmentPayload {
  topicId: number;
  materialId: number;
  userId: number; // Trainer ID
  trainingDate: string;
  startTime: string;
  endTime: string;
  maxParticipant: number;
  classRoomLink: string;
  status: AssignmentStatus;
}

export const assignmentsService = {
  getAssignments: async (page = 1, limit = 10, status?: string): Promise<PaginatedResponse<Assignment>> => {
    const params = status ? { page, limit, status } : { page, limit };
    const response = await api.get('/assignments', { params });
    return response.data;
  },

  getAssignmentById: async (id: number): Promise<SingleResponse<Assignment>> => {
    const response = await api.get(`/assignments/${id}`);
    return response.data;
  },

  createAssignment: async (payload: AssignmentPayload): Promise<SingleResponse<Assignment>> => {
    const response = await api.post('/assignments', payload);
    return response.data;
  },

  updateAssignment: async (id: number, payload: AssignmentPayload): Promise<SingleResponse<Assignment>> => {
    const response = await api.put(`/assignments/${id}`, payload);
    return response.data;
  },

  updateAssignmentStatus: async (id: number, status: AssignmentStatus): Promise<SingleResponse<Assignment>> => {
    const response = await api.patch(`/assignments/${id}/status`, { status });
    return response.data;
  },

  deleteAssignment: async (id: number): Promise<{ success: boolean; code: number; message: string }> => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },

  getAssignmentsCountByStatus: async (status?: string): Promise<SingleResponse<{ status: string; count: number }>> => {
    const params = status ? { status } : {};
    const response = await api.get('/assignments/count/status', { params });
    return response.data;
  },

  getPopularTrainers: async (): Promise<SingleResponse<Array<{ trainer: Trainer; countAssignment: number }>>> => {
    const response = await api.get('/assignments/trainer/populars');
    return response.data;
  }
};
