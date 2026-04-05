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

// ── Phase 2: Recipe types ──────────────────────────────────────────────────

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string | null;
  ingredients: Ingredient[];
  instructions: string[];
  cooking_time: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  cuisine_type: string | null;
  is_vegetarian: boolean;
  calories: number | null;
  source: string;
  created_at: string;
}

export interface GenerateRecipeRequest {
  ingredients: string[];
  cuisine_preference?: string;
  dietary_preference?: string;
}

export interface ExtractIngredientsResponse {
  dish_name: string;
  ingredients: Ingredient[];
  serving_size: string | null;
  notes: string | null;
}

export interface RecipeListOut {
  recipes: Recipe[];
  total: number;
}

// ── Phase 3: RAG types ─────────────────────────────────────────────────────

export interface DocumentOut {
  id: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  chunks_count: number;
  status: "processing" | "ready" | "failed";
  created_at: string;
}

export interface SourceChunk {
  content: string;
  document_name: string;
  relevance: number;
}

export interface AskDocumentRequest {
  query: string;
  document_id?: string;
}

export interface AskDocumentResponse {
  query: string;
  answer: string;
  sources: SourceChunk[];
  documents_searched: number;
}

export interface DocumentListResponse {
  documents: DocumentOut[];
  total: number;
}

export interface UploadDocumentResponse {
  id: string;
  filename: string;
  original_filename: string;
  file_type: string;
  file_size: number;
  chunks_count: number;
  status: 'processing' | 'ready' | 'failed';
  created_at: string;
  message: string;
}

// ── Phase 4: Favorites and Grocery ─────────────────────────────────────────────

export interface FavoriteOut {
  id: string;
  recipe_id: string;
  created_at: string;
  recipe: Recipe;
}

export interface FavoriteListResponse {
  favorites: FavoriteOut[];
  total: number;
}

export interface FavoriteStatusResponse {
  recipe_id: string;
  is_favorited: boolean;
  message: string;
}

export interface GroceryRequest {
  recipe_ids: string[];
}

export interface GroceryItem {
  name: string;
  total_quantity: string;
  unit: string | null;
  recipes: string[];
}

export interface GroceryListResponse {
  items: GroceryItem[];
  total_items: number;
  recipe_names: string[];
  generated_at: string;
}

export interface RecommendationOut {
  name: string;
  description: string;
  cuisine_type: string;
  difficulty: string;
  cooking_time: number;
  is_vegetarian: boolean;
  reason: string;
  ingredients_preview: string[];
}

export interface RecommendationResponse {
  recommendations: RecommendationOut[];
  based_on: string;
  dietary_preference: string;
}
