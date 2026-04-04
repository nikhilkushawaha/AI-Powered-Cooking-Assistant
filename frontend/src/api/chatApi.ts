import api from './axios';
import { ChatRequest, ChatResponse, HistoryMessage } from '../types';

export const chatApi = {
  sendMessage: async (data: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post<ChatResponse>('/api/chat', data);
    return response.data;
  },

  getHistory: async (session_id: string): Promise<{ session_id: string; history: HistoryMessage[] }> => {
    const response = await api.get(`/api/chat/history/${session_id}`);
    return response.data;
  },

  clearSession: async (session_id: string): Promise<void> => {
    await api.delete(`/api/chat/session/${session_id}`);
  },
};
