---
date: 2026-07-05
topic: nextjs-nuggets-migration
---

# Next.js + Nuggets Template Migration

## Summary

Rebuild arturosolo.com as a **Next.js 14 (App Router)** marketing site using the **Nuggets** template from 21st.dev, with **Supabase** for contact-lead capture and a dynamic blog. Arturo's June 2026 **copy and positioning** map onto Nuggets' agency information architecture via a template-native section remap. Development happens on a **parallel branch** while the current Vite site remains on `main` until cutover. **Vercel** is the recommended host for this stack.

---

## Problem Frame

The current site is a Vite + React SPA with a custom GSAP story-scroll experience, Netlify Forms, and a deliberately minimal homepage (`StoryScrollExperience` + `Contact`). That architecture served the June 2026 story-scroll redesign, but the desired next step is a **different visual system entirely** — not an iteration of the existing scroll narrative.

The chosen template (**Nuggets**) is Next.js-only and ships as a full agency site: Framer Motion animations, Supabase-backed contact and blog, SSR, and a multi-section homepage IA (hero, services, process, stats, team, blog, contact, legal pages). Adopting it means a **platform migration** (Vite → Next.js), a **backend migration** (Netlify Forms → Supabase), and a **design reset** — not a component port.

The business positioning from the June 2026 AI consultancy pivot and story-scroll copy decisions remains valid. What changes is the delivery vehicle: agency-template sections rewritten for a founder-led AI build studio, not a design agency.

---

## Key Decisions

- **Greenfield rebuild over incremental conversion.** Do not migrate Vite files file-by-file into Next. Port copy and positioning; discard UI components, GSAP story-scroll logic, and Vite build tooling.

- **Nuggets template-native section remap (Option A).** Keep Nuggets' agency IA and rewrite each section for Arturo Solo LLC. Do not attempt to recreate the seven-beat story-scroll narrative inside Nuggets chrome.

- **Supabase as intended.** Use Supabase for contact-lead storage and the dynamic blog CMS. Do not preserve Netlify Forms.

- **"Why Arturo" founder block in the Team section.** Repurpose Nuggets' Team section as a solo-founder credibility block. Do not hide or remove the section.

- **Parallel branch workflow.** Build the Next site on a feature branch; keep the Vite site deployable from `main` until cutover is ready.

- **Vercel for production hosting.** With Netlify Forms no longer a constraint, deploy Next.js + Supabase to Vercel for first-party Next integration. Domain (`arturosolo.com`) can remain registered at Netlify while DNS points to Vercel.

- **Story-scroll requirements retired.** The GSAP pinned/stacked/static modes and related requirements in `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md` are superseded by this migration. Preserve messaging intent from that doc and from `docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md`, not scroll mechanics.

- **Kinetic differentiation traded for template operability.** Nuggets' agency-template IA and Framer Motion replace the story-scroll narrative as the primary distinctiveness lever. Copy and proof model carry the builder positioning; the site no longer depends on pinned scroll mechanics.

- **Blog in v1 as infrastructure, not content commitment.** Blog moves from the June deferral into v1 because it is native to Nuggets + Supabase. v1 requires a working `/blog` index; seed posts remain optional.

- **Server-mediated contact writes.** Contact submissions must pass through a Next.js server route or server action using server-only Supabase credentials, not unrestricted client-side anon inserts.

---

## Actors

- A1. **Cold discovery visitor:** Judges quickly whether Arturo is a real AI builder or another consultant.
- A2. **Business owner / operator:** Has a workflow bottleneck and needs a low-friction path to first contact.
- A3. **Arturo Solo LLC:** Needs the site to communicate founder-builder credibility, hybrid proof, and the AI Jumpstart entry offer.
- A4. **Arturo (site operator):** Publishes blog posts and receives contact leads via Supabase.

---

## Key Flows

