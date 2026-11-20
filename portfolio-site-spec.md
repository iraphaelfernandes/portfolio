# Portfolio Site: Technical Specification

> Audience: GitHub Copilot (free plan) and the repository owner.
> Read this file fully before generating code. Follow it literally. If something is not specified here, ask the owner instead of inventing it.

---

## 1. Goal

A fast, bilingual (EN/FR) personal portfolio website for a software developer searching for a developer role in France. Recruiters spend a few seconds on it, so it must load instantly, be easy to scan, and link clearly to CV, GitHub, LinkedIn and project case studies.

### Non-goals
- No backend, database, authentication or CMS in this repository.
- No cookie banner (no tracking cookies are allowed, see section 11).
- No UI component libraries (no Angular Material, PrimeNG, Bootstrap, etc.).

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Angular, latest stable at project creation. Standalone components only (no NgModules). |
| Rendering | Angular SSR with **prerender (SSG)** of every route. Output is static files. |
| State | Angular signals. No NgRx. |
| Templates | Built-in control flow (`@if`, `@for`, `@switch`). No `*ngIf` / `*ngFor`. |
| Styling | Tailwind CSS (current stable) + CSS custom properties for design tokens. |
| Behavior primitives | `@angular/cdk` (a11y, overlay, keyboard), unstyled. |
| i18n | Transloco (runtime language switching). |
| Icons | `lucide-angular`. |
| Fonts | `@fontsource/jetbrains-mono`, self-hosted, no external font requests. |
| Markdown | `marked` for rendering, `shiki` for code highlighting. |
| Lint/format | `angular-eslint`, Prettier. |
| E2E | Playwright (smoke tests + axe accessibility check). |
| Hosting | Cloudflare Pages, deployed from GitHub on push to `main`. |

Do not add any other runtime dependency without asking.

---

## 3. Design system

Style keywords: retro, warm, terminal-like, handcrafted, technical. It must **not** look like a generic AI-generated template.

### Rules
- Monospaced typography everywhere (JetBrains Mono). Weights: 400, 500, 700.
- Thin 1px solid borders on cards, inputs and containers.
- **Hard offset shadows** (e.g. `4px 4px 0 var(--border)`), never blurred shadows.
- No gradients, no glow, no glassmorphism, no emoji in UI chrome.
- Small radius (4px to 8px). Pill shape only for badges.
- One accent color (green). Do not introduce a second accent.
- Illustrations are hand-written inline SVG (isometric or flat line style), animated with CSS or the Web Animations API. No illustration libraries.
- Respect `prefers-reduced-motion`: disable non-essential animation.

### Tokens (starting values, tune visually)
Define as CSS custom properties on `:root[data-theme="dark"]` and `:root[data-theme="light"]`.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#1a1713` | `#f4efe4` |
| `--surface` | `#231f1a` | `#fbf7ee` |
| `--border` | `#3a342b` | `#cfc5b0` |
| `--text` | `#e8e1d4` | `#2a251d` |
| `--muted` | `#9a9080` | `#6b6354` |
| `--accent` | `#6fae5b` | `#3f7a34` |
| `--accent-contrast` | `#1a1713` | `#fbf7ee` |

Contrast must meet WCAG AA for all text/background pairs in both themes.

### Spacing and layout
- 4px base unit. Content max width 1100px, centered. Mobile first.
- Breakpoints: Tailwind defaults.

---

## 4. Theme (dark / light)

- Values: `dark` | `light`. Default: follow `prefers-color-scheme`.
- User choice persisted in `localStorage` (key `theme`). Wrap storage access in try/catch.
- Applied as `data-theme` attribute on `<html>`.
- No flash of wrong theme: an inline script in `index.html` sets `data-theme` before first paint.
- Toggle button in the header, with an accessible label, keyboard operable.
- Implement as a `ThemeService` (signal-based).

---

## 5. Internationalization (EN / FR)

