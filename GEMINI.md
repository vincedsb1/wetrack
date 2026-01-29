# Rituels de Notes (WeTrack) - Project Context

## Project Overview

**Rituels de Notes** (internal name: WeTrack) is a Progressive Web App (PWA) designed to help users track rituals through recurring questionnaires. Users can define rituals with specific participants, questions, scales, and frequencies. The app provides visual analytics of the data over time and operates on an offline-first architecture.

## Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS 4
*   **State Management:** Zustand
*   **Persistence:** IndexedDB (Native API wrapper)
*   **Charts:** Recharts
*   **Icons:** Lucide React
*   **PWA:** Service Worker (offline caching), Manifest

## Architecture & State Management

### Offline-First Logic
The application is designed to function entirely without a network connection.
*   **Source of Truth:** IndexedDB (`rituals` store) is the persistent source of truth.
*   **State Sync:** The `useRitualsStore` (Zustand) loads data from IndexedDB on initialization and keeps the UI in sync. Every mutation (create, update, delete) updates both IndexedDB and the local Zustand state.
*   **No Backend:** There is no server-side database. All data lives on the client device.

### State Stores (`/store`)
*   **`rituals.store.ts`**: Handles business logic and persistent data (CRUD for rituals/entries, import/export).
*   **`ui.store.ts`**: Handles ephemeral UI state (modals, active chart views, wizard progress).

### Feature-Based Structure (`/features`)
The codebase uses a feature-based architecture to group related components and logic:
*   **`rituals/`**: Ritual creation, list views, cards.
*   **`entries/`**: Entry history, detail tables.
*   **`wizard/`**: The step-by-step answering flow.
*   **`charts/`**: Visualization logic and components.
*   **`settings/`**: Import/Export functionality.

## Directory Structure

```
/
├── app/                  # Next.js App Router pages
│   ├── rituals/          # Ritual-specific routes
│   ├── settings/         # Settings & Data management
│   ├── PWAInit.tsx       # Service Worker registration
│   └── layout.tsx        # Root layout
├── features/             # Feature modules (Components & Hooks)
│   ├── charts/
│   ├── entries/
│   ├── layout/
│   ├── rituals/
│   ├── settings/
│   └── wizard/
├── lib/                  # Shared utilities and core logic
│   ├── db/               # IndexedDB wrapper
│   ├── export-import.ts  # Merge logic for JSON data
│   ├── types.ts          # Centralized TypeScript interfaces
│   └── constants.ts      # App-wide constants (Scales, Colors, etc.)
├── store/                # Zustand state definitions
└── public/               # Static assets & PWA manifest
```

## Key Workflows

### Data Model
*   **Ritual:** Contains configuration (title, participants, questions, frequency) and a list of **Entries**.
*   **Entry:** A completed session containing responses for *all* participants and *all* questions. Partial entries are not persisted.

### Import / Export
*   **Format:** JSON.
*   **Logic:** Implemented in `lib/export-import.ts`.
*   **Merge Strategy:** 
    *   New rituals (by ID) are added.
    *   Existing rituals are merged (smart union of participants/questions).
    *   Entries are merged by ID (local version preferred on collision).
    *   `updatedAt` timestamps are used to resolve conflicts.

### Charting
*   **Library:** Recharts.
*   **Modes:**
    1.  Per Person (Specific Question)
    2.  Per Person (Average)
    3.  Global Average (Per Question)
    4.  Global Average (Overall)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Coding Conventions

*   **Strict Typing:** Always use types from `lib/types.ts`. Avoid `any`.
*   **Immutability:** Treat IndexedDB data as the source of truth; do not mutate state directly.
*   **Tailwind:** Use utility classes for styling.
*   **Components:** Keep components small and focused. Use `features/` for domain-specific components.
