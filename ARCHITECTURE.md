# Serenity — Architecture & Project Documentation

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
  - [Routing](#routing)
  - [State Management](#state-management)
  - [Data Layer](#data-layer)
  - [Type System](#type-system)
- [Pages](#pages)
- [Components](#components)
- [Hooks](#hooks)
- [Design System](#design-system)
- [Firebase Integration](#firebase-integration)
- [Freemium Model](#freemium-model)
- [Demo Content](#demo-content)
- [Decisions & Learnings](#decisions--learnings)
- [What's Left to Build](#whats-left-to-build)

---

## Overview

Serenity is a meditation app MVP built with React + TypeScript + Vite. It features guided text meditations, progress tracking (streaks, minutes, weekly chart, mood), personalization (goals, experience level, duration), a community feed, and a freemium content gate. Firebase is wired for auth and Firestore, but the current MVP runs entirely on demo data and localStorage.

**User choices that shaped this MVP:**
- Mixed media content (audio + text + video — text-guided implemented first)
- Firebase backend
- Freemium monetization
- Progress tracking + personalization + community
- Lean MVP approach

---

## Tech Stack

| Dependency | Version | Purpose |
|-----------|---------|---------|
| React | 19.2 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 7.3 | Build tool + dev server |
| Firebase | 12.9 | Auth, Firestore, Storage |
| React Router | 7.13 | Client-side routing |
| Lucide React | 0.564 | Icon library |

---

## Project Structure

```
meditation-app/
├── index.html                       # Entry HTML (Inter font, theme-color)
├── package.json
├── tsconfig.app.json                # TS config (ES2023 lib, verbatimModuleSyntax)
├── vite.config.ts
├── .env.example                     # Firebase env var template
└── src/
    ├── main.tsx                     # React entry point
    ├── App.tsx                      # Router + route definitions
    ├── index.css                    # Full design system (~950 lines)
    ├── types/index.ts               # All TypeScript interfaces
    ├── lib/
    │   └── firebase.ts              # Firebase init (auth, db, storage exports)
    ├── contexts/
    │   └── AuthContext.tsx           # Auth provider + user CRUD
    ├── hooks/
    │   ├── useMeditations.ts        # Meditation data + filtering (demo data)
    │   ├── useProgress.ts           # Session tracking (localStorage)
    │   └── useCommunity.ts          # Community posts (in-memory)
    ├── components/
    │   ├── Layout.tsx               # Bottom nav + <Outlet />
    │   └── MeditationCard.tsx       # Reusable meditation card
    └── pages/
        ├── HomePage.tsx             # Dashboard with stats + categories
        ├── ExplorePage.tsx          # Search + category filter
        ├── MeditatePage.tsx         # Guided meditation player
        ├── ProgressPage.tsx         # Stats + weekly bar chart
        ├── CommunityPage.tsx        # Social feed + compose
        └── ProfilePage.tsx          # Personalization + settings
```

---

## Getting Started

```bash
npm install
cp .env.example .env   # Add Firebase project keys
npm run dev             # Starts at localhost:5173
```

The app works fully without Firebase keys — demo data is baked in and progress uses localStorage. Firebase is only needed for auth and Firestore persistence.

---

## Architecture

### Routing

All routes are nested under `<Layout>` which provides the bottom navigation bar.

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Dashboard, stats, category sections |
| `/explore` | ExplorePage | Search + filtered grid |
| `/meditate/:id` | MeditatePage | Guided session player |
| `/progress` | ProgressPage | Stats + weekly chart |
| `/community` | CommunityPage | Social feed |
| `/profile` | ProfilePage | Settings + personalization |

### State Management

No external state library. State is managed through:

1. **React Context** — `AuthContext` for user auth state (Firebase)
2. **Custom hooks** — `useMeditations`, `useProgress`, `useCommunity` each manage their own state
3. **localStorage** — Session/progress persistence (`meditation-sessions` key)
4. **Component state** — UI-local state (search, filters, player controls)

**Important:** `AuthContext` exists but is not yet wrapped around the app in `main.tsx` because there are no login/signup pages yet. It's ready to wire up.

### Data Layer

| Data | Current Source | Production Target |
|------|---------------|-------------------|
| Meditations | Hardcoded `DEMO_MEDITATIONS` array | Firestore `meditations` collection |
| Sessions | localStorage | Firestore `sessions` collection |
| Community posts | In-memory `DEMO_POSTS` array | Firestore `posts` collection |
| User profile | Not persisted | Firestore `users` collection |

### Type System

All types live in `src/types/index.ts`:

**Core types:**
- `User` — uid, email, displayName, isPremium, preferences, streak, totalMinutes
- `UserPreferences` — goals, experienceLevel, preferredDuration, preferredTime, favoriteCategories
- `MeditationGoal` — union: stress | sleep | focus | anxiety | self-compassion | mindfulness

**Content types:**
- `Meditation` — id, title, description, category, duration (seconds), thumbnail, isPremium, media, instructor, tags
- `MeditationMedia` — type (audio | video | guided-text), audioUrl?, videoUrl?, textSteps?, backgroundImage?
- `GuidedStep` — timestamp (seconds), instruction (string), duration

**Session types:**
- `Session` — id, meditationId, userId, startedAt, completedAt?, duration (seconds), mood?, notes?
- `DailyProgress` — date, sessions count, totalMinutes, completed boolean

**Community types:**
- `CommunityPost` — id, userId, userName, userPhoto?, content, type (reflection | milestone | tip), likes, createdAt

---

## Pages

### HomePage
- Time-based greeting (morning/afternoon/evening)
- 3-stat row: streak (flame), minutes (clock), sessions (trophy)
- "Recommended for You" horizontal scroll (first 4 free meditations)
- Dynamic category sections with horizontal scroll cards

### ExplorePage
- Search bar filters by title + tags
- 6 category tab buttons (All, Mindfulness, Sleep, Focus, Anxiety, Self-Compassion)
- Grid of `MeditationCard` components
- Empty state message when no results

### MeditatePage
Three distinct states:

1. **Premium Lock** — if `meditation.isPremium` is true, shows lock overlay with upgrade CTA
2. **Active Player** — background image + gradient overlay, guided text instruction (fades between steps), play/pause + skip controls, progress bar, timer
3. **Completion Screen** — session duration, mood picker (4 emoji buttons), "Save & Continue" saves session to progress

**Player internals:**
- 1-second interval timer
- Step index calculated by iterating backwards through `textSteps` to find matching timestamp
- On completion, clears interval and shows completion screen
- Session saved with mood via `useProgress().addSession()`

### ProgressPage
- 2x2 stat grid: streak, total minutes, sessions, this-week minutes
- Weekly bar chart (last 7 days): bar height proportional to max day, filled color if completed
- Empty state card when no sessions exist

### CommunityPage
- Compose toggle (pen icon in header)
- Compose card: type picker (reflection/milestone/tip) + textarea + post button
- Post feed: avatar circle (first initial), author + relative time, type icon, content, like button

### ProfilePage
- Profile header card with avatar + summary stats
- Premium upgrade card (gradient purple, $9.99/mo button)
- Personalization: goal chips (multi-select), duration chips (single-select), experience level chips
- Settings: Reminders toggle, Dark Mode toggle, Sound row
- **Note:** Preferences are local state only — not persisted yet

---

## Components

### Layout (`src/components/Layout.tsx`)
- Bottom navigation bar (fixed, 70px, backdrop-blur)
- 5 nav items: Home, Explore, Progress, Community, Profile
- Uses React Router `NavLink` for active state
- Icons: Home, Play, BarChart3, Users, User (from lucide-react)

### MeditationCard (`src/components/MeditationCard.tsx`)
- Props: `meditation: Meditation`, `compact?: boolean`
- Compact mode: 180-200px wide, for horizontal scroll carousels
- Full mode: 100% width, for grid layouts
- Shows: thumbnail, premium badge (if applicable), title, description (full only), duration, category
- Click navigates to `/meditate/{id}`

---

## Hooks

### useMeditations()
```typescript
returns {
  meditations: Meditation[]
  loading: boolean
  getByCategory(category: string): Meditation[]
  getById(id: string): Meditation | undefined
  getFree(): Meditation[]
  getRecommended(categories: string[]): Meditation[]
}
```
- 300ms simulated fetch delay
- Source: hardcoded `DEMO_MEDITATIONS` (6 items)

### useProgress()
```typescript
returns {
  sessions: Session[]
  addSession(session: Omit<Session, 'id'>): Session
  getStreak(): number
  getTotalMinutes(): number
  getWeeklyProgress(): DailyProgress[]
  getTotalSessions(): number
}
```
- Persists to `localStorage` key `meditation-sessions`
- Streak: counts consecutive days backward from today
- Weekly: builds 7-day array with aggregated session data

### useCommunity()
```typescript
returns {
  posts: CommunityPost[]
  addPost(post: Omit<CommunityPost, 'id' | 'likes' | 'createdAt'>): void
  likePost(postId: string): void
}
```
- In-memory only (resets on refresh)
- New posts prepended to array
- Source: 5 demo posts

---

## Design System

### Colors (CSS Variables)

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#6c63ff` | Brand purple, buttons, active states |
| `--primary-light` | `#8b83ff` | Hover states |
| `--primary-dark` | `#4a42d4` | Gradients |
| `--accent` | `#ff6b9d` | Like button hover |
| `--bg` | `#0f0e17` | Page background |
| `--bg-card` | `#1a1a2e` | Card backgrounds |
| `--bg-card-hover` | `#222240` | Card hover state |
| `--surface` | `#16213e` | Inputs, secondary surfaces |
| `--text` | `#f0ece2` | Primary text |
| `--text-secondary` | `#a0a0b0` | Secondary text |
| `--text-muted` | `#6b6b80` | Muted/disabled text |
| `--success` | `#4ecdc4` | Teal, time icon |
| `--warning` | `#f7b731` | Yellow, sessions icon |
| `--streak` | `#ff6b6b` | Red, streak icon |

### Layout

- Max-width: **480px** (mobile-first)
- Bottom nav: **70px** fixed height with `backdrop-filter: blur(20px)`
- Border radius: 16px (large), 10px (medium), 6px (small)
- Font: **Inter** (400, 500, 600, 700 weights)

### Key Patterns

- **Page transitions:** `fadeIn` animation (0.3s, translateY 8px)
- **Instruction text:** `fadeInstruction` animation (0.6s, scale 0.96→1)
- **Cards:** hover transform `translateY(-2px)` + background lighten
- **Buttons:** primary has `scale(0.98)` on active
- **Responsive:** grid switches to 2-column at 481px+

---

## Firebase Integration

### Setup (`src/lib/firebase.ts`)
Exports three Firebase services:
- `auth` — `getAuth(app)` for authentication
- `db` — `getFirestore(app)` for database
- `storage` — `getStorage(app)` for file storage

### AuthContext (`src/contexts/AuthContext.tsx`)
Ready but **not yet mounted** in the component tree.

Provides:
- `signIn(email, password)` — Firebase email auth
- `signUp(email, password, name)` — Creates auth user + Firestore user doc with default preferences
- `signOut()` — Clears auth state
- `updatePreferences(partialPrefs)` — Merges and writes to Firestore
- `onAuthStateChanged` listener for session persistence

**Firestore user doc structure** matches the `User` type exactly.

### Environment Variables (.env)
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## Freemium Model

### Current Implementation
- 4 free meditations, 2 premium-locked (Anxiety Relief, Self-Compassion Practice)
- Premium meditations show a full-screen lock overlay with:
  - Lock icon
  - "Premium Content" header
  - "Upgrade to Premium" CTA → navigates to `/profile`
- Profile page has a premium card: "Upgrade — $9.99/mo"
- `User.isPremium` boolean in the type system

### What's Missing
- No actual payment integration (Stripe, RevenueCat, etc.)
- Premium check in MeditatePage is hardcoded: `const isPremiumLocked = meditation.isPremium` — should check `user.isPremium` when auth is wired

---

## Demo Content

### 6 Meditations

| # | Title | Category | Duration | Premium | Instructor | Tags |
|---|-------|----------|----------|---------|------------|------|
| 1 | Morning Calm | Mindfulness | 10 min | No | Maya Chen | morning, breathing, beginner |
| 2 | Deep Sleep Journey | Sleep | 15 min | No | James Park | sleep, body-scan, evening |
| 3 | Focus Flow | Focus | 8 min | No | Maya Chen | focus, concentration, intermediate |
| 4 | Anxiety Relief | Anxiety | 12 min | Yes | Dr. Sarah Kim | anxiety, grounding, emergency |
| 5 | Self-Compassion Practice | Self-Compassion | 10 min | Yes | Dr. Sarah Kim | self-compassion, loving-kindness, emotional |
| 6 | Walking Meditation | Mindfulness | 10 min | No | James Park | walking, mindfulness, outdoor, beginner |

All use Unsplash images for thumbnails and backgrounds.

### 5 Community Posts

| Author | Type | Likes | Content summary |
|--------|------|-------|-----------------|
| Sarah M. | Milestone | 24 | 30-day streak achievement |
| Alex T. | Tip | 18 | Walking meditation during lunch |
| Jordan L. | Reflection | 31 | Anxiety relief helped in a meeting |
| Priya K. | Milestone | 42 | 100 total minutes this week |
| Marcus W. | Reflection | 15 | New to meditation, day 3 |

---

## Decisions & Learnings

### TypeScript Configuration
- `verbatimModuleSyntax: true` requires `type` keyword for type-only imports: use `import type { X }` or separate import statements
- `erasableSyntaxOnly: true` means `useRef()` with no argument fails — must pass initial value: `useRef<T | undefined>(undefined)`
- Bumped `lib` to `ES2023` to access `findLastIndex` — but ultimately replaced it with a manual loop for cleaner compatibility
- When renaming types to avoid conflicts (e.g., Firebase `User` vs app `User`), use `import type { User as AppUser }` — be careful with find-and-replace not catching compound names like `FirebaseUser` → `FirebaseAppUser`

### Architecture Decisions
- **No state library** — React hooks + Context is sufficient for this MVP scope. Zustand or Jotai would be the next step if state gets complex.
- **localStorage for progress** — Fastest path to persistence without requiring Firebase setup. Migration path: swap `localStorage` calls for Firestore `addDoc`/`getDocs`.
- **CSS over CSS-in-JS** — Single `index.css` with CSS variables keeps the build simple and the design system in one file. Works well at this scale.
- **Demo data in hooks** — Data is hardcoded in the hook files rather than separate JSON. Makes it easy to swap for Firestore queries later by just changing the `useEffect` internals.
- **AuthContext not mounted** — Deliberately left out of `main.tsx` because there are no login/signup pages yet. Mounting it without Firebase keys would cause initialization errors.

### Design Decisions
- **480px max-width** — Mobile-first, single-column layout. Meditation apps are phone-first.
- **Dark theme by default** — Aligns with meditation/calm UX. Dark mode toggle exists on profile but isn't wired to actually change CSS variables yet.
- **Bottom nav over sidebar** — Standard mobile app pattern. 5 tabs is the max for thumb-friendly navigation.
- **Guided text over audio** — Fastest MVP path. The `MeditationMedia` type already supports `audio` and `video` types for future expansion.

### Things to Watch
- `useMeditations` returns new array references on every render (no memoization). Fine for 6 items, would need `useMemo` at scale.
- `useProgress` reads/writes localStorage synchronously on every `addSession` call. Consider debouncing or batching if session frequency increases.
- Community posts reset on page refresh (in-memory only). Users will expect persistence.
- The player timer uses `setInterval` — if the tab is backgrounded, the timer may drift. Consider using `requestAnimationFrame` or comparing `Date.now()` deltas for accuracy.
- Premium gate check is `meditation.isPremium` directly — needs to factor in `user.isPremium` once auth is connected.

---

## What's Left to Build

### Must-Have (Before Launch)
- [ ] Firebase project creation + `.env` configuration
- [ ] Login/Signup pages + wire `AuthProvider` into `main.tsx`
- [ ] Persist sessions to Firestore (replace localStorage)
- [ ] Persist community posts to Firestore (replace in-memory)
- [ ] Wire profile preferences to Firestore via `updatePreferences()`
- [ ] Premium gate: check `user.isPremium` instead of just `meditation.isPremium`
- [ ] Payment integration (Stripe Checkout or RevenueCat)

### Should-Have
- [ ] Audio media support in the player (add `<audio>` element, sync with guided text)
- [ ] Video media support (background video or instructional clips)
- [ ] Dark mode toggle actually switches CSS variables
- [ ] Push notification reminders (Firebase Cloud Messaging)
- [ ] Onboarding flow (collect preferences on first launch)
- [ ] "Recommended for You" algorithm using user preferences

### Nice-to-Have
- [ ] Social features: follow users, comment on posts
- [ ] Meditation favorites/bookmarks
- [ ] Custom meditation timer (unguided, just a bell)
- [ ] Offline support (service worker + cached content)
- [ ] Analytics dashboard (meditation trends over months)
- [ ] Accessibility audit (screen reader, reduced motion)
