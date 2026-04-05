import { useMutation, useQueryClient } from '@tanstack/react-query';
import ragApi from '../api/ragApi';
import { useRagStore } from '../store/ragStore';
import type { AskDocumentRequest } from '../types';

export const useUploadDocument = () => {
  const { addDocument, setUploadProgress, setActiveTab } = useRagStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file }: { file: File }) =>
      ragApi.uploadDocument(file, (pct) => setUploadProgress(pct)),
    onSuccess: (data) => {
      addDocument(data);
      setUploadProgress(100);
      queryClient.invalidateQueries({ queryKey: ['rag-documents'] });
      setTimeout(() => setActiveTab('ask'), 1500);
    },
    onError: () => {
      setUploadProgress(0);
    },
  });
};

export const useAskDocument = () => {
  const { setLastAnswer } = useRagStore();

  return useMutation({
    mutationFn: (data: AskDocumentRequest) => ragApi.askDocument(data),
    onSuccess: (data) => {
      setLastAnswer(data);
    },
  });
};

export const useDeleteDocument = () => {
  const { removeDocument } = useRagStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ragApi.deleteDocument(id),
    onSuccess: (_, id) => {
      removeDocument(id);
      queryClient.invalidateQueries({ queryKey: ['rag-documents'] });
    },
  });
};
