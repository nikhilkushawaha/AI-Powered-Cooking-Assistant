# 🍳 Chef AI — AI-Powered Cooking Assistant

> A production-ready full-stack web application that helps you discover recipes, generate personalized meals, extract ingredients, and query your own recipe documents using cutting-edge AI and Retrieval-Augmented Generation (RAG).

---

## 📸 Application Screenshots

### 🏠 Landing Page
![Landing Page](./frontend/screenshots/landing-page.png)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🍳 Chef AI                                          [Sign In]       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   🍕    🍜    🥗    🍳    🧁                                         │
│                                                                     │
│            Your AI-Powered                                          │
│            Personal Chef                                            │
│                                                                     │
│   Ask anything about cooking — recipes, techniques,                 │
│   ingredients — powered by advanced AI                              │
│                                                                     │
│         [Get Started Free]    [See How it Works]                    │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  🤖 AI Assistant   🎤 Voice Enabled   📚 Recipe Knowledge           │
├─────────────────────────────────────────────────────────────────────┤
│  1️⃣ Create Account → 2️⃣ Ask Question → 3️⃣ Cook Amazing Food         │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 🔐 Login & Signup Pages
```
┌────────────────────────────────────────┐
│                                        │
│  🍳  Welcome Back                      │
│  Sign in to Chef AI                    │
│                                        │
│  ✉  Email                             │
│  ┌──────────────────────────────────┐  │
│  │ you@example.com                  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  🔒  Password                          │
│  ┌──────────────────────────────────┐  │
│  │ ••••••••••••              [👁]   │  │
│  └──────────────────────────────────┘  │
│                                        │
│  [ Remember me ]                       │
│                                        │
│  ┌──────────────────────────────────┐  │
│  │         Sign In →                │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Don't have an account? Sign up        │
│                                        │
└────────────────────────────────────────┘
```

---

### 💬 Chat Page — AI Cooking Assistant
![Chat Page](./frontend/screenshots/chat-page.png)
```
┌────────────────────────────────────────────────────────────────────┐
│  🍳 Chef AI        🍳 Recipes   📚 Knowledge      [👤 Nikhil ▾]    │
├───────────────┬────────────────────────────────────────────────────┤
│  Sidebar      │                                                    │
│               │   🍳                                               │
│  👤 Nikhil    │   Hello, Nikhil! 👋                                │
│  🌱 Any Diet  │   I'm Chef AI, your personal cooking assistant.    │
│               │                                                    │
│  [+ New Chat] │  ┌────────────────────────────────────────────┐   │
│               │  │ 🍝 Suggest a pasta recipe                  │   │
│  Recent:      │  └────────────────────────────────────────────┘   │
│  • Pasta Q... │  ┌────────────────────────────────────────────┐   │
│  • Chicken... │  │ 🥗 Healthy dinner ideas                    │   │
│  • Baking...  │  └────────────────────────────────────────────┘   │
│               │  ┌────────────────────────────────────────────┐   │
│               │  │ 🔪 Knife skills tips                       │   │
│               │  └────────────────────────────────────────────┘   │
│               │                                                    │
│               │        ────────────────────────────               │
│               │                                                    │
│               │  How do I make pasta al dente?     [You] →        │
│               │                                                    │
│               │  🍳 Chef AI                                        │
│               │  Great question! Cooking pasta al dente means...   │
│               │  📝 Ingredients  👨‍🍳 Instructions  ⏱ 10 mins      │
│               │                                                    │
├───────────────┴────────────────────────────────────────────────────┤
│  [🎤]  Ask me anything about cooking...            [▶ Send]        │
│        Press Enter to send, Shift+Enter for new line               │
└────────────────────────────────────────────────────────────────────┘
```

---

