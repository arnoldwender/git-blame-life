# AGENTS.md — AI Agent Guidelines

## Repository Context

This is **Git Blame: Life Edition**, a React + TypeScript humor app that parodies `git blame` for life problems. The codebase is small (~15 files), client-side only, and uses Vite + Tailwind CSS.

## Working with This Codebase

### Before Making Changes

1. Run `npm run typecheck` to verify the project type-checks cleanly
2. Run `npm run lint` to check for linting issues
3. Run `npm run build` to ensure the project builds successfully

### Code Style

- Use TypeScript with strict mode enabled
- Use functional React components (no class components)
- Style with Tailwind CSS utility classes only — no inline styles or CSS modules
- Follow existing naming patterns: PascalCase for components, camelCase for utilities
- Keep components in `src/components/`, data in `src/data/`, utilities in `src/utils/`

### Adding Features

- New culprits, blame lines, or problems go in `src/data/blame.ts`
- New UI components go in `src/components/` as separate files
- New utility functions go in `src/utils/`
- Update `App.tsx` for any new state or phase logic

### Custom Tailwind Theme

The project extends Tailwind with a custom theme in `tailwind.config.js`:
- Colors: `blame-bg`, `blame-dark`, `blame-primary`, `blame-glow`
- Font: JetBrains Mono monospace
- Animations: `blink`, `scandown`, `fadein`

### Known Considerations

- `@supabase/supabase-js` is installed but unused — safe to remove or integrate
- `lucide-react` is installed but not actively imported — available for icon needs
- No test framework is configured — use Vitest if adding tests
- No routing library — single-page app with phase-based UI
- The app is fully client-side with no API calls or environment variables needed
