import React, { lazy, Suspense, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import styles from './RecipePage.module.css';

const RecipeGenerator = lazy(() => import('../components/recipe/RecipeGenerator'));
const IngredientExtractor = lazy(() => import('../components/recipe/IngredientExtractor'));
const MyRecipes = lazy(() => import('../components/recipe/MyRecipes'));
const RecommendationGrid = lazy(() => import('../components/recommendations/RecommendationGrid'));
const GroceryList = lazy(() => import('../components/grocery/GroceryList'));
import { useFavoriteStore } from '../store/favoriteStore';
import { useGenerateGrocery } from '../hooks/useGroceryMutation';

const TABS = [
  { key: 'generator', label: '✨ Generate Recipe' },
  { key: 'extractor', label: '🔍 Extract Ingredients' },
  { key: 'my-recipes', label: '📚 My Recipes' },
  { key: 'recommendations', label: '🌟 For You' },
  { key: 'grocery', label: '🛒 Grocery' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const TabFallback: React.FC = () => (
  <div
    style={{
      padding: '60px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        border: '3px solid rgba(233,69,96,0.3)',
        borderTopColor: '#E94560',
        animation: 'spin 0.7s linear infinite',
      }}
    />
  </div>
);

const RecipePage: React.FC = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { activeTab, setActiveTab, myRecipes } = useRecipeStore();
  const selectedForGrocery = useFavoriteStore(state => state.selectedForGrocery);
  const toggleGrocerySelection = useFavoriteStore(state => state.toggleGrocerySelection);
  const groceryList = useFavoriteStore(state => state.groceryList);
  const { mutate: generateGrocery, isPending: isGeneratingGrocery } = useGenerateGrocery();

  const handleTabChange = useCallback(
    (tab: TabKey) => setActiveTab(tab),
    [setActiveTab]
  );
  
  const handleGenerateGrocery = () => {
    if (selectedForGrocery.size === 0) return;
    generateGrocery({ recipe_ids: Array.from(selectedForGrocery) });
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.pageInner}>
        {/* Hero */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>
            🍳 <span>Recipe Studio</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Generate recipes, discover ingredients, manage your personal cookbook
          </p>
        </div>

        {/* Tab bar */}
        <div className={styles.tabBar} role="tablist">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
              onClick={() => handleTabChange(tab.key)}
              id={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className={styles.tabContent} key={activeTab}>
          <Suspense fallback={<TabFallback />}>
            {activeTab === 'generator' && <RecipeGenerator />}
            {activeTab === 'extractor' && <IngredientExtractor />}
            {activeTab === 'my-recipes' && <MyRecipes />}
            {activeTab === 'recommendations' && <RecommendationGrid />}
            {activeTab === 'grocery' && (
              <div className={styles.groceryTab}>
                <div className={styles.groceryHeader}>
                  <h2>🛒 Generate Grocery List</h2>
                  <p>Select recipes from My Recipes or Favorites, then generate a combined shopping list</p>
                </div>
                
                <div className={styles.groceryLayout}>
                  <div className={styles.recipeSelector}>
                    <h3>Select recipes to include:</h3>
                    <div className={styles.recipeList}>
                      {myRecipes.map(recipe => (
                        <div key={recipe.id} className={`${styles.recipeItem} ${selectedForGrocery.has(recipe.id) ? styles.selected : ''}`} onClick={() => toggleGrocerySelection(recipe.id)}>
                          <div className={styles.checkbox}>
                            {selectedForGrocery.has(recipe.id) && '✓'}
                          </div>
                          <span>{recipe.name}</span>
                        </div>
                      ))}
                      {myRecipes.length === 0 && <p className={styles.noRecipes}>Save some recipes first!</p>}
                    </div>
                    
                    <div className={styles.groceryAction}>
                      <span>{selectedForGrocery.size} recipes selected</span>
                      <button 
                        disabled={selectedForGrocery.size === 0 || isGeneratingGrocery}
                        onClick={handleGenerateGrocery}
                        className={styles.generateBtn}
                      >
                        {isGeneratingGrocery ? 'Generating...' : 'Generate Shopping List'}
                      </button>
                    </div>
                  </div>

                  <div className={styles.groceryResult}>
                    {!groceryList ? (
                      <div className={styles.emptyState}>Select recipes on the left and generate a list</div>
                    ) : (
                      <GroceryList inline />
                    )}
                  </div>
                </div>
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
