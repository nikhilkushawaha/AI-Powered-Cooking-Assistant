import { useQuery } from '@tanstack/react-query';
import recipeApi from '../api/recipeApi';
import { useRecipeStore } from '../store/recipeStore';

/** Query: get paginated list of user's saved recipes */
export function useMyRecipes(skip: number, limit: number) {
  const { setMyRecipes } = useRecipeStore();

  return useQuery({
    queryKey: ['my-recipes', skip, limit],
    queryFn: async () => {
      const data = await recipeApi.getMyRecipes(skip, limit);
      setMyRecipes(data.recipes, data.total);
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

/** Query: extract ingredients for a given dish name (lazy — enabled prop controls it) */
export function useExtractIngredients(dish_name: string, enabled: boolean) {
  return useQuery({
    queryKey: ['extract-ingredients', dish_name],
    queryFn: () => recipeApi.extractIngredients(dish_name),
    enabled: enabled && dish_name.trim().length > 2,
    staleTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
  });
}
