---
title: "feat: Pivot website to founder-led AI build studio"
status: completed
date: 2026-06-01
type: feat
origin: docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md
---

# feat: Pivot website to founder-led AI build studio

## Summary

Rewrite the Arturo Solo LLC marketing site from a cloud-cost-optimization service to a
founder-led AI build studio. Lead with proof (two shipped, AI-built products), sell the
**AI Jumpstart** entry engagement that ends with a working AI workflow in the client's hands,
demote M365/cloud to a single trust signal, and convert the voice to first-person Arturo
throughout. This is a content, data, and light-structural rewrite of the existing React/Vite
site — no redesign of the visual system and no new tooling.

---

## Problem Frame

Every section of the current site sells "Maximize your cloud investments" — M365 optimization,
license right-sizing, cost-savings case studies ("$45K saved"). It's a commodity-IT frame that
traps the business in reactive, low-margin support work, and it buries the founder's real
differentiator: he ships production software with AI tools at a speed traditional shops can't
match (a location-aware Expo attendance app in beta; a live Texas Head Start data-viz site).
The brainstorm (see origin) resolved the positioning — proof-led builder, AI Jumpstart offer,
full website replace of the cost frame, first-person founder voice. This plan turns those
decisions into concrete edits.

The content lives hardcoded inline in each section component (data arrays + JSX); there is no
central content file, so the rewrite edits each section directly. Two cross-cutting hazards:
`index.html` carries M365-framed SEO metadata **and** a hidden Netlify detection form whose
`<option>` values must stay in sync with the visible Contact form, and the Footer/Header chrome
carries M365 service links and an "Our Team" reference inconsistent with a solo founder brand.

---

## Key Technical Decisions

- **Edit content in place, no content-layer refactor.** Copy is inline in each component.
  Introducing a central content/config module is tempting but out of scope (see origin: full
  replace is a messaging change, not an architecture change). Editing inline keeps the diff
  reviewable and the change surface small. A content-extraction refactor is deferred follow-up.

- **Preserve the existing design system.** Tailwind tokens, `framer-motion` animations, the
  `Section`/`Card`/`Button` primitives, and section background rhythm stay as-is. The pivot is
  message and proof, not visual redesign. New sections reuse existing primitives.

- **Three form copies must stay synchronized, not two.** Netlify detects form fields at build
  time from static hidden forms; the React form must submit matching `name`/`option` values.
  There are **three** copies of the service `<select>`: `index.html` (hidden), `Contact.tsx`
  (visible React form), and `public/contact.html` (a second static hidden detection form, copied
  to `dist/` at build). Any change to the service options must be applied to all three
  identically, or submissions silently fail and stale M365 labels ship in the published asset.
  `public/contact.html` appears redundant with `index.html`'s hidden form and the real
  `src/main.tsx` `/success` route — evaluate deleting it rather than editing it (see Open
  Questions); either way the plan must account for it.

