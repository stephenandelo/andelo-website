Before creating new styles, check /styleguide/ and reuse what exists. New patterns get added to the style guide.

## Design system rules

Use tokens from the style guide. Never hand-type a size, colour, or spacing value when a token exists.

- Page headline: text-h1. Article titles: text-h2. Section headings: text-h2. Feature titles: text-h3. Card, resource, and list titles: text-title. Quotes: text-quote. Prices and display numbers: text-stat.
- Intro lines: text-lead. Body: text-base. Supporting lines: text-small. Labels and meta: text-caption. Tiny labels: text-micro.
- On dark, paragraphs, intros, and card body use text-body-muted. Not labels, nav, buttons, quotes, jewel panels, or the footer.
- On paper, use the paper colours (ink, ink-body, ink-muted, ink-caption). Never put a dark-surface text colour on white.
- Article and job body use leading-long (1.7). Marketing body stays at 1.6.
- Centred paragraphs: max-w-intro. Left-aligned reading text: max-w-prose. Narrow blocks: max-w-column. Wider narrow blocks that already used it: max-w-narrow. Headings keep their widths. Grids use the container.
- Cards: p-card-standard or p-card-compact. Page heroes: pt-hero-offset. Legal page heroes stay at 132px top offset; legal outer column 1120px.
- Buttons: btn-mint-sm, btn-mint, or btn-mint-lg. Full-width buttons stay full width. Play: btn-play. Filters: chip. Fields: field, field-label, and their states on paper; field-dark, field-label-dark, field-error-dark on dark surfaces.
- Field text uses text-small (16.5px) so iPhone Safari does not zoom on focus. Hints and placeholders on paper use ink-caption / text-caption.
- Dark fields: fill `--color-field-dark-fill` (4% white), border `--color-field-dark-border` (9% white), mint border on focus with the usual focus ring, placeholder `text-body-caption` (#8388AE), errors `--color-status-red` (#FF9494) not status-redInk.
- Button and label text is sentence case. Proper names keep their capitals.

## Standing rules

- One branch only. Commit straight to `main` unless Stephen asks for a review branch.
- Images: WebP, max 2× display size, under 250 KB, `width` and `height` set, `loading="lazy"` below the fold (hero may use `fetchpriority="high"`). Run `scripts/optimize-images.mjs` on new images before adding them.
- Units: `h` in figures and tables (e.g. `3–6h`); spell out **hours** only in prose sentences.
- Every indexable page needs `<meta name="description">` and `<meta property="og:description">`, under 155 characters, benefit first. Skip dev-only pages (style guide, seo-dashboard).
- Check /styleguide/ before creating new styles.
- **Audience:** Agencies are not an advertised audience. White-label work comes by referral only. Homepage card 3 is “One brand, many locations”. Never add agency-targeted copy back.
- **Copy:** Never frame the reader as doing a job they were not hired for. Describe the problem, not the person.
- **Image tooling:** `sharp` and `to-ico` are devDependencies for `scripts/optimize-images.mjs`.

## Recent session (Sep 2026)

**Built or changed**

- Design-system rollout on marketing, tools, careers, blog, case studies, and utility pages (type, paper tokens, fields).
- Book a call: enquiry form on dark (`field-dark`), RPC-backed API on Vercel, Resend notify + placeholder auto-reply, draft in localStorage.
- Assets: WebP rasters, self-hosted fonts, minified `style.css`, mint favicons, Calendly removed, preview `*.vercel.app` noindex.
- Meta descriptions on indexable routes; privacy policy aligned with enquiry form.
- Style guide: utility pages table, ink-caption, leading-long, dark fields, layout tokens.

**Decisions to respect**

- Do not change homepage sizing except via global CSS unless explicitly asked.
- Australian spelling; no em dashes in new marketing copy.
- Booking is async (submit enquiry; team replies with times), not inline scheduling.
- Jewel panel copy on the homepage: report contrast issues, do not “fix” by breaking the jewel pattern without approval.

**Pending**

- Stream migration 076 + Vercel env for book-a-call (Supabase RPC secret, Resend, rate salt).
- Replace auto-reply template (remove `AUTO_REPLY_PLACEHOLDER`) before sending visitor email.
- `og:description` parity on routes that only have meta description today.
- Optional: Lighthouse/cache on production CDN headers.

**Conventions**

- Book a call: `card-glass` + `field-dark` (not paper `bt-light`). Design brief builder stays paper + `field`.
- Shared chrome: `assets/site-nav.js` and `assets/site-footer.js` on public pages; nav script `defer`.
- CSS: edit `input.css`, run `npm run build:css` (minified output to `style.css`).
