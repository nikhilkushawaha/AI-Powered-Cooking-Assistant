import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUploadDocument } from '../../hooks/useRagMutations';
import { useRagStore } from '../../store/ragStore';
import styles from './FileUploader.module.css';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const FileUploader: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState('');
  const { uploadProgress, setActiveTab } = useRagStore();
  const { mutate: upload, isPending } = useUploadDocument();

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    setValidationError('');
    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      if (error.code === 'file-invalid-type') setValidationError('Only PDF and TXT files are supported');
      else if (error.code === 'file-too-large') setValidationError('File must be smaller than 10MB');
      else setValidationError(error.message);
      return;
    }
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFile) return;
    upload({ file: selectedFile });
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setValidationError('');
  };

  const isSuccess = uploadProgress === 100;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📤 Upload Recipe Document</h2>
        <p>Supported formats: PDF, TXT — Max size: 10MB</p>
      </div>

      {isSuccess ? (
        <div className={styles.successBox}>
          <h3>✅ Document uploaded successfully!</h3>
          <p>Chunks extracted and stored.</p>
          <div className={styles.successActions}>
            <button className={styles.btnPrimary} onClick={() => setActiveTab('ask')}>
              💬 Ask Questions Now
            </button>
            <button className={styles.btnSecondary} onClick={() => { setSelectedFile(null); useRagStore.getState().setUploadProgress(0); }}>
              📤 Upload Another
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className={`${styles.dropZone} ${isDragActive ? styles.dragActive : ''}`}
          >
            <input {...getInputProps()} />
            <div className={styles.dropContent}>
              <span className={`${styles.icon} ${isDragActive ? styles.bounce : ''}`}>📄</span>
              {isDragActive ? (
                <p className={styles.dropText}>Drop it here!</p>
              ) : (
                <>
                  <p className={styles.dropText}>Drag & drop your recipe document here</p>
                  <p className={styles.orText}>or</p>
                  <button type="button" className={styles.browseBtn}>Browse Files</button>
                </>
              )}
            </div>
          </div>

          {validationError && <div className={styles.errorBox}>{validationError}</div>}

          {selectedFile && !isPending && (
            <div className={styles.filePreview}>
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <span className={styles.fileSize}>{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                <span className={styles.fileBadge}>{selectedFile.name.endsWith('.pdf') ? 'PDF' : 'TXT'}</span>
              </div>
              <button className={styles.removeBtn} onClick={handleRemove}>✕ Remove</button>
            </div>
          )}

          {isPending && (
            <div className={styles.progressContainer}>
              <div className={styles.progressBarBg}>
                <div className={styles.progressBarFill} style={{ width: `${uploadProgress}%` }}>
                  <span className={styles.progressText}>{uploadProgress}%</span>
                </div>
              </div>
              <p className={styles.progressStatus}>Processing document...</p>
            </div>
          )}

          <button
            className={styles.uploadBtn}
            onClick={handleUpload}
            disabled={!selectedFile || isPending}
          >
            {isPending ? 'Uploading...' : '📤 Upload & Process'}
          </button>
        </>
      )}
    </div>
  );
};

export default FileUploader;
