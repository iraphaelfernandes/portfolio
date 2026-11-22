# Portfolio

Angular standalone application with SSR-based prerendering and static output for Cloudflare Pages.

## Requirements

Use the Node.js version pinned in `.nvmrc`.

## Local development

From this directory:

```bash
npm ci
npm start
```

The development server is available at `http://localhost:4200/`.

## Validation

```bash
npm run format:check
npm run lint
npm test -- --watch=false
npm run build
npx playwright install chromium
npm run e2e
```

The production build prerenders the configured routes to `dist/portfolio/browser`.

## Cloudflare Pages

Connect the repository to Cloudflare Pages using Git integration. Since this Angular app lives in `portfolio/`, configure:

- Root directory: `portfolio`
- Build command: `npm run build`
- Build output directory: `dist/portfolio/browser`
- Environment variable: `NODE_VERSION=26.13.1`

Cloudflare Pages Git integration handles production deployments from `main` and preview deployments for pull requests. The first live deployment requires connecting the repository and Pages project in the Cloudflare dashboard.
