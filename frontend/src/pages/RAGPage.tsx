import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import { useRagStore } from '../store/ragStore';
import FileUploader from '../components/rag/FileUploader';
import AskDocument from '../components/rag/AskDocument';
import DocumentList from '../components/rag/DocumentList';
import styles from './RAGPage.module.css';

const RAGPage: React.FC = () => {
  const { activeTab, setActiveTab } = useRagStore();

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className={styles.page}>
      <Navbar />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>📚 Recipe Knowledge Base</h1>
          <p className={styles.subtitle}>
            Upload your recipe books and cookbooks, then ask anything about them using AI.
          </p>
        </div>

        <div className={styles.howItWorks}>
          <div className={styles.step}>
            <div className={styles.stepIcon}>📤</div>
            <div className={styles.stepText}>
              <strong>1. Upload Doc</strong>
              <span>PDF or TXT</span>
            </div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>🧠</div>
            <div className={styles.stepText}>
              <strong>2. AI Processes</strong>
              <span>Extracts Knowledge</span>
            </div>
          </div>
          <div className={styles.arrow}>→</div>
          <div className={styles.step}>
            <div className={styles.stepIcon}>💬</div>
            <div className={styles.stepText}>
              <strong>3. Ask Questions</strong>
              <span>Instant Answers</span>
            </div>
          </div>
        </div>

        <div className={styles.tabContainer}>
          <div className={styles.tabBar}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'upload' ? styles.active : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              📤 Upload Document
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'ask' ? styles.active : ''}`}
              onClick={() => setActiveTab('ask')}
            >
              💬 Ask Document
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'documents' ? styles.active : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              📁 My Documents
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'upload' && <FileUploader />}
            {activeTab === 'ask' && <AskDocument />}
            {activeTab === 'documents' && <DocumentList />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default RAGPage;
