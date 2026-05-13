# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Daily Cash** is a Next.js 14 (App Router) financial dashboard for freelancers. Stack: TypeScript, Supabase (auth + PostgreSQL), Zustand, Tailwind CSS, shadcn/ui.

### Auth & Data Flow

1. Unauthenticated users land on `/login` (route group `(auth)`)
2. After login, redirected to `(dashboard)` routes — protected via `src/middleware.ts`
3. `src/components/layout/DataLoader.tsx` checks session on mount and calls `useStore.fetchData(userId)`
4. All app state lives in `src/store/useStore.ts` (Zustand) — tasks, clients, revenues, user profile
5. Store does optimistic updates with rollback on Supabase errors

### Route Groups

- `src/app/(auth)/` — login, register, forgot-password (public)
- `src/app/(dashboard)/` — all protected pages (layout wraps with Sidebar + Topbar + DataLoader + OnboardingGuide)

### Supabase Clients

- `src/utils/supabase/client.ts` — browser client (for client components)
- `src/utils/supabase/server.ts` — server client (for server components / middleware)
- Always use the correct client based on render context

### Data Models (Supabase tables)

```typescript
Task:     { id, user_id, text, completed, category, status }
          category: "Prospection" | "Production" | "Contenu" | "Apprentissage"
          status: "todo" | "in-progress" | "done"

Client:   { id, user_id, name, email, phone, status, amount }
          status: "Prospect" | "Contacté" | "En discussion" | "Client"

Revenue:  { id, user_id, client, amount, date, status, note }
          status: "Payé" | "En attente" | "Annulé"

UserProfile: { id, name, email, avatar, goal, currency }
```

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Design System Rules

The app uses a dark-mode-first premium aesthetic with emerald green accents. All new components **must** follow these rules:

### Colors & Theme
- Background: `bg-background` (deep blue-black)
- Cards/containers: `bg-card border border-border/50`
- Accent/primary: emerald green — use `text-primary`, `bg-primary`, `bg-primary/10` for icon backgrounds and badges
- Primary text: `text-foreground font-bold` or `font-semibold`
- Secondary text: `text-muted-foreground text-sm` or `text-xs`

### Shapes & Spacing
- Cards: `rounded-2xl shadow-sm`
- Internal elements (icon containers, badges): `rounded-xl` or `rounded-lg`
- Action buttons and status badges: `rounded-full`
- Subtle glow effects for important elements: absolute div with `bg-primary/5 blur-2xl`

### Libraries
- **Icons**: `lucide-react` only — place inside `bg-primary/10 text-primary p-3 rounded-xl` containers
- **Charts**: `recharts` — axes without lines, subtle grid `stroke="hsl(var(--border))"`, text in `hsl(var(--muted-foreground))`
- **Responsive**: mobile-first with `md:` / `lg:` breakpoints; sidebar hidden on mobile (`hidden md:flex`)

### Code Style
- Add `"use client"` only when required (state hooks, Recharts, event handlers)
- No raw CSS — use Tailwind utilities or existing CSS variables from `globals.css`
- Layout with `flex items-center justify-between` or `grid gap-6`

### Design Philosophy
The design must never look generic. Always: premium, minimal, serious (financial tool) with vibrant emerald micro-details.
