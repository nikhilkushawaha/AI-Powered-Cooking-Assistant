import { useMutation, useQueryClient } from '@tanstack/react-query';
import recipeApi from '../api/recipeApi';
import { useRecipeStore } from '../store/recipeStore';
import type { GenerateRecipeRequest } from '../types';

/** Mutation: generate a recipe from ingredients */
export function useGenerateRecipe() {
  const queryClient = useQueryClient();
  const { setGeneratedRecipe, appendRecipe } = useRecipeStore();

  return useMutation({
    mutationFn: (data: GenerateRecipeRequest) => recipeApi.generateRecipe(data),
    retry: 1,
    retryDelay: 2000,
    onSuccess: (recipe) => {
      setGeneratedRecipe(recipe);
      appendRecipe(recipe);
      // Invalidate my-recipes queries so the list refreshes
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    },
  });
}

/** Mutation: delete a recipe by ID */
export function useDeleteRecipe() {
  const queryClient = useQueryClient();
  const { removeRecipe } = useRecipeStore();

  return useMutation({
    mutationFn: (id: string) => recipeApi.deleteRecipe(id),
    retry: 0,
    onSuccess: (_data, id) => {
      removeRecipe(id);
      queryClient.invalidateQueries({ queryKey: ['my-recipes'] });
    },
  });
}
