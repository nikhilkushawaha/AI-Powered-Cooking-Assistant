import { useQuery } from '@tanstack/react-query';
import { recommendationApi } from '../api/recommendationApi';
import { RecommendationResponse } from '../types';

export const useGetRecommendations = (limit: number = 5) => {
  return useQuery<RecommendationResponse, Error>({
    queryKey: ['recommendations', limit],
    queryFn: () => recommendationApi.getRecommendations(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1
  });
};