### 🍽️ Recipe Generator Page
![Recipe Page](./frontend/screenshots/recipe.png)
```
┌────────────────────────────────────────────────────────────────────┐
│  🍳 Chef AI        🍳 Recipes   📚 Knowledge      [👤 Nikhil ▾]    │
├────────────────────────────────────────────────────────────────────┤
│                    🍳 Recipe Studio                                 │
│      Generate recipes, discover ingredients, manage your cookbook  │
├────────────────────────────────────────────────────────────────────┤
│  [✨ Generate Recipe]  [🔍 Extract Ingredients]  [📚 My Recipes]   │
├──────────────────────────┬─────────────────────────────────────────┤
│  INPUT PANEL             │  RESULT PANEL                           │
│                          │                                         │
│  ✨ Generate a Recipe    │  🍽️ Creamy Garlic Lemon Chicken         │
│  Add ingredients and     │  [Italian] [Easy] [🍗 Non-Veg]         │
│  let AI create for you   │                                         │
│                          │  A rich and creamy chicken dish...      │
│  [chicken      ] [Add]   │  ─────────────────────────────────────  │
│                          │  ⏱ 30 mins  📊 Easy  🔥 450 cal        │
│  🔴 chicken  ✕           │  ─────────────────────────────────────  │
│  🔴 garlic   ✕           │  📝 Ingredients                         │
│  🔴 lemon    ✕           │  • Chicken breast - 500g               │
│  3 ingredients added     │  • Garlic - 4 cloves                   │
│                          │  • Lemon - 1 whole                     │
│  Cuisine: [Italian  ▾]   │  • Heavy cream - 200ml                 │
│  Diet:    [Any      ▾]   │  + Show 4 more                         │
│                          │  ─────────────────────────────────────  │
│  ┌──────────────────────┐│  👨‍🍳 Instructions                      │
│  │  ✨ Generate Recipe  ││  1. Marinate chicken with lemon juice  │
│  └──────────────────────┘│  2. Heat oil in a pan over medium heat │
│                          │  3. Sear chicken until golden brown... │
│  💡 Add 3-4 ingredients  │  ─────────────────────────────────────  │
│  for best results        │  [🗑 Delete]  [📋 Copy Recipe]         │
└──────────────────────────┴─────────────────────────────────────────┘
```

---

### 🔍 Ingredient Extractor
![Ingredient Page](./frontend/screenshots/rag.png)
```
┌────────────────────────────────────────────────────────────────────┐
│                  🔍 Ingredient Extractor                           │
│       Enter any dish name and instantly get all ingredients        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  [🔍 Butter Chicken                              ] [Extract]       │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🍽️ Butter Chicken                    Serves: 4 servings          │
│  ─────────────────────────────────────────────────────────────    │
│  Ingredients:                                                      │
│  ┌─────────────────────────┬──────────────────────┐               │
│  │ Ingredient              │ Quantity             │               │
│  ├─────────────────────────┼──────────────────────┤               │
│  │ Chicken breast          │ 700g                 │               │
│  │ Butter                  │ 3 tablespoons        │               │
│  │ Tomato puree            │ 400ml                │               │
│  │ Heavy cream             │ 150ml                │               │
│  │ Garam masala            │ 2 teaspoons          │               │
│  │ Ginger-garlic paste     │ 2 tablespoons        │               │
│  └─────────────────────────┴──────────────────────┘               │
│                                                                    │
│  📝 Notes: Best served with naan or basmati rice                  │
│                                                                    │
│  [📋 Copy List]              [✨ Generate Recipe with These]       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 📚 My Recipes
```
┌────────────────────────────────────────────────────────────────────┐
│  📚 My Recipe Collection                                           │
│  All your AI-generated recipes saved in one place                  │
│  📖 6 recipes saved                                                │
├──────────────────┬───────────────────┬─────────────────────────────┤
│  🍽️ Garlic Chicken│  🥗 Caesar Salad  │  🍝 Pasta Carbonara         │
│  [Italian][Easy] │  [American][Easy] │  [Italian][Medium]          │
│  ⏱ 30m 🔥 450cal │  ⏱ 15m 🔥 320cal │  ⏱ 25m  🔥 580cal          │
│  [🗑][📋]        │  [🗑][📋]         │  [🗑][📋]                   │
├──────────────────┼───────────────────┼─────────────────────────────┤
│  🥘 Butter Chicken│  🍛 Biryani       │  🧁 Chocolate Cake          │
│  [Indian][Medium]│  [Indian][Hard]   │  [Dessert][Medium]          │
│  ⏱ 45m 🔥 520cal │  ⏱ 90m 🔥 680cal │  ⏱ 60m  🔥 420cal          │
│  [🗑][📋]        │  [🗑][📋]         │  [🗑][📋]                   │
├────────────────────────────────────────────────────────────────────┤
│              Showing 6 of 6 recipes   [Load More]                  │
└────────────────────────────────────────────────────────────────────┘
```

---

### 📤 Knowledge Base — Upload Document
```
┌────────────────────────────────────────────────────────────────────┐
│  📚 Recipe Knowledge Base                                          │
│  Upload cookbooks and recipe books, then ask anything about them   │
├────────────────────────────────────────────────────────────────────┤
│  [📤 Upload Doc] ──→── [🧠 AI Processes] ──→── [💬 Ask Questions] │
├────────────────────────────────────────────────────────────────────┤
│  [📤 Upload Document]  [💬 Ask Document]  [📁 My Documents]        │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  📤 Upload Recipe Document                                         │
│  Supported: PDF, TXT — Max size: 10MB                              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │                    📄                                        │  │
│  │          Drag & drop your recipe document here               │  │
│  │                        or                                    │  │
│  │                  [Browse Files]                              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Selected: 📄 italian-cookbook.pdf  (4.2 MB)  [PDF] [✕ Remove]    │
│                                                                    │
│  ████████████████████████░░░░  78%   Processing document...       │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │              📤 Upload & Process                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

