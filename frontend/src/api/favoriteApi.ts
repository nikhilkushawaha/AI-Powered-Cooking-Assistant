import { FavoriteListResponse, FavoriteStatusResponse } from '../types';
import axiosInstance from './axios';

export const favoriteApi = {
  addFavorite: async (recipe_id: string): Promise<FavoriteStatusResponse> => {
    const response = await axiosInstance.post(`/api/favorites/${recipe_id}`);
    return response.data;
  },

  removeFavorite: async (recipe_id: string): Promise<FavoriteStatusResponse> => {
    const response = await axiosInstance.delete(`/api/favorites/${recipe_id}`);
    return response.data;
  },

  getFavorites: async (skip: number = 0, limit: number = 12): Promise<FavoriteListResponse> => {
    const response = await axiosInstance.get(`/api/favorites?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  checkFavorite: async (recipe_id: string): Promise<{ is_favorited: boolean }> => {
    const response = await axiosInstance.get(`/api/favorites/check/${recipe_id}`);
    return response.data;
  }
};
