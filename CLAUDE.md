# git-blame-life — contributor notes

## Project

- Humour web app (React 18 + Vite + Tailwind 3), deployed on Netlify from `main` (`npm run build` → `dist/`).
- Live: <https://git-blame-life.netlify.app>

## Rules

- **No third-party requests.** Fonts are self-hosted via `@fontsource/*`; never re-add Google Fonts or other CDN assets.
- **Legal pages** are static files: `public/impressum/index.html` and `public/datenschutz/index.html`, linked from the
  app footer. If you add a feature that stores data in the browser or contacts a third party, update the
  Datenschutzerklärung in the same change.
- `localStorage` (`git-blame-life-achievements`, `git-blame-life-counts`) is written only after a user action, never
  on page load.
