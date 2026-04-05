import React, { Suspense } from 'react';
import styles from './FavoritesPage.module.css';
import { useGetFavorites } from '../hooks/useFavoriteQueries';
import { useFavoriteStore } from '../store/favoriteStore';
import { useGenerateGrocery } from '../hooks/useGroceryMutation';
import FavoriteCard from '../components/favorites/FavoriteCard';
import GroceryList from '../components/grocery/GroceryList';
import { useNavigate } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  const { isLoading } = useGetFavorites(0, 50); // Get first 50 loosely
  const favorites = useFavoriteStore((state) => state.favorites);
  const totalFavorites = useFavoriteStore((state) => state.totalFavorites);
  const selectedForGrocery = useFavoriteStore((state) => state.selectedForGrocery);
  const clearGrocerySelection = useFavoriteStore((state) => state.clearGrocerySelection);
  const navigate = useNavigate();

  const { mutate: generateGrocery, isPending: isGeneratingGrocery } = useGenerateGrocery();

  const handleGenerateGrocery = () => {
    if (selectedForGrocery.size === 0) return;
    generateGrocery({ recipe_ids: Array.from(selectedForGrocery) });
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>❤️ My Favorites</h1>
            <p className={styles.subtitle}>Your personal collection of saved recipes</p>
          </div>
          <div className={styles.stats}>
            ❤️ {totalFavorites} saved recipes
          </div>
        </div>

        {favorites.length > 0 && (
          <div className={styles.actionBar}>
            <div className={styles.selectionInfo}>
              {selectedForGrocery.size} selected for grocery
              {selectedForGrocery.size > 0 && (
                <button onClick={clearGrocerySelection} className={styles.clearBtn}>Clear</button>
              )}
            </div>
            <button 
              className={styles.groceryBtn}
              disabled={selectedForGrocery.size === 0 || isGeneratingGrocery}
              onClick={handleGenerateGrocery}
            >
              {isGeneratingGrocery ? 'Generating...' : '🛒 Generate Grocery List'}
            </button>
          </div>
        )}

        {isLoading && favorites.length === 0 ? (
          <div className={styles.loading}>Loading favorites...</div>
        ) : favorites.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>❤️</div>
            <h2>No favorites yet</h2>
            <p>Generate recipes and save the ones you love!</p>
            <button className={styles.cta} onClick={() => navigate('/recipes')}>✨ Generate a Recipe</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {favorites.map((fav) => (
              <FavoriteCard key={fav.id} favorite={fav} />
            ))}
          </div>
        )}
      </div>

      <GroceryList />
    </div>
  );
};

export default FavoritesPage;
