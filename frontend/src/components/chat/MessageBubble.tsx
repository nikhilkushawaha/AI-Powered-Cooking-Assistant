import React, { memo } from 'react';
import styles from './MessageBubble.module.css';
import { Message } from '../../types';
import { formatTime } from '../../utils/helpers';
import Avatar from '../ui/Avatar';

interface Props {
  message: Message;
  userName: string;
  avatarUrl?: string;
}

// Simple markdown-ish renderer for AI responses
const renderContent = (content: string) => {
  if (!content) return null;

  const lines = content.split('\n');
  const result: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      result.push(
        <ul key={`ul-${key}`} style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }}>
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(String(i));
      return;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
      listItems.push(trimmed.slice(2));
    } else if (/^\d+\.\s/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s/, ''));
    } else {
      flushList(String(i));
      if (trimmed.startsWith('###')) {
        result.push(<h4 key={i} style={{ margin: '0.75rem 0 0.35rem', color: '#F5A623' }}>{trimmed.slice(3).trim()}</h4>);
      } else if (trimmed.startsWith('##')) {
        result.push(<h3 key={i} style={{ margin: '0.75rem 0 0.35rem', color: '#F5A623' }}>{trimmed.slice(2).trim()}</h3>);
      } else if (trimmed.startsWith('#')) {
        result.push(<h2 key={i} style={{ margin: '0.75rem 0 0.5rem', color: '#fff' }}>{trimmed.slice(1).trim()}</h2>);
      } else {
        result.push(<p key={i} style={{ margin: '0 0 0.5rem' }}>{renderInline(trimmed)}</p>);
      }
    }
  });
  flushList('final');

  return result;
};

const renderInline = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    return part;
  });
};

const MessageBubble: React.FC<Props> = memo(({ message, userName, avatarUrl }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`${styles['bubble-row']} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && (
        <div className={styles.avatar}>🍳</div>
      )}

      <div className={styles['bubble-content']}>
        <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            renderContent(message.content)
          )}
        </div>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <Avatar name={userName} src={avatarUrl} size={36} />
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';
export default MessageBubble;
