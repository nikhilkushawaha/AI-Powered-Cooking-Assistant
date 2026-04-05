import React from 'react';
import styles from './RecommendationGrid.module.css';
import { useGetRecommendations } from '../../hooks/useRecommendationQuery';
import RecommendationCard from './RecommendationCard';

const RecommendationGrid: React.FC = () => {
  const { data, isLoading, isError, refetch, isFetching } = useGetRecommendations(5);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>🌟 Recommended For You</h2>
          <p className={styles.subtitle}>Analyzing your taste profile...</p>
        </div>
        <div className={styles.grid}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.skeletonCard}>
              <div className={styles.skeletonShimmer}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={styles.errorState}>
        <p>Failed to generate recommendations.</p>
        <button onClick={() => refetch()} className={styles.retryBtn}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerLine}>
        <div className={styles.headerTitle}>
          <h2>🌟 Recommended For You</h2>
          <div className={styles.subtextRows}>
            <span className={styles.basedOn}>{data.based_on}</span>
            <span className={styles.dietBadge}>{data.dietary_preference} diet</span>
          </div>
        </div>
        
        <button 
          onClick={() => refetch()} 
          className={styles.refreshBtn}
          disabled={isFetching}
        >
          {isFetching ? '🔄 Refreshing...' : '🔄 Refresh Recommendations'}
        </button>
      </div>

      <div className={styles.grid}>
        {data.recommendations.map((rec, idx) => (
          <RecommendationCard key={idx} recommendation={rec} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationGrid;