- F1. **Cold visitor homepage scan**
  - **Trigger:** Visitor lands on `/` from search, referral, or direct traffic.
  - **Actors:** A1, A3
  - **Steps:** Visitor reads the opening promise, scans services (AI Jumpstart + custom build), sees method/process, encounters hybrid proof in stats, reads Why Arturo, optionally notices recent blog posts, reaches contact CTA.
  - **Outcome:** Visitor leaves with a builder/shipped-systems impression or continues to contact.
  - **Covered by:** R4, R5, R6, R7, R8, R9, R10, R11

- F2. **Lead capture**
  - **Trigger:** Visitor submits the contact form.
  - **Actors:** A2, A4
  - **Steps:** Visitor completes name, email, company, service interest, and message fields. Client shows submitting, validation-error, and failure states. On success, submission persists to Supabase via a server-mediated write and the visitor reaches a warm confirmation (`/success` or equivalent inline state). Arturo receives notification (template-default or configured equivalent).
  - **Outcome:** Lead is stored reliably, discoverable by the operator, and the visitor knows submission succeeded.
  - **Covered by:** R11, R16, R20, R21

- F3. **Blog read (optional)**
  - **Trigger:** Visitor navigates to `/blog` or clicks a post from the homepage.
  - **Actors:** A1, A4
  - **Steps:** Visitor browses post index, opens a post, reads content rendered from Supabase.
  - **Outcome:** Visitor gains credibility signal; operator has a content surface for AI implementation notes.
  - **Covered by:** R10

- F4. **Production cutover**
  - **Trigger:** Next branch is feature-complete and tested on a preview deploy.
  - **Actors:** A4
  - **Steps:** Preview deploy verified on Vercel. DNS for `arturosolo.com` repointed from Netlify publish to Vercel. Old Vite deploy retired or archived. Supabase production env vars confirmed on Vercel.
  - **Outcome:** Public traffic serves the Next site without extended downtime.
  - **Covered by:** R3, R17, R18, R19, R24, R25

---

## Requirements

**Platform and delivery**

- R1. The production site must run on **Next.js 14 with App Router**, scaffolded from the purchased **Nuggets** template (`https://21st.dev/@shuvamk/templates/nuggets-design-agency-website`).
- R2. Development must occur on a **parallel git branch**; the current Vite site on `main` must remain deployable until cutover.
- R3. Production hosting must be **Vercel**, with environment variables for Supabase configured per deploy context (preview and production). The Supabase **service role key must never ship to client bundles**. Preview and production must use isolated Supabase projects or strictly separated credentials so test submissions cannot mix with production lead data.

**Positioning and content mapping**

- R4. All homepage sections must carry Arturo's June 2026 positioning: **working AI, built into your business** — founder-led AI build studio, not a generic design agency or IT consultant.
- R5. The **Hero** must deliver the opening promise with contrast language (working systems, not decks or demos).
- R6. The **Services** section must present **AI Jumpstart** and **Custom AI Build** as the primary offerings, not a generic multi-service agency grid.
- R7. The **Process** section must describe Arturo's method: discover bottleneck → build until it runs → expand.
- R8. The **Stats** section must present **hybrid proof**: public products, internal workflows, client contexts, and tools in development — without implying only two shipped products or naming unfinished work as finished portfolio items.
- R9. The **Team** section must be a visible **"Why Arturo"** solo-founder block. It must not be hidden, removed, or replaced with a multi-person team grid.
- R10. The **Blog** must be backed by Supabase and reachable at `/blog`. v1 may launch with zero posts; the infrastructure must be ready for operator publishing.
- R11. The **Contact** section must capture leads to Supabase with fields equivalent to the current form: `name`, `email`, `company`, `service` (options: `ai-jumpstart`, `custom-ai-build`, `not-sure`), and `message`. Submissions must use a **server route or server action** with server-only credentials, include a **honeypot field** rejected server-side, and apply **basic rate limiting** on the submission path.
- R12. **Privacy Policy** and **Terms** pages from the template must ship with Arturo-specific copy before public cutover. Privacy Policy must describe contact-lead collection, Supabase storage, and operator-only access.

**Experience and quality**

