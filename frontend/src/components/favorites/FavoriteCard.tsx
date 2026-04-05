import React, { memo } from 'react';
import styles from './FavoriteCard.module.css';
import { FavoriteOut } from '../../types';
import { useFavoriteStore } from '../../store/favoriteStore';
import FavoriteButton from './FavoriteButton';

interface FavoriteCardProps {
  favorite: FavoriteOut;
  onClick?: () => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ favorite, onClick }) => {
  const { recipe } = favorite;
  const toggleGrocerySelection = useFavoriteStore((state) => state.toggleGrocerySelection);
  const selectedForGrocery = useFavoriteStore((state) => state.selectedForGrocery);
  
  const isSelected = selectedForGrocery.has(recipe.id);

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleGrocerySelection(recipe.id);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${recipe.name}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i.quantity} ${i.name}`).join('\n')}\n\nInstructions:\n${recipe.instructions.join('\n')}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div 
          className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}
          onClick={handleCheckboxClick}
          title="Select for Grocery List"
        >
          {isSelected && '✓'}
        </div>
        <div className={styles['fav-btn-wrap']}>
          <FavoriteButton recipe_id={recipe.id} size="sm" />
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>🍽️ {recipe.name}</h3>
        
        <div className={styles.badges}>
          {recipe.cuisine_type && <span className={styles.badge}>{recipe.cuisine_type}</span>}
          {recipe.difficulty && <span className={styles.badge}>{recipe.difficulty}</span>}
          {recipe.is_vegetarian && <span className={`${styles.badge} ${styles.veg}`}>Vegetarian</span>}
        </div>

        {recipe.description && (
          <p className={styles.description}>{recipe.description}</p>
        )}

        <div className={styles.stats}>
          {recipe.cooking_time && <span>⏱ {recipe.cooking_time}m</span>}
          {recipe.calories && <span>🔥 {recipe.calories} cal</span>}
        </div>

        <div className={styles.ingredients}>
          <h4>📝 Ingredients</h4>
          <ul className={styles['ingredient-list']}>
            {recipe.ingredients.slice(0, 3).map((ing, idx) => (
              <li key={idx}>• {ing.name}</li>
            ))}
          </ul>
          {recipe.ingredients.length > 3 && (
            <div className={styles['more-ingredients']}>
              + {recipe.ingredients.length - 3} more...
            </div>
          )}
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles['action-btn']} onClick={handleCopy}>
          📋 Copy Full Recipe
        </button>
      </div>
    </div>
  );
};

export default memo(FavoriteCard);
