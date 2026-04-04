# Git Blame: Life Edition

> v6.6.6 — IT'S NEVER YOUR FAULT. PROBABLY.

A humorous, interactive web app that parodies `git blame` by applying it to life problems. Enter a personal issue, watch a simulated terminal analysis, and discover who's *really* to blame — your ex, past you, society, or Mercury retrograde.

## Features

- **Interactive blame analysis** — Type a life problem or pick from suggestions, then run `git blame`
- **Animated terminal simulation** — Sequential log output mimics a real terminal session
- **Randomized blame reports** — Each run generates unique blame lines with commit hashes, culprits, and severity levels
- **Blame distribution summary** — Visual breakdown of blame percentages across categories
- **Retro CRT effects** — Scan lines, vignette, and glitch text for a cyberpunk aesthetic
- **Fully client-side** — No backend or API calls required

## Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React 18 + TypeScript                  |
| Build Tool   | Vite 5                                 |
| Styling      | Tailwind CSS 3 + PostCSS + Autoprefixer |
| Icons        | Lucide React                           |
| Font         | JetBrains Mono (via Google Fonts)       |
| Linting      | ESLint 9 + TypeScript ESLint           |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/arnoldwender/git-blame-life.git
cd git-blame-life
npm install
```

### Development

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run typecheck  # Type-check without emitting
```

## Project Structure

```
src/
├── App.tsx              # Main component — state management and animation sequencing
├── main.tsx             # React entry point
├── index.css            # Global styles with Tailwind directives
├── components/
│   ├── Header.tsx       # Title with glitch effect and feature badges
│   ├── BlameInput.tsx   # Problem input field with suggestions
│   ├── TerminalLog.tsx  # Animated terminal output
│   ├── BlameReport.tsx  # Generated blame lines with severity
│   ├── BlameSummary.tsx # Blame distribution bars and stats
│   └── CRTOverlay.tsx   # CRT monitor scan line effects
├── data/
│   └── blame.ts         # Culprits, blame lines, problems, terminal logs
└── utils/
    └── glitch.ts        # Glitch text effect and severity color mapping
```

## How It Works

1. **Idle** — User sees the header, suggested problems, and an input field
2. **Input** — User types a problem or clicks a suggestion
3. **Blaming** — Terminal logs appear sequentially (250ms), then blame lines animate in (200ms)
4. **Results** — Summary shows top culprit, blame distribution, and a reset button

Blame is randomly distributed across four categories: Your Ex, Past You, Society, and Mercury Retrograde.

## License

This project is provided as-is for educational and entertainment purposes.