- R13. Motion must use the template's **Framer Motion** patterns. Do not port GSAP or the story-scroll pinned/stacked system from the Vite site. All motion must respect `prefers-reduced-motion: reduce` with static or near-instant fallbacks.
- R14. The site must be fully responsive and meet the template's cross-browser compatibility baseline.
- R15. SEO metadata (title, description, Open Graph, Twitter Card) must be configured for Arturo Solo LLC on all public routes.
- R16. The contact path must remain approachable and lower-friction than the kinetic homepage sections — warm, practical tone preserved from the prior contact-section intent.
- R20. The contact form must expose explicit **submitting, validation-error, server-error, and success** states so visitors are never left guessing whether submission worked.
- R21. Successful contact submission must show a **warm confirmation** via a dedicated `/success` route (preferred, matching current site behavior) or an equivalent inline success state with the same tone as R16.
- R22. The mobile menu toggle must expose **`aria-expanded` and `aria-controls`** tied to the menu panel, with keyboard-open, navigate, and close behavior verified on mobile.

**Security and data**

- R23. Supabase **RLS** on the contact-leads table must deny anonymous `SELECT`, `UPDATE`, and `DELETE`. Public writes must be limited to validated inserts through the server-mediated path; operator reads use authenticated or service credentials only.

**Cutover and operations**

- R17. A **preview deploy** on Vercel must be verified before DNS cutover: desktop and mobile smoke check, contact submit to Supabase (including `/success` or equivalent), blog index renders, Privacy/Terms pages reachable with Arturo copy, reduced-motion check on homepage and contact, and mobile menu `aria-expanded`/`aria-controls` check.
- R18. DNS for `arturosolo.com` must point to Vercel production without breaking email or unrelated DNS records.
- R19. After cutover, the Vite codebase on `main` must be archived (tag or dedicated branch) so history is recoverable but not confused with the live stack.
- R24. The Next branch must pass **lint, build, unit tests, and e2e smoke** (homepage, `/blog`, contact success path) in CI before cutover — equivalent verification bar to the current Vite site.
- R25. **`AGENTS.md` must be updated** when the parallel branch becomes the active development surface, superseding Vite/GSAP/Netlify Forms/story-scroll invariants with Next.js, Framer Motion, Supabase, and multi-section IA rules.

---

## Acceptance Examples

- AE1. **Covers R4, R5.** Given a cold visitor lands on `/`, when they read the hero, they encounter "working AI" builder language — not a design-agency tagline.
- AE2. **Covers R6.** Given the visitor reaches Services, when they scan the section, they see AI Jumpstart and Custom AI Build — not six unrelated agency service cards.
- AE3. **Covers R8.** Given the visitor reaches Stats, when they scan quickly, they understand proof includes products, workflows, and client contexts — not only two visible portfolio items.
- AE4. **Covers R9.** Given the visitor scrolls to Team, when the section renders, they see a solo-founder "Why Arturo" block — not a multi-person team grid and not an empty/hidden section.
- AE5. **Covers R11, R20, R21.** Given a visitor submits the contact form with valid data, when the submission completes, a row appears in Supabase with all required fields and the visitor sees a warm success confirmation.
- AE6. **Covers R17, R18, R19.** Given the Next branch is ready, when DNS cutover completes, `arturosolo.com` serves the Vercel-deployed Next site, the contact form still submits successfully, and the Vite codebase on `main` is archived per R19.
- AE7. **Covers R4, R6, R9.** Given a cold visitor scans the homepage, when they describe the site afterward, their language avoids generic agency or consultant framing and reflects builder/systems positioning.
- AE8. **Covers R8.** Given the visitor reaches Stats, when they scan the proof items, they read as builder evidence (systems shipped, workflows automated) — not vanity metrics or a generic "trusted by" strip.

---

## Success Criteria

