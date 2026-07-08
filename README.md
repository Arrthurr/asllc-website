# Arturo Solo LLC Website

Marketing site for [arturosolo.com](https://arturosolo.com).

## Branch layout

| Branch | Stack | Deploy |
|--------|-------|--------|
| `main` | Vite + React + GSAP story-scroll | Netlify |
| `feat/nextjs-nuggets` | Next.js 14 + Nuggets template + Supabase | Vercel (preview/prod) |

The Next.js branch is a greenfield rebuild on the Nuggets agency template. See `docs/plans/2026-07-05-001-feat-nextjs-nuggets-migration-plan.md` and `docs/runbooks/2026-07-05-vercel-cutover.md`.

## Next.js development (`feat/nextjs-nuggets`)

```bash
cp .env.example .env.local
# Fill Supabase, Resend, Upstash credentials (separate dev/prod projects)
npm install
npm run dev
```

Verification:

```bash
npm run lint
npm run test
npm run build
npm run test:e2e
```

### Blog publishing (v1)

No `/admin` route. Insert rows in Supabase `posts` with `status = 'published'` via dashboard or SQL.

### Contact pipeline

Server Action → Upstash rate limit → Supabase admin insert → Resend notification → `/success`.
