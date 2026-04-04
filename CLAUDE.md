# CLAUDE.md — Instructions for Claude Code

## Project Overview

Git Blame: Life Edition is a React + TypeScript single-page app built with Vite. It's a humorous parody of `git blame` that attributes life problems to absurd culprits. The app is entirely client-side with no backend.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (outputs to dist/)
npm run preview    # Serve production build locally
npm run lint       # ESLint check
npm run typecheck  # TypeScript type-check (tsc --noEmit)
```

## Architecture

- **Entry point**: `src/main.tsx` renders `<App />` into `#root`
- **State management**: Local React state in `App.tsx` — no external state library
- **Three phases**: `idle` → `blaming` → `done`, controlled by `phase` state
- **Animation**: `setInterval` drives sequential rendering of terminal logs and blame lines
- **Data**: All blame data (culprits, lines, problems, logs) lives in `src/data/blame.ts`
- **Utilities**: `src/utils/glitch.ts` provides text glitch effects and severity color mapping
- **Styling**: Tailwind CSS with custom theme extensions in `tailwind.config.js`

## Key Conventions

- All components are functional React components with TypeScript
- Styling is done exclusively with Tailwind utility classes (no CSS modules)
- Custom colors use the `blame-*` prefix defined in the Tailwind config
- Animations (`blink`, `scandown`, `fadein`) are defined in `tailwind.config.js`
- The project uses ES modules (`"type": "module"` in package.json)

## File Layout

```
src/
├── App.tsx              # Main app logic and phase orchestration
├── components/          # All UI components (Header, BlameInput, TerminalLog, etc.)
├── data/blame.ts        # Static data arrays for culprits, blame lines, problems, logs
└── utils/glitch.ts      # Utility functions (glitchText, severityColor)
```

## Things to Know

- Supabase JS is installed as a dependency but **not currently used** — it can be removed or used for future features
- Lucide React is installed but not actively imported in any component
- The CRT overlay effect (`CRTOverlay.tsx`) uses fixed positioning and pointer-events-none
- No tests exist yet — consider adding Vitest if tests are needed
- No routing — this is a single-page, single-view app