- **Form-option edit ownership: U1 owns, U7 verifies.** To avoid a double-edit when working
  unit-by-unit, U1 is the single owner of the `index.html` and `public/contact.html` static-form
  option edits; U7 owns `Contact.tsx` and verifies its option values string-match the static
  forms. The option value set itself is decided once (with U3's offer framing) and applied by U1.

- **Real client social proof is reframed, not fabricated.** Existing testimonials name real
  people and are cost/M365-framed. We retire the cost-specific quotes (no AI testimonials exist
  yet) and keep client logos as a trust strip. We do not invent AI testimonials or alter a real
  person's quoted meaning.

- **Visual assets are a user-supplied dependency.** Portfolio screenshots (two apps) and a
  founder headshot are needed for the proof and bio sections to land fully. The plan ships those
  sections with labeled placeholders so the rewrite is not blocked on assets.

---

## Requirements Trace

Carried from origin (`docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md`):

- Positioning & message: R1 (AI-build-studio hero), R2 (first-person founder voice), R3
  (specific, proof-anchored copy — no generic AI hype), R4 (M365 as a single trust signal only).
- Offer: R5 (single structured entry engagement, build-not-report), R6 (named "AI Jumpstart"
  with a build-explicit tagline), R7 (wedge into implementation, not a one-off).
- Proof: R8 (two built products as primary proof), R9 (built-by-Arturo-with-AI framing), R10
  (anonymized "Copilot CEO" who-I-help vignette).
- Scope of change: R11 (content/section-purpose rewrite, not a rebuild), R12 (About → founder bio).

Origin actors A1 (Arturo, founder/builder), A2 (SMB owner/operator buyer) shape voice and copy
targeting across all units. Acceptance Examples AE1–AE4 map to test scenarios in U1, U2, U3, U5.

---

## Scope Boundaries

### In scope
- Section-by-section copy, data, and light-structural rewrite of all marketing sections plus
  Header, Footer, and `index.html` metadata/form.
- Renaming the offer to AI Jumpstart and reframing the Services section into the offer + how it
  works.
- Reframing CaseStudies into a two-product portfolio and About into a founder bio.
- Synchronizing the Netlify hidden form with the new Contact form options.

### Deferred for later (from origin)
- A recurring "AI enablement" retainer / ongoing model — chosen model is wedge-into-implementation.
- A finished AI case study with results — none exists yet; the two built products carry proof
  until the first AI engagement (e.g., the secondary client) produces one.

### Outside this product's identity (from origin)
- Selling M365/Google admin, support, license optimization, or cost-savings as a headline service.
- Positioning as a general dev shop or "we build websites/apps" vendor.
- Generic AI thought-leadership / hype content untethered from Arturo's own built work.

### Deferred to follow-up work (plan-local)
- Extracting inline copy into a central content/config module.
- Adding real testimonials and a finished AI case study once the first AI engagement ships.
- Wiring the placeholder Footer links (Blog, FAQs, Privacy, Terms) to real destinations or
  removing them.
- Replacing placeholder visual assets with final screenshots and a headshot (tracked as a
  dependency below, executed when assets arrive).

---

## Dependencies / Assumptions

- **User-supplied assets (non-blocking):** screenshots/representative imagery of the Expo
  attendance app (in beta — may need redaction) and the Texas Head Start site, plus an Arturo
  headshot. Sections ship with placeholders until provided.
- **Netlify Forms:** the existing Netlify form pipeline (`data-netlify`, `index.html` hidden
  form, `/success` redirect, `public/_redirects`) remains the contact mechanism; only field
  options change.
- **Contact details unchanged:** phone (602) 888-6225, Phoenix AZ, `start@arturosolo.com` carry
  forward unless the user says otherwise.
- The Texas Head Start site is public (`texasheadstartgrantees.online`) and linkable; the Expo
  app is in beta and represented without exposing client data.

---

## Implementation Units

### U1. Global brand: metadata, navigation, footer, and Netlify form options

**Goal:** Reframe all site chrome and global metadata from cloud-cost-optimization to the AI
build studio, and bring the Netlify hidden form in line with the new offer.

**Requirements:** R1, R3, R4 (chrome-level), R6; supports AE3 (M365 only as trust signal).

**Dependencies:** none (do first — establishes naming/voice the other units echo).

**Files:**
- `index.html` (title, meta description, hidden Netlify form `<option>`s)
- `public/contact.html` (second static hidden Netlify form — sync options or delete; see Open Questions)
- `src/components/layout/Header.tsx` (nav links, CTA label)
- `src/components/layout/Footer.tsx` (tagline, Company/Services/Resources columns, "Our Team")
- `src/components/ui/Logo.tsx` (verify wordmark; likely unchanged)

**Anchor/nav decision (lock before editing chrome).** The portfolio section (U4, currently
`id="case-studies"`) is renamed to `id="work"` with nav label **"Work"**. Settle all section
`id`s up front so chrome anchors are correct in one pass and U4 does not have to circle back:
Services stays `id="services"`, About `id="about"`, Clients `id="clients"`, Contact `id="contact"`.

**Approach:**
- `index.html`: rewrite `<title>` and `<meta name="description">` to AI-build-studio framing
  (specific, not hype). Replace the hidden form's service `<option>`s with the new set (offer
  framing decided in U3), keeping values identical across `index.html`, `public/contact.html`,
  and `Contact.tsx`. U1 owns the two static-form edits; U7 owns `Contact.tsx`.
