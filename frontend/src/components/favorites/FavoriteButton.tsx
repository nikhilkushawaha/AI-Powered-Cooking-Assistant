import React, { memo } from 'react';
import styles from './FavoriteButton.module.css';
import { useFavoriteStore } from '../../store/favoriteStore';
import { useAddFavorite, useRemoveFavorite } from '../../hooks/useFavoriteMutations';

interface FavoriteButtonProps {
  recipe_id: string;
  size?: 'sm' | 'md';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ recipe_id, size = 'md' }) => {
  const favoritedIds = useFavoriteStore((state) => state.favoritedIds);
  const isFavorited = favoritedIds.has(recipe_id);
  
  const { mutate: addFavorite, isPending: isAdding } = useAddFavorite();
  const { mutate: removeFavorite, isPending: isRemoving } = useRemoveFavorite();

  const isPending = isAdding || isRemoving;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPending) return;

    if (isFavorited) {
      removeFavorite(recipe_id);
    } else {
      addFavorite(recipe_id);
    }
  };

  return (
    <button
      className={`
        ${styles.btn} 
        ${styles[size]} 
        ${isFavorited ? styles.favorited : ''} 
        ${isAdding ? styles.animating : ''}
        ${isPending ? styles.pending : ''}
      `}
      onClick={handleClick}
      disabled={isPending}
      title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      {isPending ? (
        <span className={styles.spinner}>...</span>
      ) : (
        isFavorited ? '❤️' : '🤍'
      )}
    </button>
  );
};

export default memo(FavoriteButton);
