# Wayfare — AI Dynamic Trip Planner (Prototype)

A single-file React prototype (state via Context API, Tailwind CSS, `lucide-react` icons)
covering the full flow: Auth → Profile Manager → Discovery Dashboard → Custom Trip Planner
Wizard → Output Workspace with a Travel Operations Cockpit, AI Copilot, Bucket List drawer,
and Trip Summary / Share Hub.

## Requirements

- Node.js 18+ (Node 20 recommended)
- npm 9+

## Setup

```bash
npm install
```

## Run in development

```bash
npm run dev
```

Vite will print a local URL (typically `http://localhost:5173`) — open it in your browser.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` outputs static files to `dist/`. `npm run preview` serves that build locally
so you can sanity-check the production bundle before deploying anywhere.

## Project structure

```
trip-planner/
├── index.html            # Vite entry HTML
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── src/
    ├── main.jsx           # React root mount
    ├── index.css          # Tailwind directives
    └── App.jsx            # The entire prototype (single-file, as designed)
```

## Notes

- All app state (profiles, active trip, navigation, route stops, wishlist, etc.) lives in a
  single React Context provider inside `App.jsx` — no routing library, no external state
  management dependency.
- Tailwind's default color palette is used as-is (including extended shades like `sky-950`,
  `zinc-950`); no custom theme extension is required.
- Everything is mock data — there are no real network calls, and the "AI Copilot" responses
  are simple keyword-matched simulations, not a live model call.
