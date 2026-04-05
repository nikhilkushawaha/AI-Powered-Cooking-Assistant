import React from 'react';
import { useGetDocuments } from '../../hooks/useRagQueries';
import { useDeleteDocument } from '../../hooks/useRagMutations';
import { useRagStore } from '../../store/ragStore';
import styles from './DocumentList.module.css';

const DocumentList: React.FC = () => {
  const { data, isLoading } = useGetDocuments();
  const { mutate: deleteDoc } = useDeleteDocument();
  const { setActiveTab, setSelectedDocumentId } = useRagStore();

  const handleAsk = (id: string) => {
    setSelectedDocumentId(id);
    setActiveTab('ask');
  };

  const handleDelete = (id: string, filename: string) => {
    // Inline confirmation (not browser alert!) we can use built-in window.confirm for simplicity,
    // wait, rule says "never browser confirm". We'll implement a fast inline state component or simplified dialog here.
    // However, for brevity and following exact spec "shows confirmation dialog (inline, not browser confirm)"
    // Let's implement an inline UI state for confirming. Let's just use window.confirm? No, "never browser alert".
    // I will pass a function down or use a local state.
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading documents...</div>;
  }

  const docs = data?.documents || [];
  const totalChunks = docs.reduce((acc, doc) => acc + doc.chunks_count, 0);

  if (docs.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📁</div>
        <h3>No documents yet</h3>
        <p>Upload your first recipe book to get started</p>
        <button className={styles.uploadBtn} onClick={() => setActiveTab('upload')}>
          📤 Upload Document
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📁 My Documents</h2>
        <p>Manage your uploaded recipe documents</p>
      </div>

      <div className={styles.statsBar}>
        {docs.length} documents uploaded • {totalChunks} total chunks
      </div>

      <div className={styles.list}>
        {docs.map((doc) => (
          <DocumentItem
            key={doc.id}
            doc={doc}
            onAsk={() => handleAsk(doc.id)}
            onDelete={() => deleteDoc(doc.id)}
          />
        ))}
      </div>
    </div>
  );
};

const DocumentItem = React.memo(({ doc, onAsk, onDelete }: any) => {
  const [showConfirm, setShowConfirm] = React.useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready': return <span className={`${styles.badge} ${styles.badgeReady}`}>✅ Ready</span>;
      case 'processing': return <span className={`${styles.badge} ${styles.badgeProcessing}`}>⏳ Processing</span>;
      case 'failed': return <span className={`${styles.badge} ${styles.badgeFailed}`}>❌ Failed</span>;
      default: return null;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.cardTitle}>
          📄 {doc.original_filename}
        </div>
        {getStatusBadge(doc.status)}
      </div>

      <div className={styles.cardMeta}>
        <span>Type: {doc.file_type.toUpperCase()}</span>
        <span>Size: {(doc.file_size / (1024 * 1024)).toFixed(2)}MB</span>
        <span>Chunks: {doc.chunks_count}</span>
      </div>
      
      <div className={styles.cardDate}>
        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
      </div>

      <div className={styles.actions}>
        {showConfirm ? (
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              Are you sure you want to delete {doc.original_filename}? 
              This will remove all stored knowledge from this document.
            </p>
            <div className={styles.confirmActions}>
              <button className={styles.btnCancel} onClick={() => setShowConfirm(false)}>Cancel</button>
              <button className={styles.btnDelete} onClick={onDelete}>Delete</button>
            </div>
          </div>
        ) : (
          <>
            <button className={styles.btnAsk} onClick={onAsk} disabled={doc.status !== 'ready'}>
              💬 Ask This Doc
            </button>
            <button className={styles.btnRemove} onClick={() => setShowConfirm(true)}>
              🗑 Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
});

export default DocumentList;
