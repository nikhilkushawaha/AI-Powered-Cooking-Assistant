import React, { useCallback, useState } from 'react';
import { useExtractIngredients } from '../../hooks/useRecipeQueries';
import { useRecipeStore } from '../../store/recipeStore';
import styles from './IngredientExtractor.module.css';

const IngredientExtractor: React.FC = () => {
  const [dishInput, setDishInput] = useState('');
  const [submittedDish, setSubmittedDish] = useState('');
  const [queryEnabled, setQueryEnabled] = useState(false);
  const [copied, setCopied] = useState(false);

  const { setActiveTab } = useRecipeStore();

  const { data, isFetching, error, refetch } = useExtractIngredients(submittedDish, queryEnabled);

  const handleExtract = useCallback(() => {
    const val = dishInput.trim();
    if (val.length < 2) return;
    setSubmittedDish(val);
    setQueryEnabled(true);
    // If same dish is re-submitted, force refetch
    if (val === submittedDish) {
      refetch();
    }
  }, [dishInput, submittedDish, refetch]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleExtract();
    },
    [handleExtract]
  );

  const handleCopyList = useCallback(() => {
    if (!data) return;
    const lines = data.ingredients
      .map((i) => `• ${i.name} — ${i.quantity}`)
      .join('\n');
    const text = `${data.dish_name} — Ingredients:\n${lines}${
      data.serving_size ? `\nServes: ${data.serving_size}` : ''
    }`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [data]);

  const handleGenerateFromHere = useCallback(() => {
    if (!data) return;
    // We'll switch tabs; the RecipeGenerator has its own state,
    // but we can pre-populate via the store's extractedIngredients
    useRecipeStore.setState({ extractedIngredients: data, activeTab: 'generator' });
  }, [data]);

  const apiErrorMsg = error
    ? (error as any)?.response?.data?.detail ||
      (navigator.onLine
        ? 'AI is taking too long, please try again.'
        : 'Connection failed. Check your internet.')
    : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🔍 Ingredient Extractor</h2>
        <p>Enter any dish name and instantly get all the ingredients you need.</p>
      </div>

      {/* Search bar */}
      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="e.g. Butter Chicken, Pasta Carbonara, Sushi…"
            value={dishInput}
            onChange={(e) => setDishInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={100}
            id="dish-name-input"
            aria-label="Dish name"
          />
        </div>
        <button
          className={styles.extractBtn}
          onClick={handleExtract}
          disabled={isFetching || dishInput.trim().length < 2}
          id="extract-ingredients-btn"
          type="button"
        >
          {isFetching ? (
            <>
              <div className={styles.spinner} />
              Extracting…
            </>
          ) : (
            'Extract Ingredients'
          )}
        </button>
      </div>

      {/* Error */}
      {apiErrorMsg && (
        <div className={styles.errorBox} role="alert">
          ⚠️ {apiErrorMsg}
        </div>
      )}

      {/* Loading state (beyond button spinner) */}
      {isFetching && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <span>Extracting ingredients for <strong>{submittedDish}</strong>…</span>
        </div>
      )}

      {/* Result card */}
      {!isFetching && data && (
        <div className={styles.resultCard}>
          <div className={styles.resultHeader}>
            <h3 className={styles.dishName}>
              <span>🍽️</span>
              {data.dish_name}
            </h3>
            {data.serving_size && (
              <span className={styles.servingBadge}>🍴 {data.serving_size}</span>
            )}
          </div>

          <div className={styles.divider} />

          {/* Ingredients table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.tableHead}>
                <tr>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {data.ingredients.map((ing, idx) => (
                  <tr key={idx} className={styles.tableRow}>
                    <td>{ing.name}</td>
                    <td>{ing.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className={styles.notes}>
              📝 <strong>Notes:</strong> {data.notes}
            </div>
          )}

          {/* Action buttons */}
          <div className={styles.resultActions}>
            <button
              className={`${styles.actionBtn} ${copied ? styles.copied : ''}`}
              onClick={handleCopyList}
              id="copy-ingredients-btn"
              type="button"
            >
              {copied ? '✅ Copied!' : '📋 Copy List'}
            </button>
            <button
              className={`${styles.actionBtn} ${styles.actionPrimary}`}
              onClick={handleGenerateFromHere}
              id="generate-from-extractor-btn"
              type="button"
            >
              ✨ Generate Recipe
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IngredientExtractor;
