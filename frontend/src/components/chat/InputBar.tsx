import React, { useCallback, useRef, useState } from 'react';
import styles from './InputBar.module.css';
import { useChatStore } from '../../store/chatStore';
import { useSpeech } from '../../hooks/useSpeech';
import SpeakingIndicator from './SpeakingIndicator';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const InputBar: React.FC<Props> = ({ onSend, disabled }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isListening = useChatStore((s) => s.isListening);
  const { startListening } = useSpeech();

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    autoResize();
  }, [autoResize]);

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [text, disabled, onSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleMic = useCallback(() => {
    startListening((transcript) => {
      setText(transcript);
      setTimeout(autoResize, 50);
    });
  }, [startListening, autoResize]);

  return (
    <div className={styles['input-bar']}>
      <div className={styles['speaking-row']}>
        <SpeakingIndicator />
      </div>

      <div className={styles['input-row']}>
        {/* Mic button */}
        <button
          className={`${styles['icon-btn']} ${styles['mic-btn']} ${isListening ? styles.listening : ''}`}
          onClick={handleMic}
          disabled={isListening}
          aria-label={isListening ? 'Listening...' : 'Start voice input'}
          title={isListening ? 'Listening...' : 'Voice input'}
          id="mic-btn"
        >
          🎤
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask Chef AI anything about cooking…"
          rows={1}
          disabled={disabled}
          aria-label="Chat message input"
          id="chat-input"
        />

        {/* Send button */}
        <button
          className={`${styles['icon-btn']} ${styles['send-btn']}`}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          aria-label="Send message"
          title="Send message"
          id="send-btn"
        >
          {disabled ? <span className="spinner" style={{ width: '16px', height: '16px' }} /> : '▶'}
        </button>
      </div>

      <p className={styles.hint}>
        Press <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>Enter</kbd> to send,{' '}
        <kbd style={{ background: 'rgba(255,255,255,0.06)', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
};

export default InputBar;
