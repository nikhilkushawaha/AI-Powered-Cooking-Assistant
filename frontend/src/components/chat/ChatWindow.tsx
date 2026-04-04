import React, { useEffect, useRef } from 'react';
import styles from './ChatWindow.module.css';
import { useChatStore } from '../../store/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputBar from './InputBar';
import { User, Message } from '../../types';
import { useChatMutation } from '../../hooks/useChatMutation';
import { generateSessionId } from '../../utils/helpers';

const SUGGESTIONS = [
  '🍝 Suggest a pasta recipe',
  '🥗 Healthy dinner ideas for tonight',
  '🔪 How to improve my knife skills?',
  '🥘 What can I cook with chicken and rice?',
];

interface Props {
  user: User;
}

const ChatWindow: React.FC<Props> = ({ user }) => {
  const { messages, session_id, addMessage } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { mutate: sendMessage, isPending } = useChatMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: generateSessionId(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    addMessage(userMsg);
    sendMessage({ session_id, message: text });
  };

  const handleSuggestion = (text: string) => {
    handleSend(text.replace(/^[\p{Emoji}\s]+/u, '').trim() || text);
  };

  return (
    <div className={styles.window}>
      <div className={styles['messages-area']}>
        {messages.length === 0 ? (
          <div className={styles['empty-state']}>
            <div className={styles['chef-avatar-large']}>🍳</div>
            <h2 className={styles['empty-heading']}>
              Hello, {user.full_name.split(' ')[0]}! 👋
            </h2>
            <p className={styles['empty-sub']}>
              I'm Chef AI, your personal cooking assistant. Ask me anything
              about recipes, techniques, or ingredients!
            </p>
            <div className={styles['suggestions-grid']}>
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  className={styles['suggestion-chip']}
                  onClick={() => handleSuggestion(s)}
                  id={`suggestion-${i}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                userName={user.full_name}
                avatarUrl={user.avatar_url}
              />
            ))}
            {isPending && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <InputBar onSend={handleSend} disabled={isPending} />
    </div>
  );
};

export default ChatWindow;
