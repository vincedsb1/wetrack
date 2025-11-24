# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rituels de Notes** is a PWA (Progressive Web App) for tracking ritual questionnaires with scores, history, and analytics.

**Tech Stack**:
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: React 19 with Tailwind CSS 4
- **State Management**: Zustand (lightweight, testable)
- **Persistence**: IndexedDB (offline-first, no backend)
- **Charts**: Recharts (4 chart modes)
- **Icons**: Lucide React
- **Linting**: ESLint 9 (flat config)

## Build and Development Commands

```bash
# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
npm run lint -- --fix
```

## Project Structure

```
app/                          # Next.js App Router pages
  (home)/                     # Home route group
    page.tsx
  rituals/
    new/                      # Create ritual
      page.tsx
    [ritualId]/               # Ritual detail
      page.tsx
      answer/                 # Answer wizard
        page.tsx
      entries/
        [entryId]/            # Entry detail table
          page.tsx
  settings/                   # Export/Import
    page.tsx
  layout.tsx                  # Root layout (metadata, PWA init)
  PWAInit.tsx                 # Service Worker registration
  globals.css                 # Global Tailwind styles

features/                     # Feature-based organization
  rituals/
    components/               # RitualCard, CreateRitualForm
    types.ts (if feature-specific)
  entries/
    components/               # EntryDetailTable
  wizard/
    components/               # AnswerWizard
  charts/
    components/               # LineChartPanel (Recharts)
    hooks/                    # useChartData, useChartLines
  settings/
    components/               # ExportImportPanel

lib/                          # Shared utilities
  types.ts                    # Ritual, Participant, Question, Entry, Response, ExportData
  constants.ts                # SCALES, FREQUENCIES, COLORS, DB_NAME
  date.ts                     # formatDate, formatDateShort, getRelativeDateStatus
  export-import.ts            # mergeRituals, generateExportData, downloadExport, validateImportFile
  db/
    index.ts                  # DB wrapper (IndexedDB API)

store/                        # Zustand stores (global state)
  rituals.store.ts            # Ritual CRUD, import, export, loading
  ui.store.ts                 # View, notifications, graph settings, wizard state

public/                       # Static assets
  manifest.json               # PWA manifest (name, icons, display)
  sw.js                       # Service Worker (offline caching)
  icon-*.png                  # PWA icons (192x192, 512x512, maskable)
  apple-touch-icon.png        # iOS home screen icon
```

## Key Architecture Decisions

### State Management (Zustand)
- **`useRitualsStore`**: Business logic (CRUD, import/export, persisted via IndexedDB)
  - Actions: `loadRituals`, `createRitual`, `deleteRitual`, `addEntry`, `deleteEntry`, `importRituals`, `getRitualById`
  - State: `rituals[]`, `loading`, `error`
- **`useUIStore`**: UI state (views, notifications, graph modes, wizard state)
  - No persistence (ephemeral)

### Offline-First Architecture
- **IndexedDB (`lib/db/index.ts`)**: Single "rituals" store with complete ritual objects
  - All data loaded on app init
  - Every mutation updates IndexedDB + Zustand
  - No network calls for data
- **Service Worker (`public/sw.js`)**:
  - Cache-first for static assets (.js, .css, images)
  - Network-first for pages with cache fallback
  - Precaches `/` and manifest on install

### Import/Export Merge Logic
`lib/export-import.ts` implements spec 6.2:
- Rituals: union by id, new ones added as-is
- Participants: union by id
- Questions: union by id, sorted by order
- Entries: union by id, ignore duplicates, sort by date
- `updatedAt`: max(local, imported)

### Chart Modes (via `features/charts/hooks/useChartData.ts`)
1. **Mode 1**: Per person, specific question (line per participant)
2. **Mode 2**: Per person, average (line per participant)
3. **Mode 3**: Global average per question (single line)
4. **Mode 4**: Global average overall (single line)

### TypeScript
Centralized types in `lib/types.ts`:
- `Ritual`, `Participant`, `Question`, `Entry`, `Response`
- `ExportData` (for JSON format)
- `UIState`, `GraphSettings`, `WizardState`

## Data Model

All data serializable to JSON:
```typescript
Ritual = {
  id, title, scale (5|10|20|100), frequency (daily|weekly|monthly),
  participants: Participant[],
  questions: Question[],
  entries: Entry[],
  createdAt, updatedAt
}

Entry = {
  id, ritualId, createdAt (ISO date),
  responses: Response[]  // Always complete (all Q * all P)
}

Response = {
  questionId, participantId, value (1..scale)
}
```

## PWA Configuration

- **Manifest**: `public/manifest.json`
  - Display: `standalone` (fullscreen app-like)
  - Icons: 192x192, 512x512, maskable variants
  - Theme color: `#2563eb` (blue)
- **Service Worker**: `public/sw.js` (registered in `PWAInit.tsx`)
- **iOS**: `apple-touch-icon.png`, `statusBarStyle`, metadata in layout
- **Android**: Uses manifest icons, splash screens auto-generated

## Important Rules

- **No API calls**: Everything is IndexedDB. No backend.
- **Offline by design**: App must work without internet.
- **Immutable scales/frequencies**: Set at ritual creation, never change.
- **Complete entries only**: Wizard doesn't persist partial responses.
- **No edit after creation**: Can't edit participants, questions, scale, frequency.
- **Mobile-first**: 44px+ touch targets, max-w-md layouts.

## Common Tasks

### Add a new chart mode
1. Update `lib/types.ts` GraphSettings mode union (e.g., add `5`)
2. Add branch in `useChartData` hook
3. Update mode select in ritual detail page

### Modify import/export logic
Edit `lib/export-import.ts` merge functions per spec 6.2.

### Change styling
- Tailwind in `app/globals.css`
- Component-level Tailwind classes in JSX
- CSS variables for themes in `globals.css`

### Add new feature
1. Create folder in `features/`
2. Organize: `components/`, `hooks/`, `utils/`, `types.ts`
3. Create pages in `app/`
4. Use Zustand stores for state
5. Follow existing patterns (e.g., `features/rituals/`)
