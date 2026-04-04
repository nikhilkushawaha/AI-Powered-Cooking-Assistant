import React, { useCallback, useState } from 'react';
import { useMyRecipes } from '../../hooks/useRecipeQueries';
import { useRecipeStore } from '../../store/recipeStore';
import RecipeCard from './RecipeCard';
import styles from './MyRecipes.module.css';

const PAGE_SIZE = 10;

const SkeletonCard: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonLine} style={{ height: 24, width: '72%' }} />
    <div className={styles.skeletonLine} style={{ height: 14, width: '45%' }} />
    <div className={styles.skeletonLine} style={{ height: 13, width: '90%' }} />
    <div className={styles.skeletonLine} style={{ height: 13, width: '80%' }} />
    <div className={styles.skeletonLine} style={{ height: 13, width: '66%' }} />
    <div className={styles.skeletonLine} style={{ height: 13, width: '75%' }} />
  </div>
);

const MyRecipes: React.FC = () => {
  const [page, setPage] = useState(0);
  const { myRecipes, totalRecipes, setActiveTab } = useRecipeStore();

  const skip = page * PAGE_SIZE;
  const { isLoading, error, isFetching } = useMyRecipes(skip, PAGE_SIZE);

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const apiErrorMsg = error
    ? (error as any)?.response?.data?.detail ||
      (navigator.onLine
        ? 'Failed to load recipes. Please try again.'
        : 'Connection failed. Check your internet.')
    : null;

  const showing = myRecipes.length;
  const hasMore = showing < totalRecipes;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>📚 My Recipe Collection</h2>
          <p>All your AI-generated recipes saved in one place</p>
        </div>
        {totalRecipes > 0 && (
          <div className={styles.statsBadge}>
            📖 {totalRecipes} recipe{totalRecipes !== 1 ? 's' : ''} saved
          </div>
        )}
      </div>

      {/* Error */}
      {apiErrorMsg && (
        <div className={styles.errorBox} role="alert">
          ⚠️ {apiErrorMsg}
        </div>
      )}

      {/* Skeleton: initial load */}
      {isLoading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((n) => (
            <SkeletonCard key={n} />
          ))}
        </div>
      ) : myRecipes.length === 0 ? (
        /* Empty state */
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h3 className={styles.emptyTitle}>No recipes yet</h3>
          <p className={styles.emptySubtitle}>
            Generate your first recipe using the Recipe Generator tab
          </p>
          <button
            className={styles.emptyBtn}
            onClick={() => setActiveTab('generator')}
            id="go-to-generator-btn"
            type="button"
          >
            ✨ Generate Recipe
          </button>
        </div>
      ) : (
        <>
          <div className={styles.grid}>
            {myRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showActions={true} />
            ))}
          </div>

          {/* Pagination */}
          {(hasMore || isFetching) && (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Showing {showing} of {totalRecipes} recipes
              </span>
              <button
                className={styles.loadMoreBtn}
                onClick={handleLoadMore}
                disabled={isFetching}
                id="load-more-recipes-btn"
                type="button"
              >
                {isFetching ? '⏳ Loading…' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyRecipes;
