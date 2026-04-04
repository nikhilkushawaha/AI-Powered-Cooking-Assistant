import { useQuery } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { useChatStore } from '../store/chatStore';
import { Message } from '../types';
import { generateSessionId } from '../utils/helpers';

export const useChatHistory = (session_id: string) => {
  const setMessages = useChatStore((s) => s.setMessages);

  return useQuery({
    queryKey: ['history', session_id],
    queryFn: async () => {
      const data = await chatApi.getHistory(session_id);
      const messages: Message[] = data.history.map((h) => ({
        id: generateSessionId(),
        role: h.role as 'user' | 'assistant',
        content: h.content,
        timestamp: new Date(h.created_at),
      }));
      setMessages(messages);
      return data;
    },
    enabled: false,
  });
};