---

### 💬 Knowledge Base — Ask Document
```
┌────────────────────────────────────────────────────────────────────┐
│  💬 Ask Your Recipe Documents                                      │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Search in: [📚 All Documents              ▾]                      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ What ingredients do I need for chocolate lava cake?          │  │
│  │                                                    42 / 500  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  [🔍 Search & Answer]              Ctrl+Enter to search            │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  🔍 Your Question                                                  │
│  "What ingredients do I need for chocolate lava cake?"             │
│                                                                    │
│  🤖 Chef AI Answer                                                  │
│  Based on your uploaded cookbook, here are the ingredients:        │
│  • Dark chocolate (70%) - 200g                                     │
│  • Unsalted butter - 100g                                          │
│  • Eggs - 4 whole + 4 yolks                                        │
│  • Caster sugar - 100g                                             │
│  • Plain flour - 2 tablespoons                                     │
│                                                                    │
│  📚 Sources (2 relevant sections found) — Searched 1 document      │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 📄 italian-cookbook.pdf         🎯 94% relevant              │  │
│  │ "...For the lava cake, you will need dark chocolate..."      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ 📄 italian-cookbook.pdf         🎯 81% relevant              │  │
│  │ "...Melt butter and chocolate together in a bain-marie..."   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  [📋 Copy Answer]                          [🔄 Ask Another]        │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │  Landing  │  │  Chat    │  │  Recipe  │  │  Knowledge   │   │
│  │  Page    │  │  Page    │  │  Studio  │  │  Base (RAG)  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │              │                │           │
│  React 18 + TypeScript + TanStack Query + Zustand + Axios       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP REST API
┌───────────────────────────▼─────────────────────────────────────┐
│                     FastAPI Backend                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │ /api/auth   │  │ /api/chat   │  │    /api/recipes          │ │
│  │  signup     │  │  POST /chat │  │    POST /generate        │ │
│  │  login      │  │  GET /hist  │  │    GET  /extract         │ │
│  │  GET /me    │  │  DELETE     │  │    GET  /my-recipes      │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────────────┘ │
│         │                │                     │                 │
│  ┌──────▼──────────────────────────────────────▼───────────────┐ │
│  │              /api/rag                                        │ │
│  │   POST /upload   POST /ask   GET /documents   DELETE        │ │
│  └──────────────────────────┬──────────────────────────────────┘ │
│                             │                                    │
│  ┌──────────────────────────▼──────────────────────────────────┐ │
│  │                    Services Layer                            │ │
│  │  AuthService  ChatService  RecipeService  RAGService        │ │
│  └──────┬─────────────┬──────────────┬──────────────┬──────────┘ │
└─────────┼─────────────┼──────────────┼──────────────┼────────────┘
          │             │              │              │
   ┌──────▼──────┐  ┌───▼────────┐  ┌─▼──────────┐  ┌▼──────────┐
   │ PostgreSQL  │  │  Groq API  │  │  Groq API  │  │ ChromaDB  │
   │ (Supabase)  │  │  LLaMA 3.3 │  │  LLaMA 3.3 │  │ (Local)   │
   │             │  │  Chatbot   │  │  Recipes   │  │  RAG      │
   │ • users     │  │  + Memory  │  │  + Extract │  │  Vector   │
   │ • recipes   │  └────────────┘  └────────────┘  │  Store    │
   │ • chat_hist │                                   └───────────┘
   │ • documents │
   └─────────────┘
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.10+ | Core language |
| FastAPI | Latest | REST API framework |
| SQLAlchemy | 2.x | ORM (async) |
| asyncpg | Latest | Async PostgreSQL driver |
| LangChain | 0.3+ | LLM orchestration |
| langchain-groq | Latest | Groq integration |
| Groq API (LLaMA 3.3) | Latest | AI model — free |
| ChromaDB | Latest | Vector database (RAG) |
| pypdf | Latest | PDF text extraction |
| passlib[bcrypt] | Latest | Password hashing |
| python-jose | Latest | JWT tokens |
| pydantic-settings | Latest | Config management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.4 | Type safety |
| Vite | 5.3 | Build tool |
| TanStack Query | v5 | Server state, caching |
| Zustand | 4.5 | Global client state |
| Axios | 1.7 | HTTP client |
| React Router | v6 | Client-side routing |
| CSS Modules | — | Scoped styling |
| Web Speech API | Browser | Voice input/output |

### Database & Services
| Service | Purpose |
|---|---|
| Supabase (PostgreSQL) | Main relational database |
| ChromaDB (local) | Vector embeddings for RAG |
| Groq Cloud | Free LLM API (LLaMA 3.3 70B) |

---

## 📁 Project Structure

```
AI-Powered-Cooking-Assistant/
│
├── backend/
│   ├── main.py                        # FastAPI app entry point
│   ├── .env                           # Environment variables
│   ├── requirements.txt               # Python dependencies
│   ├── chroma_db/                     # ChromaDB local storage (auto-created)
│   └── app/
│       ├── core/
│       │   ├── config.py              # Pydantic settings loader
│       │   ├── database.py            # SQLAlchemy async engine
│       │   ├── security.py            # JWT + password hashing
│       │   └── chromadb_client.py     # ChromaDB singleton client
│       ├── models/
│       │   ├── user.py                # Users table ORM
│       │   ├── chat.py                # Chat history table ORM
│       │   ├── recipe.py              # Recipes table ORM
│       │   └── document.py            # Uploaded documents table ORM
│       ├── schemas/
│       │   ├── user.py                # User Pydantic schemas
│       │   ├── chat.py                # Chat Pydantic schemas
│       │   ├── recipe.py              # Recipe Pydantic schemas
│       │   └── rag.py                 # RAG Pydantic schemas
│       ├── routers/
│       │   ├── auth.py                # Auth endpoints
│       │   ├── chat.py                # Chat endpoints
│       │   ├── recipe.py              # Recipe endpoints
│       │   └── rag.py                 # RAG endpoints
│       └── services/
│           ├── auth_service.py        # Auth business logic
│           ├── chat_service.py        # LangChain chatbot logic
│           ├── recipe_service.py      # Recipe generation logic
│           └── rag_service.py         # RAG pipeline logic
│
└── frontend/
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── package.json
    └── src/
        ├── main.tsx                   # React entry point
        ├── App.tsx                    # Routes + providers
        ├── api/
        │   ├── axios.ts               # Axios instance + interceptors
        │   ├── authApi.ts             # Auth API functions
        │   ├── chatApi.ts             # Chat API functions
        │   ├── recipeApi.ts           # Recipe API functions
        │   └── ragApi.ts              # RAG API functions
        ├── store/
        │   ├── authStore.ts           # Zustand: auth state
        │   ├── chatStore.ts           # Zustand: chat state
        │   ├── recipeStore.ts         # Zustand: recipe state
        │   └── ragStore.ts            # Zustand: RAG state
        ├── hooks/
        │   ├── useAuthMutations.ts    # TanStack auth mutations
        │   ├── useChatMutation.ts     # TanStack chat mutation
        │   ├── useChatHistory.ts      # TanStack chat history query
        │   ├── useRecipeMutations.ts  # TanStack recipe mutations
        │   ├── useRecipeQueries.ts    # TanStack recipe queries
        │   ├── useRagMutations.ts     # TanStack RAG mutations
        │   ├── useRagQueries.ts       # TanStack RAG queries
        │   └── useSpeech.ts           # Web Speech API hook
        ├── pages/
        │   ├── LandingPage.tsx        # Public landing page
        │   ├── LoginPage.tsx          # Login form
        │   ├── SignupPage.tsx         # Signup form
        │   ├── ChatPage.tsx           # AI chatbot page
        │   ├── RecipePage.tsx         # Recipe studio page
        │   └── RAGPage.tsx            # Knowledge base page
        ├── components/
        │   ├── layout/
        │   │   └── Navbar.tsx         # Navigation bar
        │   ├── chat/
        │   │   ├── ChatWindow.tsx     # Chat messages container
        │   │   ├── MessageBubble.tsx  # Single message bubble
        │   │   ├── InputBar.tsx       # Text + voice input
        │   │   ├── TypingIndicator.tsx
        │   │   └── SpeakingIndicator.tsx
        │   ├── recipe/
        │   │   ├── RecipeGenerator.tsx
        │   │   ├── IngredientExtractor.tsx
        │   │   ├── RecipeCard.tsx
        │   │   └── MyRecipes.tsx
        │   ├── rag/
        │   │   ├── FileUploader.tsx
        │   │   ├── AskDocument.tsx
        │   │   ├── AnswerCard.tsx
        │   │   └── DocumentList.tsx
        │   └── ui/
        │       ├── Button.tsx
        │       ├── Input.tsx
        │       └── Avatar.tsx
        ├── types/
        │   └── index.ts               # All TypeScript interfaces
        ├── utils/
        │   └── helpers.ts             # Utility functions
        └── styles/
            └── globals.css            # CSS variables + global styles
