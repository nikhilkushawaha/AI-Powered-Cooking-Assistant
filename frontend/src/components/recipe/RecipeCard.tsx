import React, { memo, useCallback, useState } from 'react';
import type { Recipe } from '../../types';
import { useDeleteRecipe } from '../../hooks/useRecipeMutations';
import FavoriteButton from '../favorites/FavoriteButton';
import styles from './RecipeCard.module.css';

interface RecipeCardProps {
  recipe: Recipe;
  showActions?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = memo(({ recipe, showActions = false }) => {
  const [showAllIngredients, setShowAllIngredients] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { mutate: deleteRecipe, isPending: isDeleting } = useDeleteRecipe();

  const visibleIngredients = showAllIngredients
    ? recipe.ingredients
    : recipe.ingredients.slice(0, 4);

  const handleCopy = useCallback(() => {
    const ingredientLines = recipe.ingredients
      .map((i) => `  • ${i.name} — ${i.quantity}`)
      .join('\n');
    const instructionLines = recipe.instructions
      .map((step, idx) => `  ${idx + 1}. ${step}`)
      .join('\n');

    const text = [
      `🍽️ ${recipe.name}`,
      recipe.description ? `\n${recipe.description}` : '',
      `\n⏱ ${recipe.cooking_time ?? '?'} mins  |  📊 ${recipe.difficulty ?? 'N/A'}  |  🔥 ${recipe.calories ?? '?'} cal`,
      `\n📝 Ingredients:\n${ingredientLines}`,
      `\n👨‍🍳 Instructions:\n${instructionLines}`,
      recipe.cuisine_type ? `\n🌍 Cuisine: ${recipe.cuisine_type}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [recipe]);

  const handleDelete = useCallback(() => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    deleteRecipe(recipe.id);
  }, [confirmDelete, deleteRecipe, recipe.id]);

  const difficultyClass =
    recipe.difficulty === 'easy'
      ? styles.badgeEasy
      : recipe.difficulty === 'medium'
      ? styles.badgeMedium
      : recipe.difficulty === 'hard'
      ? styles.badgeHard
      : styles.badge;

  return (
    <article className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>
          <span className={styles.titleIcon}>🍽️</span>
          {recipe.name}
        </h3>
        <div style={{ display: 'flex', gap: '8px', zIndex: 10 }}>
          <FavoriteButton recipe_id={recipe.id} size="sm" />
        </div>
      </div>

      <div className={styles.badges}>
        {recipe.cuisine_type && (
          <span className={`${styles.badge} ${styles.badgeCuisine}`}>
            🌍 {recipe.cuisine_type}
          </span>
        )}
        {recipe.difficulty && (
          <span className={`${styles.badge} ${difficultyClass}`}>
            {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}
          </span>
        )}
        <span className={`${styles.badge} ${recipe.is_vegetarian ? styles.badgeVeg : styles.badgeNonVeg}`}>
          {recipe.is_vegetarian ? '🌱 Veg' : '🍗 Non-Veg'}
        </span>
      </div>

      {/* Description */}
      {recipe.description && (
        <p className={styles.description}>{recipe.description}</p>
      )}

      {/* Stats */}
      <div className={styles.stats}>
        {recipe.cooking_time != null && (
          <div className={styles.stat}>
            <span>⏱</span>
            <span>{recipe.cooking_time} mins</span>
          </div>
        )}
        {recipe.difficulty && (
          <div className={styles.stat}>
            <span>📊</span>
            <span style={{ textTransform: 'capitalize' }}>{recipe.difficulty}</span>
          </div>
        )}
        {recipe.calories != null && (
          <div className={styles.stat}>
            <span>🔥</span>
            <span>{recipe.calories} cal</span>
          </div>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTitle}>📝 Ingredients ({recipe.ingredients.length})</span>
        </div>
        <ul className={styles.ingredientList}>
          {visibleIngredients.map((ing, idx) => (
            <li key={idx} className={styles.ingredientItem}>
              <span className={styles.ingredientName}>{ing.name}</span>
              <span className={styles.ingredientQty}>{ing.quantity}</span>
            </li>
          ))}
        </ul>
        {recipe.ingredients.length > 4 && (
          <button
            className={styles.showMoreBtn}
            onClick={() => setShowAllIngredients((v) => !v)}
          >
            {showAllIngredients
              ? '▲ Show less'
              : `▼ Show ${recipe.ingredients.length - 4} more`}
          </button>
        )}
      </div>

      {/* Instructions */}
      <div>
        <div
          className={styles.sectionHeader}
          onClick={() => setInstructionsOpen((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setInstructionsOpen((v) => !v)}
        >
          <span className={styles.sectionTitle}>
            👨‍🍳 Instructions ({recipe.instructions.length} steps)
          </span>
          <span className={`${styles.chevron} ${instructionsOpen ? styles.chevronOpen : ''}`}>
            ▼
          </span>
        </div>
        {instructionsOpen && (
          <ol className={styles.instructionList}>
            {recipe.instructions.map((step, idx) => {
              const text = step.replace(/^Step\s*\d+:\s*/i, '').trim();
              return (
                <li key={idx} className={styles.instructionItem}>
                  <span className={styles.stepNum}>{idx + 1}</span>
                  <span className={styles.stepText}>{text}</span>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className={styles.actions}>
          <button
            className={`${styles.actionBtn} ${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={handleCopy}
            id={`copy-recipe-${recipe.id}`}
          >
            {copied ? '✅ Copied!' : '📋 Copy Recipe'}
          </button>
          <button
            className={`${styles.actionBtn} ${styles.deleteBtn}`}
            onClick={handleDelete}
            disabled={isDeleting}
            id={`delete-recipe-${recipe.id}`}
          >
            {isDeleting ? '⏳' : confirmDelete ? '⚠️ Confirm?' : '🗑 Delete'}
          </button>
        </div>
      )}
    </article>
  );
});

RecipeCard.displayName = 'RecipeCard';

export default RecipeCard;
