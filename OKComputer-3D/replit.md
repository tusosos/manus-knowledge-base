# 3D Print Business Hub

A comprehensive Polish-language business management tool for 3D printing entrepreneurs. Industrial dark-themed (black background, amber accents) full-stack web app.

## Architecture

**Monorepo (pnpm workspaces):**
- `artifacts/print-hub` — React + Vite frontend (port 21441)
- `artifacts/api-server` — Express 5 API backend (port 8080)
- `lib/api-spec` — OpenAPI specification
- `lib/api-zod` — Generated Zod schemas from OpenAPI
- `lib/api-client-react` — Generated React Query hooks
- `lib/db` — Drizzle ORM + PostgreSQL schema

## Frontend Pages (23 total, all in Polish)

| Path | Polish Name | Type |
|------|-------------|------|
| `/` | Dashboard | API-connected |
| `/tasks` | Zadania | Full CRUD |
| `/projects` | Projekty | Full CRUD |
| `/print-queue` | Kolejka Druku | Full CRUD |
| `/calculator` | Kalkulator | Static calculator |
| `/inventory` | Magazyn | Full CRUD |
| `/clients` | Klienci | Full CRUD |
| `/quotes` | Wyceny | Full CRUD |
| `/analytics` | Analizy | API + recharts |
| `/bestsellers` | Bestsellery | Static data |
| `/competition` | Konkurencja | Static data |
| `/business-plan` | Biznes Plan | Local calculator |
| `/multicolor` | Multicolor | Local state |
| `/printer` | Drukarka | Local state |
| `/knowledge` | Baza Wiedzy | Static content |
| `/filament-deals` | Okazje Filamentów | Static data |
| `/listing-generator` | Generator Listingów | Local state |
| `/shipping` | Wysyłka | Local calculator |
| `/scaling` | Kalkulator Skalowania | Local calculator + recharts |
| `/value-compare` | Ty vs AliExpress | Local state |
| `/order-board` | Tablica Zamówień | Kanban drag & drop |
| `/label-generator` | Generator Etykiet | QR code + print |
| `/hourly-profit` | Zysk na Godzinę | Local calculator + recharts |

## Design

- Dark industrial theme: near-black `#0a0a0a` background
- Amber accent `#fbbf24` primary color
- All UI text in Polish (no diacritics in code strings for simplicity)
- framer-motion animations, recharts for analytics
- Dense and information-rich layout
- **Typography**: Space Grotesk (display/headings) + Inter (body), loaded via Google Fonts with `font-display:swap`
- **Accessibility**: focus-visible rings, skip-to-content link, aria-labels on icon buttons, keyboard navigation (← →) on Kanban board, 44x44px min touch targets, `prefers-reduced-motion` support
- **Animations**: Staggered page entry animations (PageTransition + AnimatedSection components), animated sidebar active indicator (spring physics via framer-motion layoutId)
- **Atmosphere**: Subtle dot-grid background pattern (`bg-grid-pattern`), improved card separators
- **SEO**: Meta description, OG tags, Polish `lang="pl"` attribute

## H2D Combo Specifics (used across pages)

- Printer: Bambu Lab H2D Combo
- Max nozzle temp: 350°C, max bed temp: 120°C
- Build volume: 300x300x400mm
- Dual independent toolhead, dual AMS (16 color slots)
- Speed: up to 500mm/s, acceleration 20,000 mm/s²
- Price: ~15,000 PLN, amortization default: 15,000 / 2000 prints
- Power: ~200W

## Upgraded Pages

- **Dashboard**: H2D printer status widget (progress, temps, current job), Kanban task summary, project status breakdown, stock alerts
- **Calculator**: 8 material presets, AMS multicolor toggle + purge waste, printer amortization, prep/post-processing, packaging, margin presets (50/100/200/300%)
- **Multicolor**: Dual AMS 16-slot planner with color pickers, purge waste calculator, popular combinations
- **Printer**: Full H2D specs, material profiles table with H2D-specific settings, editable calibration notes
- **Business Plan**: SWOT editable, 3/6/12-month projections, AMPOWER 2026 market data, break-even analysis
- **Bestsellers**: 18 products with margins 200-800%, model platform links, multicolor filter, 2026 trends
- **Competition**: Real Polish firms (Fibometry/Send3D/3D-innowacje/Craft3D/P3DRC), pricing map, competitive advantages
- **Knowledge**: H2D-specific material profiles (8 materials), H2D troubleshooting (10 issues), print checklist, business startup checklist
- **Filament Deals**: Price alerts, reference prices table (9 materials), Polish shops (7) + international shops (4), deal listings with 2026 dates

## Backend API Routes

All routes mounted at `/api/`:
- `GET /api/dashboard/summary` — KPI cards
- `GET /api/dashboard/activity` — Recent activity feed
- `GET/POST /api/tasks` + `GET/PATCH/DELETE /api/tasks/:id`
- `GET/POST /api/projects` + `GET/PATCH/DELETE /api/projects/:id`
- `GET/POST /api/clients` + `GET/PATCH/DELETE /api/clients/:id`
- `GET/POST /api/filaments` + `GET/PATCH/DELETE /api/filaments/:id`
- `GET/POST /api/print-jobs` + `GET/PATCH/DELETE /api/print-jobs/:id`
- `GET/POST /api/quotes` + `GET/PATCH/DELETE /api/quotes/:id`
- `GET /api/analytics/summary`
- `GET /api/analytics/revenue`

## Database (PostgreSQL + Drizzle)

Tables: `clients`, `projects`, `tasks`, `filaments`, `print_jobs`, `quotes`

All tables use UUID primary keys via `crypto.randomUUID()`.

Seed data included: 2 clients, 2 projects, 3 tasks, 3 filaments, 2 print jobs, 2 quotes.

## Key Dependencies

- React + Vite + TypeScript
- Express 5 + pino logging
- Drizzle ORM + drizzle-kit
- React Query (@tanstack/react-query)
- Wouter (routing)
- shadcn/ui components + Tailwind CSS
- recharts (analytics charts)
- framer-motion (animations)
- Zod (validation)
- qrcode.react (QR code generation for labels)

## Scripts

- `pnpm check:links` — scans `artifacts/print-hub/src` and `artifacts/api-server/src` for external `http(s)` URLs and verifies each one is reachable. Templated URLs (containing `${...}`) are skipped. Anti-bot statuses (401/403/429/451) are reported as warnings; only true 4xx/5xx and network errors fail the run (exit code 1). Run locally before commits or wire into CI to catch dead links in `bestsellers.tsx` / `filament-deals.tsx`. Use `--json` for machine-readable output, or pass directory paths to override the scan roots.
