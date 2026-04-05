import React from 'react';
import styles from './GroceryList.module.css';
import { useFavoriteStore } from '../../store/favoriteStore';
import GroceryItem from './GroceryItem';

interface GroceryListProps {
  inline?: boolean;
}

const GroceryList: React.FC<GroceryListProps> = ({ inline = false }) => {
  const groceryList = useFavoriteStore((state) => state.groceryList);
  const showGroceryModal = useFavoriteStore((state) => state.showGroceryModal);
  const setShowGroceryModal = useFavoriteStore((state) => state.setShowGroceryModal);
  const [copied, setCopied] = React.useState(false);

  // When inline mode, ignore the showGroceryModal flag
  if ((!showGroceryModal && !inline) || !groceryList) return null;

  const handleCopy = () => {
    let text = `🛒 Grocery List\n──────────────\n`;
    groceryList.items.forEach(item => {
      text += `□ ${item.name} - ${item.total_quantity}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const content = (
      <div className={`${styles.modal} ${inline ? styles.inlineModal : ''}`} onClick={(e) => inline ? undefined : e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            {inline ? null : <h2>🛒 Your Grocery List</h2>}
            <p className={styles.subtitle}>Combined ingredients from {groceryList.recipe_names.length} recipes</p>
            <div className={styles.pills}>
              {groceryList.recipe_names.map((name, i) => (
                <span key={i} className={styles.pill}>{name}</span>
              ))}
            </div>
          </div>
          {!inline && <button className={styles.close} onClick={() => setShowGroceryModal(false)}>✕</button>}
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} onClick={handleCopy}>
            {copied ? '✅ Copied!' : '📋 Copy Full List'}
          </button>
          <button className={styles.btn} onClick={handlePrint}>
            🖨️ Print
          </button>
        </div>

        <div className={styles.list}>
          {groceryList.items.map((item, idx) => (
            <GroceryItem key={idx} item={item} />
          ))}
        </div>
      </div>
  );

  return inline ? content : (
    <div className={styles.overlay} onClick={() => setShowGroceryModal(false)}>
      {content}
    </div>
  );
};

export default React.memo(GroceryList);