```

---

## 🚀 Setup & Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- A [Supabase](https://supabase.com) account (free)
- A [Groq](https://console.groq.com) API key (free)

---

### Step 1 — Clone the Repository
```bash
git clone https://github.com/yourusername/AI-Powered-Cooking-Assistant.git
cd AI-Powered-Cooking-Assistant
```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install all dependencies
pip install -r requirements.txt
```

---

### Step 3 — Configure Environment Variables

Create `backend/.env` file:

```env
# ── Database (Supabase) ──────────────────────────────
DATABASE_URL=postgresql+asyncpg://postgres.xxxx:password@aws-0-region.pooler.supabase.com:5432/postgres?ssl=require

# ── JWT Auth ─────────────────────────────────────────
SECRET_KEY=your-super-secret-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# ── Groq AI (Free) ───────────────────────────────────
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── ChromaDB (Local) ─────────────────────────────────
CHROMA_PERSIST_DIR=./chroma_db
```

> Get your **Supabase URL** from: Project Settings → Database → Session Pooler → URI
> Get your **Groq API key** from: [console.groq.com](https://console.groq.com)

---

### Step 4 — Run the Backend

```bash
uvicorn main:app --reload --port 8000
```

✅ You should see:
```
INFO: Application startup complete.
INFO: Uvicorn running on http://127.0.0.1:8000
```

The database tables are created automatically on first startup.

---

### Step 5 — Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Open your browser at: `http://localhost:5173`

---

## 📡 API Endpoints

### 🔐 Authentication — `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | Create new account | ❌ |
| POST | `/api/auth/login` | Login, receive JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |
| PUT | `/api/auth/preferences` | Update diet preference | ✅ |

**Signup Request:**
```json
{
  "full_name": "Nikhil Kushawaha",
  "email": "nikhil@example.com",
  "password": "securepassword123",
  "dietary_preference": "any"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "email": "...", "full_name": "..." },
  "message": "Login successful"
}
```

---

### 💬 Chat — `/api/chat`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/chat` | Send message to Chef AI | ✅ |
| GET | `/api/chat/history/{session_id}` | Get conversation history | ✅ |
| DELETE | `/api/chat/session/{session_id}` | Clear session memory | ✅ |

**Chat Request:**
```json
{
  "session_id": "abc-123-def-456",
  "message": "How do I make pasta carbonara?"
}
```

**Chat Response:**
```json
{
  "reply": "Great choice! Here's how to make pasta carbonara...",
  "session_id": "abc-123-def-456"
}
```

---

### 🍽️ Recipes — `/api/recipes`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/recipes/generate` | Generate recipe from ingredients | ✅ |
| GET | `/api/recipes/extract-ingredients` | Get ingredients for a dish | ✅ |
| GET | `/api/recipes/my-recipes` | Get user's saved recipes | ✅ |
| GET | `/api/recipes/{recipe_id}` | Get single recipe | ✅ |
| DELETE | `/api/recipes/{recipe_id}` | Delete a recipe | ✅ |

**Generate Recipe Request:**
```json
{
  "ingredients": ["chicken", "garlic", "lemon", "olive oil"],
  "cuisine_preference": "Italian",
  "dietary_preference": "non-vegetarian"
}
```

**Generate Recipe Response:**
```json
{
  "id": "uuid",
  "name": "Creamy Garlic Lemon Chicken",
  "description": "A rich and flavorful Italian dish...",
  "ingredients": [
    { "name": "chicken breast", "quantity": "500g" },
    { "name": "garlic", "quantity": "4 cloves" }
  ],
  "instructions": [
    "Step 1: Marinate chicken...",
    "Step 2: Heat olive oil..."
  ],
  "cooking_time": 30,
  "difficulty": "easy",
  "cuisine_type": "Italian",
  "is_vegetarian": false,
  "calories": 450,
  "source": "ai_generated",
  "created_at": "2025-01-15T10:30:00"
}
```

---

### 📚 RAG (Knowledge Base) — `/api/rag`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/rag/upload` | Upload PDF/TXT document | ✅ |
| POST | `/api/rag/ask` | Ask question from documents | ✅ |
| GET | `/api/rag/documents` | List uploaded documents | ✅ |
| DELETE | `/api/rag/documents/{id}` | Delete a document | ✅ |

**Upload:** `multipart/form-data` with `file` field (PDF or TXT, max 10MB)

**Ask Request:**
```json
{
  "query": "What ingredients do I need for chocolate cake?",
  "document_id": null
}
```

**Ask Response:**
```json
{
  "query": "What ingredients do I need for chocolate cake?",
  "answer": "Based on your cookbook, you need: dark chocolate (200g)...",
  "sources": [
    {
      "content": "For the chocolate cake, combine dark chocolate...",
      "document_name": "cookbook.pdf",
      "relevance": 0.94
    }
  ],
  "documents_searched": 1
}
```

---

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  full_name VARCHAR NOT NULL,
  dietary_preference VARCHAR DEFAULT 'any',
  avatar_url VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat history table
CREATE TABLE chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  session_id VARCHAR NOT NULL,
  role VARCHAR NOT NULL,       -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  name VARCHAR NOT NULL,
  description VARCHAR,
  ingredients JSONB NOT NULL,
  instructions JSONB NOT NULL,
  cooking_time INTEGER,
  difficulty VARCHAR,
  cuisine_type VARCHAR,
  is_vegetarian BOOLEAN DEFAULT false,
  calories INTEGER,
  source VARCHAR DEFAULT 'ai_generated',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Uploaded documents table
CREATE TABLE uploaded_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) NOT NULL,
  filename VARCHAR NOT NULL,
  original_filename VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  chunks_count INTEGER DEFAULT 0,
  collection_name VARCHAR NOT NULL,
  status VARCHAR DEFAULT 'processing',
  error_message VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

