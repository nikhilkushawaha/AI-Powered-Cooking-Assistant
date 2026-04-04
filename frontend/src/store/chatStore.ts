import { create } from 'zustand';
import { Message } from '../types';
import { generateSessionId } from '../utils/helpers';

interface ChatState {
  session_id: string;
  messages: Message[];
  isListening: boolean;
  isSpeaking: boolean;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  clearMessages: () => void;
  resetSession: () => void;
  setIsListening: (val: boolean) => void;
  setIsSpeaking: (val: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  session_id: generateSessionId(),
  messages: [],
  isListening: false,
  isSpeaking: false,

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  setMessages: (msgs) => set({ messages: msgs }),

  clearMessages: () => set({ messages: [] }),

  resetSession: () =>
    set({ session_id: generateSessionId(), messages: [] }),

  setIsListening: (val) => set({ isListening: val }),

  setIsSpeaking: (val) => set({ isSpeaking: val }),
}));
