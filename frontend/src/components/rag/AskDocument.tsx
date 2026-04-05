import React, { useCallback, useState } from 'react';
import { useAskDocument } from '../../hooks/useRagMutations';
import { useGetDocuments } from '../../hooks/useRagQueries';
import { useRagStore } from '../../store/ragStore';
import AnswerCard from './AnswerCard';
import styles from './AskDocument.module.css';

const AskDocument: React.FC = () => {
  const [query, setQuery] = useState('');
  const { data: docData } = useGetDocuments();
  const { selectedDocumentId, setSelectedDocumentId, lastAnswer, setActiveTab } = useRagStore();
  const { mutate: askQuery, isPending, error } = useAskDocument();

  const handleAsk = useCallback(() => {
    if (!query.trim()) return;
    askQuery({ query, document_id: selectedDocumentId || undefined });
  }, [query, selectedDocumentId, askQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const hasDocuments = docData && docData.documents.length > 0;

  if (!hasDocuments) {
    return (
      <div className={styles.noDocsBox}>
        <div className={styles.noDocsIcon}>📤</div>
        <h3>No documents uploaded yet</h3>
        <p>Upload a recipe book or cookbook first to ask questions.</p>
        <button className={styles.uploadBtn} onClick={() => setActiveTab('upload')}>
          Upload Document
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>💬 Ask Your Recipe Documents</h2>
      </div>

      <div className={styles.filterBar}>
        <label htmlFor="docFilter">Search in:</label>
        <select
          id="docFilter"
          className={styles.select}
          value={selectedDocumentId || ''}
          onChange={(e) => setSelectedDocumentId(e.target.value || null)}
        >
          <option value="">📚 All Documents</option>
          {docData.documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              📄 {doc.original_filename}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputArea}>
        <textarea
          className={styles.textarea}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about your recipes...&#10;e.g. 'What ingredients do I need for chocolate cake?'&#10;     'How do I make the dough for pizza?'"
          maxLength={500}
        />
        <div className={styles.inputFooter}>
          <span className={styles.charCount}>{query.length} / 500</span>
          <span className={styles.shortcutHint}>Ctrl+Enter to search</span>
        </div>
        <button className={styles.searchBtn} onClick={handleAsk} disabled={!query.trim() || isPending}>
          {isPending ? 'Searching...' : '🔍 Search & Answer'}
        </button>
      </div>

      {error && <div className={styles.errorBox}>⚠️ {(error as any)?.response?.data?.detail || 'Something went wrong.'}</div>}

      {isPending && (
        <div className={styles.loadingCard}>
          <div className={`${styles.brainBox} ${styles.pulse}`}>🧠</div>
          <h3>Searching your documents...</h3>
          <p>Analyzing relevant sections...</p>
        </div>
      )}

      {!isPending && lastAnswer && <AnswerCard response={lastAnswer} />}
    </div>
  );
};

export default AskDocument;
