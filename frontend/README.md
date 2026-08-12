# Abdullah Butt — Portfolio (Next.js)

Next.js 16 (App Router) + Tailwind v4 portfolio, fully integrated with the
Express/MongoDB backend — no mock data. Includes the public site and a
protected admin CMS.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- `next/font/google` (Inter + JetBrains Mono)
- No extra runtime deps were added — admin toasts/dialogs/forms are built on
  the existing `Button`/`cn` primitives rather than pulling in a UI library.

## What was already here vs. what was added

This project arrived with a working design system and public marketing
pages, but backed entirely by mock data in `data/*.ts`, and with no contact
page, no project detail page, and no admin CMS. That's what this pass adds:

- **Real API integration** — `lib/api.ts` (public reads) and
  `lib/admin-api.ts` (authenticated writes) replace all mock data. `lib/types.ts`
  now mirrors your backend's actual Mongoose schemas (`Raw*` types), with thin
  mapper functions to the UI-facing shapes components use.
- **Missing public pages** — `/projects/[slug]` (video, screenshot lightbox,
  features, tech, links) and `/contact` (validated form → `POST /api/contact`).
- **Full admin CMS** — `/admin/login`, `/admin` (dashboard), `/admin/projects`
  (list/search/filter/publish/feature/delete), `/admin/projects/new` +
  `/admin/projects/[id]/edit` (grouped form + drag-and-drop media upload),
  `/admin/profile`, `/admin/skills`.
- **Route restructure** — public pages moved into `app/(site)/` (with the
  Navbar/Footer layout) so `app/admin` can have its own sidebar chrome
  instead of the public marketing nav. URLs are unaffected (route groups
  don't appear in the path).

## Local Setup

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL to your backend
npm run dev
```

Requires the backend running and reachable at `NEXT_PUBLIC_API_URL`, with its
`CLIENT_URL` pointed at this app's origin (e.g. `http://localhost:3000`) so
CORS + the admin auth cookie work.

## Structure

```
app/
├── layout.tsx              # root: fonts, <html>/<body>, skip link, Analytics
├── (site)/                 # public site — its own layout (Navbar+Footer), force-dynamic
│   ├── page.tsx  about/  skills/  projects/  projects/[slug]/  contact/
└── admin/
    ├── layout.tsx           # Auth/Toast providers only
    ├── login/page.tsx        # not guarded
    └── (protected)/          # AdminGuard + sidebar shell wraps everything below
        ├── page.tsx (dashboard)  projects/  profile/  skills/
lib/
├── types.ts     # Raw* (backend shape) + UI-facing types
├── http.ts      # fetch wrapper, error unwrapping
├── api.ts       # public reads + Raw→UI mappers
├── admin-api.ts # authenticated CRUD + media upload (cookie-based)
├── auth-context.tsx / toast-context.tsx
components/
├── admin/       # sidebar shell, guard, form fields, tag input, media uploader, confirm dialog, states
└── ...          # existing design-system components, updated to the real schema
```

## Auth Flow

`AuthProvider` (mounted in `app/admin/layout.tsx`) calls `GET /api/auth/me`
with the browser's HTTP-only cookie on load. `AdminGuard` (in the
`(protected)` layout) redirects unauthenticated visitors to `/admin/login`
and back afterward. Logout clears the cookie server-side.

## Known Trade-offs / Flags

- **No backend was reachable in the build sandbox** — `tsc --noEmit` passes
  clean and a full `next build` was verified to succeed once pointed at a
  reachable backend (confirmed via `dynamic = 'force-dynamic'` on the public
  route group, so a build never depends on the backend being up). Live
  login/CRUD/upload flows should be smoke-tested against your real backend.
- **No ESLint config ships with this project** (`package.json` has a `lint`
  script but no `eslint.config.js` was included in the original upload) —
  left as-is rather than inventing a config; add one if you want linting.
- **Pagination on `/projects`** — the existing `ProjectsGrid` design filters
  client-side by category with no page-by-page UI; I fetch up to 100
  projects and filter in the browser rather than bolting on a page control
  that didn't fit the original design. Flag if you want real server-side
  pagination UI here (the backend already supports it — `getProjects` accepts
  `page`/`limit`).
- **Experience section** — omitted, same reasoning as before: your backend
  has no employment/experience model, and inventing employers or dates isn't
  something either of us wants.
