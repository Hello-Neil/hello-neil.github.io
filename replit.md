# Helloneil Language Learning App

## Overview

Helloneil is an AI-powered language learning application inspired by Duolingo's gamification approach. The platform enables users to learn multiple languages (Spanish, French, Japanese, German, Korean, English) through dynamically generated lessons powered by Google's Gemini AI. The application features a gamified progression system with XP tracking, level advancement, and streak monitoring to maintain user engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack React Query for server state management and caching

**UI Component System**
- Shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Design system follows Duolingo-inspired principles: playful gamification, friendly typography (Nunito font), and clear visual feedback
- Custom theming with CSS variables for light/dark mode support

**State Management Pattern**
- Server state managed through React Query with infinite stale time for cached lessons
- Local state via React hooks for component-level UI state
- LocalStorage for persisting selected language across sessions
- No global state management library - relying on React Query's cache and URL state

### Backend Architecture

**Server Framework**
- Express.js REST API with TypeScript
- ESM module system for modern JavaScript features
- Session management prepared with connect-pg-simple (PostgreSQL session store)

**API Design**
- RESTful endpoints for progress tracking and lesson retrieval
- `/api/progress/:language` - Retrieve/create user progress per language
- `/api/lesson/:language/:lessonNumber` - Fetch AI-generated lessons
- `/api/lesson/complete` - Submit lesson completion and update progress
- Demo user system ("demo-user") with in-memory storage fallback

**Data Storage Strategy**
- Drizzle ORM configured for PostgreSQL with type-safe schema definitions
- In-memory storage implementation (MemStorage) as development fallback
- Database schema supports users, user progress per language, and lesson completion tracking
- Progress includes: current level, XP, streak count, last practice date, completed lessons array

**AI Integration - Google Gemini**
- Gemini 2.5-flash model for dynamic lesson generation
- Structured prompt engineering to generate consistent lesson formats
- Question types: multiple choice (4 options), fill-in-the-blank, translation
- Difficulty scaling based on level (1-2 basic, 3-5 common expressions, 6-10 intermediate, 11+ advanced)
- 5 questions per lesson with explanations for educational value

**Gamification Logic**
- XP rewards: 10 XP per correct answer, 50 XP lesson completion bonus
- Level progression: Every 5 lessons advances one level
- Heart system: 5 hearts per lesson, deducted on wrong answers
- Streak tracking based on daily practice (last practice date comparison)

### External Dependencies

**Third-Party Services**
- **Google Gemini AI API** - Generates personalized language lessons dynamically based on user level and lesson number. Requires `GEMINI_API_KEY` environment variable.
- **Neon Database (PostgreSQL)** - Serverless PostgreSQL via `@neondatabase/serverless` driver. Configured through `DATABASE_URL` environment variable. Used for persistent storage of users, progress, and lesson completion.

**Key NPM Packages**
- `@google/genai` - Official Gemini AI SDK for lesson content generation
- `drizzle-orm` & `drizzle-kit` - Type-safe ORM and migration toolkit
- `@tanstack/react-query` - Server state management and data fetching
- `wouter` - Minimal routing library
- `react-hook-form` with `@hookform/resolvers` - Form handling with Zod validation
- `date-fns` - Date manipulation for streak calculations
- `zod` & `drizzle-zod` - Runtime schema validation
- Full Radix UI component suite for accessible UI primitives

**Development Tools**
- Replit-specific plugins for runtime error handling and development experience
- TypeScript strict mode for type safety
- PostCSS with Tailwind and Autoprefixer for CSS processing