- Supported languages: `en`, `fr`. Default: browser language if `fr`, otherwise `en`.
- URL prefix per language: `/en/...` and `/fr/...`. `/` redirects to the detected language.
- Language toggle in the header. Choice persisted in `localStorage` (key `lang`).
- UI strings: Transloco JSON files in `src/assets/i18n/en.json` and `fr.json`. Keys are namespaced (`nav.projects`, `home.hero.title`).
- Long-form content (about, case studies): separate Markdown files per language (see section 7).
- `<html lang>` updates on language change.
- Each page has `hreflang` alternate links and a canonical URL.
- Missing translation must fail the build or a unit test (no silent fallback to keys).

---

## 6. Routes and pages

| Route | Page | Content |
|---|---|---|
| `/:lang` | Home | Hero (name, role, short pitch), featured projects, links (CV, GitHub, LinkedIn). |
| `/:lang/projects` | Projects | Grid of project cards, filter by tag. |
| `/:lang/projects/:slug` | Project detail | Case study rendered from Markdown. |
| `/:lang/about` | About | Short bio, skills, languages, experience timeline. |
| `**` | Not found | Friendly 404 in current language. |

All routes are prerendered. Lazy-load route components.

### Shared layout
- **Header:** logo/name (links home), nav links, language toggle, theme toggle. Collapses to a menu on mobile (CDK overlay, focus trap, Esc closes).
- **Footer:** links (GitHub, LinkedIn, email), copyright year.
- **Skip link** ("Skip to content") as the first focusable element.

### Components (all standalone, `OnPush`)
- `BadgeComponent` (pill: label, variant `default | accent`)
- `ProjectCardComponent`
- `ThemeToggleComponent`, `LanguageToggleComponent`
- `TimelineComponent` (experience)
- `StepIllustrationComponent` (animated SVG with step controls: back, next, replay; keyboard shortcuts ArrowLeft/ArrowRight/R)
- `MarkdownComponent` (renders trusted repo Markdown only, with Shiki)

---

## 7. Content model

Content lives in the repository as Markdown with YAML front matter, loaded at build time.

```
src/content/
  en/projects/<slug>.md
  fr/projects/<slug>.md
  en/about.md
  fr/about.md
```

Project front matter schema:

```yaml
title: string
summary: string          # one sentence, max 160 chars
order: number            # lower appears first
featured: boolean
tags: string[]           # e.g. ["Java", "Spring Boot", "AWS"]
stack: string[]
links:
  repo: string?          # URL
  demo: string?          # URL
cover: string?           # path under /assets/projects/
status: "live" | "archived" | "in-progress"
```

Body structure for case studies (recommended headings): Problem, Approach, Architecture, Decisions and trade-offs, Result, What I would do next.

The content loader must validate front matter at build time and fail on missing required fields. Every slug must exist in both languages.

---

## 8. Site configuration

All owner-specific values live in one file: `src/app/site.config.ts`.

```ts
export interface SiteConfig {
  ownerName: string;
  role: { en: string; fr: string };
  siteUrl: string;            // canonical origin, no trailing slash
  email: string;
  github: string;             // profile URL
  linkedin: string;           // profile URL
  cvPath: { en: string; fr: string }; // e.g. /assets/cv/cv-en.pdf
  demoBaseUrl?: string;       // public URL of backend demos (optional)
}
```

**Copilot: do not invent values for this file. Ask the owner for each field.** No component may hard-code the owner's name or URLs.

---

## 9. SEO and sharing

- Per-page `<title>` and meta description (via Angular `Title` and `Meta` services), translated.
- Open Graph and Twitter card tags with a static OG image.
- `sitemap.xml` and `robots.txt` generated at build time, including both languages.
- Semantic HTML: one `<h1>` per page, landmarks (`header`, `nav`, `main`, `footer`).
- Structured data (JSON-LD `Person`) on Home.

---

## 10. Performance and accessibility targets

- Lighthouse (mobile) on Home: Performance >= 95, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- No layout shift from fonts (preload the used weights, `font-display: swap`).
- Images: modern formats, explicit width/height, lazy-load below the fold.
- Initial JS budget: under 150 kB gzipped (set Angular budgets and let the build fail above it).
- Fully keyboard navigable, visible focus ring using `--accent`.
- Axe check in Playwright must report zero serious or critical violations.