> **Note:** Tables are created automatically by SQLAlchemy on app startup. You do not need to run these SQL commands manually.

---

## 🧠 How RAG Works

```
1. UPLOAD PHASE
   ┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌──────────┐
   │ PDF/TXT  │───▶│  Extract   │───▶│  Split into  │───▶│  Store   │
   │  File    │    │   Text     │    │  500-char    │    │ ChromaDB │
   └──────────┘    └────────────┘    │   Chunks     │    │ (embed)  │
                                     └──────────────┘    └──────────┘

2. QUERY PHASE
   ┌──────────┐    ┌────────────┐    ┌──────────────┐    ┌──────────┐
   │  User    │───▶│   Embed    │───▶│  Semantic    │───▶│  Top 5   │
   │  Query   │    │   Query    │    │   Search     │    │  Chunks  │
   └──────────┘    └────────────┘    └──────────────┘    └────┬─────┘
                                                              │
   ┌──────────┐    ┌────────────┐                            │
   │  Answer  │◀───│  LLM with  │◀───────────────────────────┘
   │ + Sources│    │  Context   │
   └──────────┘    └────────────┘
```

- **Chunking:** Documents split into 500-character chunks with 50-char overlap
- **Embedding:** ChromaDB's default embedding model converts text to vectors
- **Search:** Cosine similarity finds most relevant chunks for any query
- **Generation:** LLaMA 3.3 70B generates answers grounded in retrieved context
- **Isolation:** Each user's documents stored in separate ChromaDB collection

