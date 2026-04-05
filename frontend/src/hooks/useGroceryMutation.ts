import { useMutation } from '@tanstack/react-query';
import { groceryApi } from '../api/groceryApi';
import { useFavoriteStore } from '../store/favoriteStore';
import { GroceryListResponse, GroceryRequest } from '../types';

export const useGenerateGrocery = () => {
  const setGroceryList = useFavoriteStore((state) => state.setGroceryList);
  const setShowGroceryModal = useFavoriteStore((state) => state.setShowGroceryModal);

  return useMutation<GroceryListResponse, Error, GroceryRequest>({
    mutationFn: (data: GroceryRequest) => groceryApi.generateGroceryList(data),
    onSuccess: (data) => {
      setGroceryList(data);
      setShowGroceryModal(true);
    },
    onError: (error) => {
      console.error('Failed to generate grocery list:', error);
    }
  });
};
