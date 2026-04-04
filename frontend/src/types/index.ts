export interface User {
  id: string;
  email: string;
  full_name: string;
  dietary_preference: string;
  avatar_url?: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  session_id: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
  session_id: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface HistoryMessage {
  role: string;
  content: string;
  created_at: string;
}

export interface SignupData {
  full_name: string;
  email: string;
  password: string;
  dietary_preference: string;
}

export interface LoginData {
  email: string;
  password: string;
}
