import api from './axios';
import type {
  ExtractIngredientsResponse,
  GenerateRecipeRequest,
  Recipe,
  RecipeListOut,
} from '../types';

const recipeApi = {
  /** POST /api/recipes/generate */
  generateRecipe: async (data: GenerateRecipeRequest): Promise<Recipe> => {
    const response = await api.post<Recipe>('/api/recipes/generate', data);
    return response.data;
  },

  /** GET /api/recipes/extract-ingredients?dish_name=... */
  extractIngredients: async (dish_name: string): Promise<ExtractIngredientsResponse> => {
    const response = await api.get<ExtractIngredientsResponse>(
      '/api/recipes/extract-ingredients',
      { params: { dish_name } }
    );
    return response.data;
  },

  /** GET /api/recipes/my-recipes?skip=...&limit=... */
  getMyRecipes: async (skip: number, limit: number): Promise<RecipeListOut> => {
    const response = await api.get<RecipeListOut>('/api/recipes/my-recipes', {
      params: { skip, limit },
    });
    return response.data;
  },

  /** GET /api/recipes/:id */
  getRecipeById: async (id: string): Promise<Recipe> => {
    const response = await api.get<Recipe>(`/api/recipes/${id}`);
    return response.data;
  },

  /** DELETE /api/recipes/:id */
  deleteRecipe: async (id: string): Promise<void> => {
    await api.delete(`/api/recipes/${id}`);
  },
};

export default recipeApi;
