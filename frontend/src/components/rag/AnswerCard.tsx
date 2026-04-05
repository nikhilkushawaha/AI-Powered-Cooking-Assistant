import React, { useState } from 'react';
import type { AskDocumentResponse } from '../../types';
import { useRagStore } from '../../store/ragStore';
import styles from './AnswerCard.module.css';

interface AnswerCardProps {
  response: AskDocumentResponse;
}

const AnswerCard: React.FC<AnswerCardProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const { setLastAnswer } = useRagStore();

  const handleCopy = () => {
    navigator.clipboard.writeText(response.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAskAnother = () => {
    setLastAnswer(null);
  };

  const getRelevanceStyle = (relCode: number) => {
    if (relCode >= 0.8) return styles.highRel;
    if (relCode >= 0.6) return styles.midRel;
    return styles.lowRel;
  };

  return (
    <div className={styles.card}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>🔍</span> Your Question
        </div>
        <div className={styles.queryText}>"{response.query}"</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.icon}>🤖</span> Chef AI Answer
        </div>
        <div className={styles.answerText}>{response.answer}</div>
      </div>

      <div className={styles.divider} />

      <div className={styles.section}>
        <div className={styles.sourceMeta}>
          📚 Sources ({response.sources.length} relevant sections found)
          <br />
          Searched {response.documents_searched} document(s)
        </div>

        <div className={styles.sourcesList}>
          {response.sources.map((source, idx) => (
            <details key={idx} className={`${styles.sourceItem} ${getRelevanceStyle(source.relevance)}`}>
              <summary className={styles.sourceSummary}>
                <span className={styles.sourceDoc}>📄 {source.document_name}</span>
                <span className={styles.sourceRel}>🎯 {Math.round(source.relevance * 100)}% relevant</span>
              </summary>
              <div className={styles.sourceContent}>{source.content}</div>
            </details>
          ))}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnSecondary} onClick={handleCopy}>
          {copied ? '✅ Copied!' : '📋 Copy Answer'}
        </button>
        <button className={styles.btnPrimary} onClick={handleAskAnother}>
          🔄 Ask Another
        </button>
      </div>
    </div>
  );
};

// React.memo to prevent unnecessary re-rendering
export default React.memo(AnswerCard);
