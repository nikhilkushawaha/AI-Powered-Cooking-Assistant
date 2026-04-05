import { useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteApi } from '../api/favoriteApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { FavoriteStatusResponse } from '../types';

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  const addFavoritedId = useFavoriteStore((state) => state.addFavoritedId);

  return useMutation<FavoriteStatusResponse, Error, string>({
    mutationFn: (recipe_id: string) => favoriteApi.addFavorite(recipe_id),
    onSuccess: (data, recipe_id) => {
      addFavoritedId(recipe_id);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Failed to add favorite:', error);
    }
  });
};

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  const removeFavoritedId = useFavoriteStore((state) => state.removeFavoritedId);
  const removeFavoriteLocally = useFavoriteStore((state) => state.removeFavoriteLocally);

  return useMutation<FavoriteStatusResponse, Error, string>({
    mutationFn: (recipe_id: string) => favoriteApi.removeFavorite(recipe_id),
    onSuccess: (data, recipe_id) => {
      removeFavoritedId(recipe_id);
      removeFavoriteLocally(recipe_id);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Failed to remove favorite:', error);
    }
  });
};
