# Muhammad Ashir Hadi — Portfolio v2

React + TypeScript + Vite portfolio with a Three.js smart-building visual, responsive layout, SEO metadata and an interactive chiller-plant training simulator.

## Local setup
```bash
npm install
npm run dev
npm run build
```

## GitHub Pages deployment
The included GitHub Actions workflow builds `dist` on pushes to `main` and deploys it to GitHub Pages. Vite is configured with `/portfolio/` as its base path.

Keep the existing repository assets in the root:
- `resume.pdf`
- `linkedin-preview.jpg`
- `IMG-20250803-WA0006.jpg` (existing photo; can be wired into the hero after confirming the preferred portrait)

## Accuracy note
The simulator is a front-end demonstration only. It does not connect to Honeywell, Trane, live sensors or plant equipment. Python, SQL and Node.js are labelled as learning technologies, not deployed backend services. GitHub Pages is static hosting; a real API/database backend requires a separate hosted service.
