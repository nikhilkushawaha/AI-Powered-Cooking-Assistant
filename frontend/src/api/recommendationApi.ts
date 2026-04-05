import { RecommendationResponse } from '../types';
import axiosInstance from './axios';

export const recommendationApi = {
  getRecommendations: async (limit: number = 5): Promise<RecommendationResponse> => {
    const response = await axiosInstance.get(`/api/recommendations?limit=${limit}`);
    return response.data;
  }
};
