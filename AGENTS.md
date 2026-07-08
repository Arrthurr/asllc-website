# AGENTS.md

## Collaboration Style

Act as a clear, effective teacher as well as an implementer. Help the human understand the problem, the solution, the design decisions, edge cases, and broader impact. Explain incrementally during substantial work instead of saving all context for the end.

When useful, keep or update a running checklist under `docs/` for what the human should understand. `docs/outstanding-tasks-understanding-checklist.md` is the current backlog-oriented checklist.

`docs/solutions/` contains reusable project learnings with YAML frontmatter (`module`, `tags`, `problem_type`). Read relevant solution docs before changing areas they cover. Note: `docs/solutions/tooling-decisions/drop-framer-motion-for-css-and-gsap.md` is historical — this branch deliberately re-adopts Framer Motion via the Nuggets template.

## Project Shape

This is a **Next.js 14 (App Router)** marketing site for Arturo Solo LLC, scaffolded from the Nuggets agency template. Positioning: founder-led AI build studio — "working AI, built into your business."

Homepage section IA (template-native remap of story-scroll beats):

```tsx
<Header />
<Hero />        {/* beat 1 + beat 2 subhead */}
<Stats />       {/* beat 3 hybrid proof */}
<Services />    {/* beat 5 + Custom AI Build */}
<Process />     {/* beat 4 method */}
<Team />        {/* beat 6 Why Arturo */}
<BlogTeaser />  {/* hidden when zero published posts */}
<Footer />
```

Contact lives at `/contact` with warm, low-friction tone (beat 7). Do not reintroduce GSAP story-scroll or the old Vite SPA architecture.

Important files:

- `app/page.tsx` composes the homepage.
- `components/Hero.tsx`, `Services.tsx`, `Stats.tsx`, `Process.tsx`, `Team.tsx` — section copy and Framer Motion wrappers.
- `components/ContactForm.tsx` + `app/contact/page.tsx` — visitor-facing contact UX.
- `app/actions/submit-contact.ts` — server-mediated Supabase insert, honeypot, rate limit, Resend notification.
- `lib/supabase/admin.ts` — `server-only` service-role client (never import from client components).
- `lib/supabase/server.ts` / `lib/supabase/client.ts` — `@supabase/ssr` split for blog reads.
- `app/blog/` — Supabase-backed blog (infrastructure v1; dashboard publishing).
- `docs/runbooks/2026-07-05-vercel-cutover.md` — DNS cutover and rollback.

Historical Vite/GSAP reference (pre-migration): `src/` tree, tagged at `archive/vite-story-scroll-2026-07-05` after cutover.

## Content and Positioning Invariants

Preserve the hybrid proof model: public products, internal workflows, real client contexts, and AI tools in development. Do not imply unfinished products are finished portfolio items. Client logos in `Stats` are subordinate proof — not a generic "trusted by" strip.

Services exposes **AI Jumpstart** and **Custom AI Build** only.

Team is a visible solo-founder block — not a multi-person grid.

Tonal boundary:

- Homepage sections can be blunt and kinetic (Framer Motion).
- Contact should be warmer, practical, and low-friction.

## Animation Architecture

Framer Motion is scoped to Nuggets section components (`components/*.tsx` client wrappers). Every motion wrapper must respect `prefers-reduced-motion: reduce` — use `usePrefersReducedMotion()` from `lib/motion.ts` or CSS fallbacks in `app/globals.css`.

Do **not** port GSAP story-scroll. Do not spread animation libraries beyond section-level Framer Motion wrappers.

## Supabase and Contact Rules

Contact writes use a `'use server'` action with the admin client (`SUPABASE_SERVICE_ROLE_KEY`). Never use anon-key client inserts for leads.

Form contract (matches prior Netlify fields):

- Fields: `name`, `email`, `company`, `service`, `message`
- Service values: `ai-jumpstart`, `custom-ai-build`, `not-sure`
- Honeypot: `website` — silent redirect to `/success`, no DB row
- Rate limit: 5 submissions/IP/hour via Upstash (when configured)
- Success: redirect to `/success` with warm confirmation copy

RLS on `contact_leads`: enabled, no anon/authenticated policies. Blog `posts`: public SELECT where `status = 'published'`.

Separate Supabase projects for Vercel preview vs production.

## Accessibility Rules

Mobile menu toggle must expose `aria-expanded` and `aria-controls` pointing at the mobile nav panel id.

Placeholder links (`href="#"`) are not acceptable in production navigation or footer.

## Deployment

- **Production:** Vercel with env-scoped Supabase, Resend, Upstash credentials.
- **Domain:** arturosolo.com (DNS cutover per runbook; domain registration may remain at Netlify).
- **CI:** `.github/workflows/next-ci.yml` on this branch; Vite CI on `main` until cutover merge.

## Verification

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

Playwright uses Next.js on `127.0.0.1:3000` (`next dev` locally; `next start` in CI after build).

Manual checks after section or contact changes:

- 375px and 1280px responsive layout
- `prefers-reduced-motion: reduce` — sections readable without motion-dependent visibility
- Contact form: submitting, validation-error, server-error, success via `/success`
- `/blog` empty state when no posts; homepage teaser hidden
- Mobile menu keyboard and ARIA behavior

## Current Backlog Signals

See `docs/outstanding-tasks-understanding-checklist.md`.

Deferred (not in v1 scope):

- Custom `/admin` blog CMS route (dashboard publishing for now)
- Historical Netlify submission migration
- Real footer social profile URLs (removed placeholders; add when available)
- Seed blog posts (operator preference)
- Dedicated case-study / portfolio page decision
