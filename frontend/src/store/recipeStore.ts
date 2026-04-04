import { create } from 'zustand';
import type { ExtractIngredientsResponse, Recipe } from '../types';

type ActiveTab = 'generator' | 'extractor' | 'my-recipes';

interface RecipeState {
  generatedRecipe: Recipe | null;
  extractedIngredients: ExtractIngredientsResponse | null;
  myRecipes: Recipe[];
  totalRecipes: number;
  selectedRecipe: Recipe | null;
  activeTab: ActiveTab;

  // Actions
  setGeneratedRecipe: (recipe: Recipe | null) => void;
  setExtractedIngredients: (data: ExtractIngredientsResponse | null) => void;
  setMyRecipes: (recipes: Recipe[], total: number) => void;
  appendRecipe: (recipe: Recipe) => void;
  removeRecipe: (id: string) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  generatedRecipe: null,
  extractedIngredients: null,
  myRecipes: [],
  totalRecipes: 0,
  selectedRecipe: null,
  activeTab: 'generator',

  setGeneratedRecipe: (recipe) => set({ generatedRecipe: recipe }),

  setExtractedIngredients: (data) => set({ extractedIngredients: data }),

  setMyRecipes: (recipes, total) => set({ myRecipes: recipes, totalRecipes: total }),

  appendRecipe: (recipe) =>
    set((state) => ({
      myRecipes: [recipe, ...state.myRecipes],
      totalRecipes: state.totalRecipes + 1,
    })),

  removeRecipe: (id) =>
    set((state) => ({
      myRecipes: state.myRecipes.filter((r) => r.id !== id),
      totalRecipes: Math.max(0, state.totalRecipes - 1),
    })),

  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),

  setActiveTab: (tab) => set({ activeTab: tab }),
}));
