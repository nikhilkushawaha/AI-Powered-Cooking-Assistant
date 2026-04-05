import { useQuery } from '@tanstack/react-query';
import { favoriteApi } from '../api/favoriteApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { FavoriteListResponse } from '../types';

export const useGetFavorites = (skip: number = 0, limit: number = 12) => {
  const setFavorites = useFavoriteStore((state) => state.setFavorites);

  return useQuery<FavoriteListResponse, Error>({
    queryKey: ['favorites', skip, limit],
    queryFn: async () => {
      const data = await favoriteApi.getFavorites(skip, limit);
      setFavorites(data.favorites, data.total);
      return data;
    },
    staleTime: 2 * 60 * 1000
  });
};

export const useCheckFavorite = (recipe_id: string | undefined) => {
  const addFavoritedId = useFavoriteStore((state) => state.addFavoritedId);
  const removeFavoritedId = useFavoriteStore((state) => state.removeFavoritedId);

  return useQuery<{ is_favorited: boolean }, Error>({
    queryKey: ['favorite-check', recipe_id],
    queryFn: async () => {
      if (!recipe_id) throw new Error("No recipe ID");
      const data = await favoriteApi.checkFavorite(recipe_id);
      if (data.is_favorited) {
        addFavoritedId(recipe_id);
      } else {
        removeFavoritedId(recipe_id);
      }
      return data;
    },
    enabled: !!recipe_id,
    staleTime: 30 * 1000
  });
};