- `public/contact.html`: apply the same option values, OR delete the file if confirmed redundant
  (see Open Questions) — do not leave it carrying the old M365 options.
- Header: keep anchor-nav pattern. Update the portfolio nav entry to label "Work" / `href="#work"`.
  Reframe remaining nav labels to the new section intent (keep Services/About/Clients/Contact
  anchors). Update the "Get Started" CTA toward the AI Jumpstart (e.g., "Start your AI Jumpstart").
- Footer: rewrite the tagline (currently "maximize their cloud service subscriptions"). Replace
  the Services column (Microsoft 365 / Google Workplace / Cloud Migration) with AI-oriented or
  offer-oriented links. Update the Resources column "Case Studies" link to "Work" / `href="#work"`
  to match the renamed section. Resolve the "Our Team" (`#team`) link — there is no team section
  and the brand is solo; point to About or remove. Leave Blog/FAQs/Privacy/Terms behavior
  unchanged (deferred), but do not let them assert cloud services.

**Patterns to follow:** existing `navLinks`/`footerLinks` array shape; `Logo` variant prop;
anchor-link nav convention.

**Test scenarios:**
- Covers AE3. Render Header and Footer; assert no purchasable M365/Google/cloud-optimization
  service label appears as a headline link (trust-signal mention only is acceptable).
- The Footer no longer links to a non-existent `#team` section (either repointed or removed), and
  its Resources "Case Studies" link is updated to "Work" / `#work`.
- Service `<option>` values are string-identical across all three forms — `index.html`,
  `public/contact.html` (if retained), and `Contact.tsx` — or `public/contact.html` is deleted;
  no form retains the old M365 option values.
- The document `<title>` and meta description contain AI-build-studio framing and no
  cost-optimization headline language.

**Verification:** Site header/footer and browser tab reflect the AI studio brand; Netlify form
detection still finds matching fields; no dead `#team` anchor.

---

### U2. Hero rewrite

**Goal:** Replace the hero headline, subhead, CTAs, and the floating "Microsoft 365 Optimization"
card with proof-led, build-forward messaging in the founder's voice.

**Requirements:** R1, R2, R3; AE1 (copy is specific, not generic AI hype).

**Dependencies:** U1 (naming/CTA consistency).

**Files:** `src/components/sections/Hero.tsx`

**Approach:**
- Rewrite `<h1>` from "Maximize your cloud investments" to an outcome/build headline; rewrite the
  subhead from cost-optimization to "AI, actually built and running in your business."
- Repoint CTAs: primary toward the AI Jumpstart offer section (U3), secondary toward the proof
  section (U4). Keep the `Button`/anchor pattern.
- Replace the decorative floating card content ("Microsoft 365 / Optimization") with a
  build/proof motif (e.g., a shipped-product or "first AI win" cue). Keep the existing motion and
  layout; this is content inside the existing visual shell.

**Patterns to follow:** existing `motion.div` entrance animation; `Button` with `asChild` anchor;
hero two-column grid.

**Test scenarios:**
- Covers AE1. Hero copy names a concrete outcome (built/running AI) rather than abstract
  "transformative power of AI"; assert the headline/subhead strings are the new build-framed copy
  and not the old cloud-investment copy.
- Primary and secondary CTAs link to the offer and proof section anchors respectively.
- Hero renders without referencing "Microsoft 365" as the headline value proposition.

**Verification:** Above-the-fold message reads as a founder-led AI build studio; CTAs resolve to
the correct in-page sections.

---

### U3. Services → AI Jumpstart offer and how it works

**Goal:** Convert the four-card "Our Services" grid into the AI Jumpstart entry offer — what it
is, that it ends in something built, and that it is the first step into implementation work.

