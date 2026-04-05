import { create } from 'zustand';
import type { AskDocumentResponse, DocumentOut } from '../types';

interface RagState {
  documents: DocumentOut[];
  totalDocuments: number;
  selectedDocumentId: string | null;
  lastAnswer: AskDocumentResponse | null;
  uploadProgress: number;
  activeTab: 'upload' | 'ask' | 'documents';
  setDocuments: (docs: DocumentOut[], total: number) => void;
  addDocument: (doc: DocumentOut) => void;
  removeDocument: (id: string) => void;
  setSelectedDocumentId: (id: string | null) => void;
  setLastAnswer: (answer: AskDocumentResponse | null) => void;
  setUploadProgress: (progress: number) => void;
  setActiveTab: (tab: 'upload' | 'ask' | 'documents') => void;
}

export const useRagStore = create<RagState>((set) => ({
  documents: [],
  totalDocuments: 0,
  selectedDocumentId: null,
  lastAnswer: null,
  uploadProgress: 0,
  activeTab: 'upload',
  setDocuments: (docs, total) => set({ documents: docs, totalDocuments: total }),
  addDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
      totalDocuments: state.totalDocuments + 1,
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
      totalDocuments: state.totalDocuments - 1,
      selectedDocumentId: state.selectedDocumentId === id ? null : state.selectedDocumentId,
    })),
  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),
  setLastAnswer: (answer) => set({ lastAnswer: answer }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