---

## 🎯 Features Summary

| Feature | Status | Description |
|---|---|---|
| 🔐 JWT Authentication | ✅ | Signup, login, protected routes |
| 💬 AI Cooking Chatbot | ✅ | Context-aware with session memory |
| 🎤 Voice Input/Output | ✅ | Speak questions, hear answers |
| 🍽️ Recipe Generator | ✅ | Ingredients → full AI recipe |
| 🔍 Ingredient Extractor | ✅ | Dish name → structured ingredients |
| 📚 My Recipes | ✅ | Save, view, delete generated recipes |
| 📤 Document Upload | ✅ | PDF/TXT recipe book ingestion |
| 💬 Document Q&A (RAG) | ✅ | Ask questions from your documents |
| 📁 Document Manager | ✅ | View and delete uploaded documents |

---

## 🔧 Common Issues & Fixes

| Error | Fix |
|---|---|
| `No module named 'pypdf'` | `pip install pypdf` |
| `No module named 'email_validator'` | `pip install "pydantic[email]"` |
| `No module named 'langchain.memory'` | Update to LCEL approach (see chat_service.py) |
| `Connect call failed 127.0.0.1:5432` | Update DATABASE_URL in .env with Supabase URL |
| `model decommissioned` | Change model to `llama-3.3-70b-versatile` |
| `SSL error` | Add `?ssl=require` to DATABASE_URL |
| ChromaDB not found | `pip install chromadb` |

---

## 🌱 Environment Variables Reference

```env
# Required — get from Supabase dashboard
DATABASE_URL=postgresql+asyncpg://...

# Required — generate any random 32+ character string
SECRET_KEY=your-secret-key-here

# Do not change these
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Required — get from console.groq.com (free)
GROQ_API_KEY=gsk_...

# Optional — default is ./chroma_db
CHROMA_PERSIST_DIR=./chroma_db
```

---

## 🛣️ Roadmap

- [ ] **Phase 4** — Favorites + Recommendations + Grocery List
- [ ] **Phase 5** — Docker containerization + production deployment
- [ ] Meal planning calendar
- [ ] Nutritional analysis per recipe
- [ ] Recipe sharing between users
- [ ] Admin dashboard with analytics
- [ ] Rate and review recipes
- [ ] Mobile app (React Native)

---

## 👨‍💻 Author

**Nikhil**
- Built with ❤️ for food lovers
- Powered by Groq's free LLaMA 3.3 70B model

---

## 📄 License

This project is licensed under the MIT License.

---

*Made with 🍳 by Chef AI — Because every great meal starts with great code.*
