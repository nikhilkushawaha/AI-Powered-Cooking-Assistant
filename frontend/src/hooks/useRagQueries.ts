import { useQuery } from '@tanstack/react-query';
import ragApi from '../api/ragApi';
import { useRagStore } from '../store/ragStore';

export const useGetDocuments = () => {
  const { setDocuments } = useRagStore();

  return useQuery({
    queryKey: ['rag-documents'],
    queryFn: () => ragApi.getDocuments(),
    staleTime: 60 * 1000,
  });
};