**Requirements:** R5, R6, R7; AE2 (offer signals "you'll walk away with something working", not
"you'll be assessed").

**Dependencies:** U1.

**Files:** `src/components/sections/Services.tsx` (consider renaming the section heading/intent;
keep `id` stable or update Header/Footer anchors in U1 to match).

**Approach:**
- Replace the `services` array (M365 Optimization, Google Workplace, License Optimization, Cloud
  Migration) with AI Jumpstart content: a clear offer statement with the build-explicit tagline
  from origin R6, plus a "how it works" sequence conveying the wedge-into-implementation path
  (Jumpstart → working proof → bigger build).
- **Layout: a numbered 3-step sequence, not the current 2×2 parallel grid.** The offer's whole
  message is "this is step one of a larger engagement" (R7), so the layout must read as
  sequential/causal, not as a menu of comparable options. Render three steps using the existing
  `Section`/`Card` + `itemVariants` primitives, signaling order with a visible step affordance —
  a large background step numeral inside each card (e.g., `text-primary/20` numeral) or a row
  layout with `ArrowRight` connectors between steps. Do not ship three equal-weight parallel cards.
- Frame around business outcomes, not "I write code" and not "I assess your readiness."
- Keep `id="services"` (per the U1 anchor decision); if it changes, update Header/Footer anchors
  in lockstep.

**Patterns to follow:** existing `services` array + `Card` grid; `Section` with `background` prop;
`itemVariants` stagger.

