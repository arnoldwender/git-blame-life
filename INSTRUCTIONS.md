# INSTRUCTIONS.md — Development Guide

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Available Scripts

| Command            | Description                                |
| ------------------ | ------------------------------------------ |
| `npm run dev`      | Start Vite dev server with HMR             |
| `npm run build`    | Build for production (output: `dist/`)     |
| `npm run preview`  | Serve the production build locally         |
| `npm run lint`     | Run ESLint across the project              |
| `npm run typecheck`| Run TypeScript compiler in check-only mode |

## Development Workflow

1. Make changes in `src/`
2. Vite HMR applies changes instantly in the browser
3. Run `npm run lint` and `npm run typecheck` before committing
4. Run `npm run build` to verify the production build works

## Adding Content

### New Blame Culprits

Edit `src/data/blame.ts` and add entries to the `culprits` array:

```typescript
{ name: 'your-new-culprit', email: 'culprit@blame.dev', time: 'since forever' }
```

### New Blame Lines

Add entries to the `blameLines` array in `src/data/blame.ts`:

```typescript
{ hash: 'abc1234', change: 'description of the blame', severity: 'critical' | 'high' | 'medium' }
```

### New Problem Suggestions

Add strings to the `problems` array in `src/data/blame.ts`.

## Project Configuration

- **TypeScript**: `tsconfig.app.json` — strict mode, ES2020 target, React JSX
- **Vite**: `vite.config.ts` — React plugin, lucide-react excluded from dep optimization
- **Tailwind**: `tailwind.config.js` — custom colors, fonts, and animations
- **ESLint**: `eslint.config.js` — TypeScript + React hooks + React Refresh rules
- **PostCSS**: `postcss.config.js` — Tailwind CSS + Autoprefixer

## Deployment

Build the project and deploy the `dist/` directory to any static hosting service:

```bash
npm run build
```

Compatible with Netlify, Vercel, GitHub Pages, Cloudflare Pages, or any static file server.
