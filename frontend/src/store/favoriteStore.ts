import { create } from 'zustand';
import { FavoriteOut, GroceryListResponse } from '../types';

interface FavoriteStoreState {
  favorites: FavoriteOut[];
  totalFavorites: number;
  favoritedIds: Set<string>;
  selectedForGrocery: Set<string>;
  groceryList: GroceryListResponse | null;
  showGroceryModal: boolean;
  
  setFavorites: (favs: FavoriteOut[], total: number) => void;
  addFavoriteLocally: (fav: FavoriteOut) => void;
  removeFavoriteLocally: (recipe_id: string) => void;
  setFavoritedIds: (ids: string[]) => void;
  addFavoritedId: (id: string) => void;
  removeFavoritedId: (id: string) => void;
  toggleGrocerySelection: (recipe_id: string) => void;
  clearGrocerySelection: () => void;
  setGroceryList: (list: GroceryListResponse | null) => void;
  setShowGroceryModal: (show: boolean) => void;
}

export const useFavoriteStore = create<FavoriteStoreState>((set) => ({
  favorites: [],
  totalFavorites: 0,
  favoritedIds: new Set(),
  selectedForGrocery: new Set(),
  groceryList: null,
  showGroceryModal: false,

  setFavorites: (favs, total) => set({ favorites: favs, totalFavorites: total }),
  
  addFavoriteLocally: (fav) => set((state) => ({
    favorites: [fav, ...state.favorites],
    totalFavorites: state.totalFavorites + 1
  })),

  removeFavoriteLocally: (recipe_id) => set((state) => ({
    favorites: state.favorites.filter((f) => f.recipe_id !== recipe_id),
    totalFavorites: Math.max(0, state.totalFavorites - 1)
  })),

  setFavoritedIds: (ids) => set({ favoritedIds: new Set(ids) }),

  addFavoritedId: (id) => set((state) => {
    const newIds = new Set(state.favoritedIds);
    newIds.add(id);
    return { favoritedIds: newIds };
  }),

  removeFavoritedId: (id) => set((state) => {
    const newIds = new Set(state.favoritedIds);
    newIds.delete(id);
    return { favoritedIds: newIds };
  }),

  toggleGrocerySelection: (recipe_id) => set((state) => {
    const newMap = new Set(state.selectedForGrocery);
    if (newMap.has(recipe_id)) {
      newMap.delete(recipe_id);
    } else {
      newMap.add(recipe_id);
    }
    return { selectedForGrocery: newMap };
  }),

  clearGrocerySelection: () => set({ selectedForGrocery: new Set() }),

  setGroceryList: (list) => set({ groceryList: list }),

  setShowGroceryModal: (show) => set({ showGroceryModal: show })
}));