**Test scenarios:**
- Covers AE2. The offer copy signals a built deliverable ("I'll build and hand you a working
  AI workflow") and contains no "audit/assessment/grade" framing.
- The section names the offer exactly as "AI Jumpstart" and includes the build-explicit tagline.
- Copy communicates the Jumpstart as a first step toward implementation (R7), not a standalone
  one-off.
- No card in the section sells M365/Google/cloud optimization.

**Verification:** A visitor reads one clear entry offer, understands they get something built,
and sees it as step one of a larger engagement.

---

### U4. CaseStudies → built-product portfolio

**Goal:** Replace the cost-savings case studies with a portfolio of Arturo's two shipped,
AI-built products as the site's primary proof.

**Requirements:** R8, R9; supports R3 (specific proof over hype).

**Dependencies:** U1.

**Files:** `src/components/sections/CaseStudies.tsx` (rename section to `id="work"` per the U1
anchor decision; Header/Footer anchors are updated in U1).

**Approach:**
- Replace the `caseStudies` array ("Retail Chain Saves $45,000", "Accounting Firm…") with two
  entries: the location-aware Expo staff-attendance app (beta) and the Texas Head Start /
  Early Head Start data-viz site (live, linkable). Each entry: what it does, that Arturo built it
  with AI tools at speed (R9), and proof affordance (live link for Head Start; redacted
  representation for the beta app).
- Reframe the section heading/intro from "measurable results through cloud optimization" to
  "things I've built." Replace the cost-savings `result` badge with a build/impact descriptor.
- Add a screenshot image slot to each card (the current card has no `<img>`). Until assets
  arrive, render a defined placeholder — a `bg-muted rounded-md` container at a fixed
  `aspect-video` ratio with `aria-label="Screenshot coming soon"` — above the text block. This
  ships publicly in the placeholder state, so it must not collapse the layout or render an empty
  `<img src="">`. Keep the `Card`/`CardContent` layout and motion.
- Remove or repoint the "View All Case Studies" / "Read More" buttons (no destinations yet) —
  prefer a real outbound link for the Head Start site.

**Patterns to follow:** existing `caseStudies` array + `Card`/`CardContent` grid; category badge;
`framer-motion` stagger.

**Test scenarios:**
- The portfolio renders exactly the two built products; no "$X saved" cost-savings case study
  remains.
- The Head Start entry includes a working outbound link to `texasheadstartgrantees.online`.
- Each entry attributes the build to Arturo using AI tools (R9 framing present).
- No dead "Read More"/"View All" link points to a non-existent destination.

**Verification:** Proof section shows two real, attributable products; the live one is clickable;
no fabricated metrics.

---

### U5. About → first-person founder bio

**Goal:** Rewrite About from an anonymous "Our team / Our Story" firm narrative into a
first-person founder bio for Arturo, with stats reframed as competence/trust signals.

**Requirements:** R2, R12; AE4 (first-person founder story, no "our team"/anonymous-firm language).

**Dependencies:** U1.

**Files:** `src/components/sections/About.tsx`

**Approach:**
- Rewrite the three "Our Story" paragraphs into a first-person bio: who Arturo is, that he builds
  production software with AI tools, and the M365 incumbency as a single trust signal (R4) rather
  than a service pitch.
- Reframe the `stats` array (200+ Clients, 98% Retention, 10+ Years) as competence/trust proof
  consistent with the new identity; keep, relabel, or trim per fit — do not present them as
  cloud-cost metrics.
- **Headshot placement:** the left column (currently the decorative inset prose card) becomes a
  founder-headshot container — `aspect-[3/4]` or `aspect-square`, max-width constrained — with a
  `bg-muted rounded-lg` placeholder until the photo is supplied; the bio prose moves to the right
  column above/around the reframed stats. Pick one arrangement and keep the existing two-column
  grid; do not leave the slot unspecified.
- Remove "our team"/"decades of experience"/anonymous-firm phrasing.

**Patterns to follow:** existing two-column About layout; `stats` array + icon; `useInView`
entrance animation.

**Test scenarios:**
- Covers AE4. About copy is first-person (Arturo) and contains no "our team"/"our story as a
  firm" language.
- M365/cloud experience appears only as a trust signal, not as a sold service.
- Stats, if retained, are framed as competence/trust and not as cloud-cost-savings outcomes.

**Verification:** About reads as one named human who personally ships; founder credibility is the
throughline.

---

### U6. Clients section: trust strip + who-I-help vignette

**Goal:** Reframe the Clients section to keep genuine trust signals (client logos) while retiring
cost/M365-framed testimonials, and add the anonymized "Copilot CEO" who-I-help vignette.

**Requirements:** R4, R10; supports R3.

**Dependencies:** U1.

**Files:** `src/components/sections/Clients.tsx`

**Approach:**
- Keep the client-logo grid as a "trusted by" strip (incumbency/trust signal); rewrite the
  section heading/intro away from "optimize their cloud services."
- Retire the two cost/M365-specific testimonials (per Key Technical Decisions — no fabrication,
  no altering real quotes). If a light-touch trust quote is retained, it must not assert
  cost-savings or M365 specifics and must preserve the speaker's real meaning.
- Add the anonymized "a CEO with a Copilot license and no roadmap" vignette (R10) as a
  "this is who I help" element below the logo strip. It replaces the two-column testimonial grid
  with a **single full-width or centered card** (`col-span-2` or `max-w-2xl mx-auto`) so a lone
  card does not render half-width in the old two-column container. Keep it short so it doesn't
  dilute the trust-strip read; if it grows long, fold it into U3's offer section instead.

**Patterns to follow:** existing `clients`/`testimonials` arrays; `Card` grid; logo image slots.

**Test scenarios:**
- No testimonial asserting M365 cost savings or cloud optimization remains.
- The section intro contains no "optimize your cloud services" framing.
- The who-I-help vignette is present and anonymized (no real client name attached to the Copilot
  story).
- Client logos still render as a trust strip.

**Verification:** The section reads as trust + ideal-customer fit for the AI offer, with no
cost-optimization social proof.

---

### U7. Contact: AI-framed copy and synchronized form options

**Goal:** Reframe the Contact section copy to the AI offer and update the "Service of Interest"
options, keeping the visible form and the `index.html` hidden Netlify form in exact sync.

**Requirements:** R5 (entry path to the offer), R4; supports R1.

**Dependencies:** U1 (option values are decided once and applied to both files), U3 (offer naming).

**Files:**
- `src/components/sections/Contact.tsx` (intro copy, `<select>` options — U7 owns)
- `index.html`, `public/contact.html` (hidden-form `<option>`s — **edited in U1**; U7 only
  verifies the values match)

**Approach:**
- Rewrite the intro ("Ready to optimize your cloud services?") to invite an AI Jumpstart
  conversation.
- Replace the `Contact.tsx` `service` `<select>` options (microsoft365 / googleWorkplace /
  license / migration) with AI-offer options (e.g., AI Jumpstart / custom AI build / not sure yet).
  The static hidden forms get the identical `value`s in U1 (single owner); U7 verifies the match.
- The form submits via a native browser POST — `handleSubmit` never calls `preventDefault`, so the
  `<option>` `value` strings in the JSX are load-bearing (React `formState.service` is not the
  submission source of truth). Edit the `<option>` elements directly.
- Keep all Netlify wiring (`data-netlify`, honeypot, `form-name`, `/success` action, `_redirects`)
  and contact details unchanged.

**Patterns to follow:** existing controlled-form pattern in `Contact.tsx`; the hidden-form
mirror in `index.html`.

**Test scenarios:**
- The visible `<select>` option values exactly equal the `index.html` hidden-form option values
  (string equality), preserving Netlify form detection.
- Contact intro copy contains no "optimize your cloud services" framing.
- Submitting the form still posts `form-name=contact` and redirects to `/success` (Netlify wiring
  intact).
- Option labels reflect the AI offer, not M365/Google/cloud services.

**Verification:** Contact reads as an invitation into the AI Jumpstart; form submits successfully
through Netlify with the new options; no field-name drift between the two forms.

---

## System-Wide Impact

- **SEO/metadata:** `index.html` title + description change reframes search/social presentation;
  acceptable and intended (origin: full replace). No route or URL changes.
- **Netlify Forms:** the option sync across **three** form copies (`index.html`,
  `public/contact.html`, `Contact.tsx`) is the one place a content change can break a functional
  pipeline or ship stale M365 labels — covered by U1/U7 test scenarios. U1 owns the static-form
  edits, U7 verifies.
- **Anchors:** the CaseStudies section is renamed `id="case-studies"` → `id="work"`; Header and
  Footer anchor hrefs are updated in U1 in the same change. All other section `id`s are held
  stable, so no other anchor drift is expected.
- **No backend, data model, auth, or dependency changes.** Visual system and component primitives
  are unchanged.

---

## Open Questions

### Resolve before/at planning — resolved
- Offer name → **AI Jumpstart** (origin, resolved).
- Testimonials/logos → retire cost-specific quotes, keep logos as a trust strip (confirmed in
  plan scoping synthesis).
- Contact dropdown → reframe options to the AI offer and sync the Netlify form (confirmed).
- Visual assets → ship with placeholders, swap when supplied (confirmed).
- Portfolio section `id`/nav label → renamed `id="work"`, nav "Work"; all other section `id`s
  held stable (resolved in doc review).

### Resolve during U1 (cheap, before chrome is finalized)
- **`public/contact.html`: keep-and-sync or delete?** It is a second static Netlify detection
  form duplicating `index.html`'s hidden form, and `src/main.tsx` already serves the real
  `/success` route. Verify it is redundant; prefer deleting it. If kept, it must carry the new
  option values. Do not leave it on the old M365 options.

### Deferred to implementation
- Exact wording of the AI Jumpstart tagline and how-it-works step copy (within R5–R7 intent).
- How the in-beta Expo app is represented without exposing client data (redaction vs. mockup).

---

## Sources & Research

- Origin requirements: `docs/brainstorms/2026-06-01-ai-consultancy-pivot-requirements.md`.
- Codebase scan: content is hardcoded inline per section (`src/components/sections/*`), assembled
  in `src/App.tsx`; chrome in `src/components/layout/*`; global metadata + hidden Netlify form in
  `index.html`; design tokens via Tailwind; animation via `framer-motion`; icons via
  `lucide-react`. No central content module, no `docs/solutions/` learnings, no `STRATEGY.md`.
- Live proof asset confirmed linkable: `texasheadstartgrantees.online`.