---

## 11. Analytics (privacy-first)

- Phase 1: Cloudflare Web Analytics, enabled in the Cloudflare dashboard. No code, no cookies.
- Phase 2 (later): self-hosted Umami. Do not add its script yet.
- Implement now an `AnalyticsService` with `track(event: string, props?: Record<string, string>)` that is a **no-op by default**. Call it on: CV download, GitHub click, LinkedIn click, project open, language switch, theme switch.
- Never add cookies, fingerprinting or third-party trackers. Never add Google Analytics.

---

## 12. Repository structure

```
portfolio-site/
  .github/
    copilot-instructions.md   # short rules, see section 16
    workflows/ci.yml
  docs/
    specs/                    # public specs, committed (this file lives here)
  e2e/
  public/ (or src/assets)
    assets/cv/  assets/projects/  assets/i18n/
  src/
    app/
      core/        # services: theme, language, analytics, content loader
      shared/      # reusable components
      features/    # home, projects, project-detail, about, not-found
      site.config.ts
    content/
    styles/        # tokens.css, tailwind entry
  README.md
```

---

## 13. CI/CD

- GitHub Actions on pull requests and `main`: install, lint, unit tests, build (with prerender), Playwright smoke tests.
- Deployment: Cloudflare Pages Git integration on `main`. Preview deployments for pull requests.
- Build command: `npm run build`. Output directory: the Angular browser output folder (verify the exact path after the first build).
- Pin the Node version in `.nvmrc` and in the Cloudflare Pages environment variable.

---

## 14. Milestones and acceptance criteria

1. **Scaffold:** Angular + SSR/prerender, Tailwind, ESLint, Prettier, CI, deployed empty shell on Cloudflare Pages.
   *Done when:* the shell is reachable on the Pages URL and CI is green.
2. **Design system:** tokens, theme service, fonts, header, footer, badge, toggles.
   *Done when:* dark/light works without flash and persists after reload.
3. **i18n:** Transloco, language routes, toggle, `hreflang`, missing-key check.
   *Done when:* every page renders in both languages and the language persists.
4. **Content pipeline:** Markdown loader, front matter validation, projects list and detail pages.
   *Done when:* one sample project renders in EN and FR, and a missing field fails the build.
5. **Home and About:** hero, featured projects, timeline, CV and social links.
6. **Illustration component:** animated step-by-step SVG with keyboard controls and reduced-motion support.
7. **SEO, performance, accessibility pass:** meta tags, sitemap, JSON-LD, Lighthouse and axe targets met.
8. **Analytics:** Cloudflare Web Analytics enabled, `AnalyticsService` events wired.

Work one milestone at a time. Do not start the next until the acceptance criteria are met.

---

## 15. Conventions

- TypeScript strict mode on. No `any` without a comment explaining why.
- Components: `ChangeDetectionStrategy.OnPush`, `inject()` instead of constructor injection, signals for local state.
- File naming: kebab-case, one component per file, selectors prefixed `app-`.
- Styling: Tailwind utilities that reference token variables (e.g. `bg-[var(--surface)]`) or Tailwind theme extensions mapped to the tokens. No hard-coded hex values in components.
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).
- Tests: unit tests for services (theme, language, content loader); Playwright for navigation, theme persistence and language switch.

---

## 16. Rules for Copilot (also place a short version in `.github/copilot-instructions.md`)

1. Follow this specification. If it is silent or ambiguous, ask a question.
2. Do not add dependencies that are not listed in section 2.
3. Never produce gradients, blurred shadows, glow effects or stock "AI landing page" copy.
4. Never hard-code owner data. Use `site.config.ts`.
5. Every user-visible string must exist in both `en.json` and `fr.json`.
6. Keep changes small and focused on the current milestone.
7. Explain non-obvious decisions in short code comments, and keep the README current.
