import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
import { useChatStore } from '../store/chatStore';
import { ChatRequest, Message } from '../types';
import { generateSessionId } from '../utils/helpers';
import { useSpeech} from './useSpeech';

export const useChatMutation = () => {
  const addMessage = useChatStore((s) => s.addMessage);
  const session_id = useChatStore((s) => s.session_id);
  const { speak } = useSpeech();

  return useMutation({
    mutationFn: (data: ChatRequest) => chatApi.sendMessage(data),
    onSuccess: (response) => {
      const assistantMsg: Message = {
        id: generateSessionId(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date(),
      };
      addMessage(assistantMsg);
      speak(response.reply);
    },
    onError: () => {
      const errorMsg: Message = {
        id: generateSessionId(),
        role: 'assistant',
        content: '⚠️ Sorry, I had trouble responding. Please try again.',
        timestamp: new Date(),
      };
      addMessage(errorMsg);
    },
  });
};