- A cold visitor describing the site in one sentence uses language like **builder**, **working AI**, **systems**, or **bottlenecks** — not generic agency or consultant language.
- The site visibly matches the Nuggets design language while reading as an AI build studio, not a design agency.
- Contact leads arrive in Supabase reliably from production.
- Blog infrastructure is operable even if no posts ship on day one.
- Cutover completes without extended downtime on `arturosolo.com`.
- A downstream planner can proceed without inventing section mapping, backend choice, hosting target, or branch strategy.

---

## Scope Boundaries

### Deferred for later

- Migrating historical Netlify Form submissions into Supabase.
- Product screenshots, founder photography, or a dedicated case-study/portfolio page.
- Named public treatment of in-development AI tools.
- Visual-regression or scroll-jank performance gates.
- Content migration automation from the Vite site's component tree.

**Scope note:** The June 2026 story-scroll requirements deferred blog and legal pages. This migration pulls **blog infrastructure** (R10) and **Privacy/Terms** (R12) into v1 cutover scope because they are native to the Nuggets template and Supabase stack.

### Outside this product's identity

- Recreating the GSAP story-scroll seven-beat narrative from the current Vite site.
- Positioning Arturo Solo LLC as a design agency, dev shop, or generic AI consultant.
- A generic "trusted by" client-logo strip as a major proof section.
- Inflated claims about unfinished products.
- Preserving Netlify Forms as the lead-capture backend.

---

## Dependencies / Assumptions

- The Nuggets template is purchased and available for download from 21st.dev.
- A Supabase project will be created with tables/schema matching the template's expectations (contact leads, blog posts).
- Vercel account access and GitHub repo connection are available for deploy.
- June 2026 positioning copy in `docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md` and messaging beats from `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md` remain the content baseline.
- Domain registration may stay at Netlify; only DNS routing changes at cutover.

---

## Outstanding Questions

### Deferred to Planning

- [Affects R10][Content] Launch blog empty vs. with 1–2 seed posts — operator preference.
- [Affects R11][Technical] Supabase schema alignment: adopt template defaults verbatim vs. extend for service-field options.
- [Affects R12][Content] Privacy Policy and Terms copy source — template boilerplate edit vs. custom draft.
- [Affects R17][Operations] Exact cutover window and rollback plan if Supabase or Vercel misconfigures on launch day.
- [Affects R3, R23][Operations] Supabase project naming, preview vs. production database strategy (single project with RLS vs. separate projects).
- [Affects R11, R12][Security] Lead retention period and deletion process for contact PII stored in Supabase.
- [Affects R10][Security] Blog authoring authentication model — how operator credentials are managed for post publishing.

---

## Sources / Research

- Nuggets template listing: `https://21st.dev/@shuvamk/templates/nuggets-design-agency-website` — Next.js 14 App Router, Framer Motion, Supabase, SSR, blog, contact DB integration.
- Current Vite deploy config: `netlify.toml` (publishes `dist` from `vite build`).
- Current form contract: `src/components/sections/Contact.tsx`, hidden form in `index.html`.
- Prior positioning docs: `docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md`, `docs/brainstorms/2026-06-03-story-scroll-redesign-requirements.md`.
- Netlify Next.js support reference (alternative host): Netlify `@netlify/next` runtime supports App Router SSR, API routes, middleware, and ISR — viable but not selected.

---

## Human Understanding Checklist

- [ ] Understand why this is a greenfield rebuild, not a Vite-to-Next file conversion.
- [ ] Understand why Supabase replaces Netlify Forms and what operational overhead that adds.
- [ ] Understand the template-native section remap and how each Nuggets section maps to Arturo copy.
- [ ] Understand why the Team section becomes "Why Arturo" and stays visible.
- [ ] Understand why Vercel is recommended over staying on Netlify for this stack.
- [ ] Understand the parallel-branch cutover strategy and what stays on `main` until launch.
- [ ] Understand which prior brainstorm requirements are superseded vs. preserved.
- [ ] Understand the new security posture (server-mediated writes, RLS, honeypot, rate limiting).
- [ ] Understand the deliberate trade of story-scroll kinetic differentiation for Nuggets template operability.
