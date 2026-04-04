import React, { useCallback, useRef, useState } from 'react';
import { useGenerateRecipe } from '../../hooks/useRecipeMutations';
import { useRecipeStore } from '../../store/recipeStore';
import RecipeCard from './RecipeCard';
import styles from './RecipeGenerator.module.css';

const CUISINE_OPTIONS = [
  'Any', 'Italian', 'Indian', 'Chinese', 'Mexican',
  'Mediterranean', 'Japanese', 'Thai', 'French', 'American',
];
const DIETARY_OPTIONS = [
  'Any', 'Vegetarian', 'Vegan', 'Non-Vegetarian',
];

const RecipeGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [cuisine, setCuisine] = useState('Any');
  const [dietary, setDietary] = useState('Any');
  const [validationError, setValidationError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { generatedRecipe } = useRecipeStore();
  const { mutate: generate, isPending, error } = useGenerateRecipe();

  const addIngredient = useCallback(() => {
    const val = inputValue.trim();
    if (!val) return;
    if (ingredients.length >= 20) {
      setValidationError('Maximum 20 ingredients allowed.');
      return;
    }
    if (ingredients.some((i) => i.toLowerCase() === val.toLowerCase())) {
      setValidationError('Ingredient already added.');
      return;
    }
    setIngredients((prev) => [...prev, val]);
    setInputValue('');
    setValidationError('');
    inputRef.current?.focus();
  }, [inputValue, ingredients]);

  const removeIngredient = useCallback((idx: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== idx));
    setValidationError('');
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addIngredient();
      }
    },
    [addIngredient]
  );

  const handleGenerate = useCallback(() => {
    if (ingredients.length === 0) {
      setValidationError('Please add at least 1 ingredient.');
      return;
    }
    setValidationError('');
    generate(
      {
        ingredients,
        cuisine_preference: cuisine === 'Any' ? undefined : cuisine,
        dietary_preference: dietary === 'Any' ? undefined : dietary.toLowerCase(),
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 4000);
        },
      }
    );
  }, [ingredients, cuisine, dietary, generate]);

  // Resolve API error message
  const apiErrorMsg = error
    ? (error as any)?.response?.data?.detail ||
      (navigator.onLine
        ? 'AI is taking too long, please try again.'
        : 'Connection failed. Check your internet.')
    : null;

  return (
    <div className={styles.container}>
      {/* ── LEFT: Input Panel ── */}
      <div className={styles.inputPanel}>
        <div className={styles.panelHeader}>
          <h2>✨ Generate a Recipe</h2>
          <p>Add your available ingredients and let AI create a delicious recipe for you.</p>
        </div>

        {/* Ingredient input */}
        <div>
          <div className={styles.ingredientInputRow}>
            <input
              ref={inputRef}
              className={styles.ingredientInput}
              type="text"
              placeholder="e.g. chicken, garlic, lemon…"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={50}
              id="ingredient-input"
              aria-label="Add ingredient"
            />
            <button
              className={styles.addBtn}
              onClick={addIngredient}
              type="button"
              id="add-ingredient-btn"
            >
              + Add
            </button>
          </div>
          {validationError && (
            <p className={styles.errorMsg} role="alert">{validationError}</p>
          )}
        </div>

        {/* Ingredient pills */}
        {ingredients.length > 0 && (
          <div className={styles.pillsArea}>
            <span className={styles.pillsCount}>
              {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} added
            </span>
            <div className={styles.pills}>
              {ingredients.map((ing, idx) => (
                <span key={idx} className={styles.pill}>
                  {ing}
                  <button
                    className={styles.pillRemove}
                    onClick={() => removeIngredient(idx)}
                    aria-label={`Remove ${ing}`}
                    type="button"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className={styles.filters}>
          <div>
            <label className={styles.filterLabel} htmlFor="cuisine-select">
              Cuisine Preference
            </label>
            <select
              id="cuisine-select"
              className={styles.select}
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
            >
              {CUISINE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.filterLabel} htmlFor="dietary-select">
              Dietary Preference
            </label>
            <select
              id="dietary-select"
              className={styles.select}
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
            >
              {DIETARY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate button */}
        <button
          className={styles.generateBtn}
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || isPending}
          id="generate-recipe-btn"
          type="button"
        >
          {isPending ? (
            <>
              <div className={styles.spinner} />
              Generating…
            </>
          ) : (
            '✨ Generate Recipe'
          )}
        </button>

        {/* Tips */}
        <div className={styles.tipsBox}>
          💡 <strong>Tips:</strong> Add at least 3–4 ingredients for best results. Basic pantry
          items like salt, oil, and water are added automatically by the AI.
        </div>
      </div>

      {/* ── RIGHT: Result Panel ── */}
      <div className={styles.resultPanel}>
        {showSuccess && (
          <div className={styles.successToast} role="status">
            🎉 Recipe generated and saved!
          </div>
        )}

        {apiErrorMsg && (
          <div className={styles.apiError} role="alert">
            ⚠️ {apiErrorMsg}
          </div>
        )}

        {isPending ? (
          /* Skeleton loader */
          <div className={styles.skeleton}>
            <div className={styles.skeletonLine} style={{ height: 28, width: '70%' }} />
            <div className={styles.skeletonLine} style={{ height: 16, width: '40%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '90%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '80%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '85%' }} />
            <div style={{ height: 1 }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '60%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '70%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '55%' }} />
            <div className={styles.skeletonLine} style={{ height: 14, width: '65%' }} />
          </div>
        ) : generatedRecipe ? (
          <RecipeCard recipe={generatedRecipe} showActions={true} />
        ) : (
          /* Empty state */
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🍲</div>
            <h3 className={styles.emptyTitle}>Your AI-generated recipe will appear here</h3>
            <p className={styles.emptySubtitle}>
              Add ingredients on the left and click Generate
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeGenerator;
