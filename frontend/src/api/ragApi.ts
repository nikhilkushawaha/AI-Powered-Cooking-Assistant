import api from './axios';
import type {
  AskDocumentRequest,
  AskDocumentResponse,
  DocumentListResponse,
  UploadDocumentResponse,
} from '../types';

const ragApi = {
  uploadDocument: async (
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<UploadDocumentResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<UploadDocumentResponse>('/api/rag/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress?.(pct);
        }
      },
    });
    return response.data;
  },

  askDocument: async (data: AskDocumentRequest): Promise<AskDocumentResponse> => {
    const response = await api.post<AskDocumentResponse>('/api/rag/ask', data);
    return response.data;
  },

  getDocuments: async (): Promise<DocumentListResponse> => {
    const response = await api.get<DocumentListResponse>('/api/rag/documents');
    return response.data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/api/rag/documents/${id}`);
  },
};

export default ragApi;
