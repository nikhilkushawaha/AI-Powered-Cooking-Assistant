import React, { lazy, Suspense, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuthStore } from '../store/authStore';
import { useRecipeStore } from '../store/recipeStore';
import styles from './RecipePage.module.css';

const RecipeGenerator = lazy(() => import('../components/recipe/RecipeGenerator'));
const IngredientExtractor = lazy(() => import('../components/recipe/IngredientExtractor'));
const MyRecipes = lazy(() => import('../components/recipe/MyRecipes'));

const TABS = [
  { key: 'generator', label: '✨ Generate Recipe' },
  { key: 'extractor', label: '🔍 Extract Ingredients' },
  { key: 'my-recipes', label: '📚 My Recipes' },
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
  const { activeTab, setActiveTab } = useRecipeStore();

  const handleTabChange = useCallback(
    (tab: TabKey) => setActiveTab(tab),
    [setActiveTab]
  );

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
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default RecipePage;
