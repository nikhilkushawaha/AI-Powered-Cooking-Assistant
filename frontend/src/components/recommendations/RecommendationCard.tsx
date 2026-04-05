import React from 'react';
import styles from './RecommendationCard.module.css';
import { RecommendationOut } from '../../types';
import { useGenerateRecipe } from '../../hooks/useRecipeMutations';
import { useNavigate } from 'react-router-dom';

interface RecommendationCardProps {
  recommendation: RecommendationOut;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { mutate: generateRecipe, isPending } = useGenerateRecipe();
  const navigate = useNavigate();

  const handleGenerate = () => {
    generateRecipe({
      ingredients: recommendation.ingredients_preview
    }, {
      onSuccess: () => {
        navigate('/recipes');
      }
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>✨ {recommendation.name}</h3>
        <div className={styles.badges}>
          <span className={styles.badge}>{recommendation.cuisine_type}</span>
          <span className={styles.badge}>{recommendation.difficulty}</span>
          {recommendation.is_vegetarian && (
            <span className={`${styles.badge} ${styles.veg}`}>Vegetarian</span>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{recommendation.description}</p>

        <div className={styles.meta}>
          <span>⏱ {recommendation.cooking_time} mins</span>
        </div>

        <div className={styles.reasonBlock}>
          <p className={styles.reasonTopic}>🤖 Why for you:</p>
          <p className={styles.reason}>"{recommendation.reason}"</p>
        </div>

        <div className={styles.ingredients}>
          <p className={styles.ingTitle}>🥗 Ingredients preview:</p>
          <p className={styles.ingList}>
            {recommendation.ingredients_preview.join(' • ')}
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <button 
          className={styles.generateBtn} 
          onClick={handleGenerate}
          disabled={isPending}
        >
          {isPending ? 'Generating...' : '✨ Generate This Recipe'}
        </button>
      </div>
    </div>
  );
};

export default React.memo(RecommendationCard);
