import React, { useState } from 'react';
import styles from './GroceryItem.module.css';
import { GroceryItem as GroceryItemType } from '../../types';

interface GroceryItemProps {
  item: GroceryItemType;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  const [checked, setChecked] = useState(false);

  return (
    <div 
      className={`${styles.item} ${checked ? styles.checked : ''}`}
      onClick={() => setChecked(!checked)}
    >
      <div className={styles.checkbox}>
        {checked && '✓'}
      </div>
      <div className={styles.content}>
        <div className={styles['name-row']}>
          <span className={styles.name}>{item.name}</span>
          <span className={styles.quantity}>{item.total_quantity}</span>
        </div>
        <div className={styles.recipes}>
          Used in: {item.recipes.join(', ')}
        </div>
      </div>
    </div>
  );
};

export default React.memo(GroceryItem);
