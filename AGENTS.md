Before creating new styles, check /_internal/styleguide and reuse what exists. New patterns get added to the style guide. (Style guide source today: `/styleguide/`.)

## Design system rules

Use tokens from the style guide. Never hand-type a size, colour, or spacing value when a token exists.

- Page headline: text-h1. Article titles: text-h2. Section headings: text-h2. Feature titles: text-h3. Card, resource, and list titles: text-title. Quotes: text-quote. Prices and display numbers: text-stat.
- Intro lines: text-lead. Body: text-base. Supporting lines: text-small. Labels and meta: text-caption. Tiny labels: text-micro.
- On dark, paragraphs, intros, and card body use text-body-muted. Not labels, nav, buttons, quotes, jewel panels, or the footer.
- On paper, use the paper colours (ink, ink-body, ink-muted, ink-caption). Never put a dark-surface text colour on white.
- Article and job body use leading-long (1.7). Marketing body stays at 1.6.
- Centred paragraphs: max-w-intro. Left-aligned reading text: max-w-prose. Narrow blocks: max-w-column. Wider narrow blocks that already used it: max-w-narrow. Headings keep their widths. Grids use the container.
- Cards: p-card-standard or p-card-compact. Page heroes: pt-hero-offset. Article headers and legal pages keep their own top offset.
- Buttons: btn-mint-sm, btn-mint, or btn-mint-lg. Full-width buttons stay full width. Play: btn-play. Filters: chip. Fields: field, field-label, and their states.
- Button and label text is sentence case. Proper names keep their capitals.

## Standing rules

- One branch only. Commit straight to `main`.
- Images: WebP, max 2× display size, under 250 KB, `width` and `height` set, `loading="lazy"` below the fold (hero may use `fetchpriority="high"`). Run `scripts/optimize-images.mjs` on new images before adding them.
- Units: `h` in figures and tables (e.g. `3–6h`); spell out **hours** only in prose sentences.
- Every indexable page needs `<meta name="description">` and `<meta property="og:description">`, under 155 characters, benefit first. Skip dev-only pages (style guide, seo-dashboard).
- Check /_internal/styleguide before creating new styles.
- **Audience:** Agencies are not an advertised audience. White-label work comes by referral only. Homepage card 3 is “One brand, many locations”. Never add agency-targeted copy back.
- **Copy:** Never frame the reader as doing a job they were not hired for. Describe the problem, not the person.
- **Image tooling:** `sharp` and `to-ico` are devDependencies for `scripts/optimize-images.mjs`.

## Recent session (Sep 2026)

**Built or changed**

- Merged design-system and utility-page type work onto `main`; ongoing commits on `main` only (e.g. asset perf pass, Calendly removal, meta descriptions).
- Sitewide SEO meta on indexable routes; custom description + matching `og:description` on book-a-call, why, work, blog, resources.
- Book a call: Calendly removed; footer restored; `data-booking-form-mount` slot in a glass card (form UI still to build).
- Assets: optimised rasters, self-hosted fonts, minified `style.css`, mint favicons, contrast tweaks on homepage/footer.

**Decisions to respect**

- Do not change homepage sizing except via global CSS unless explicitly asked.
- Legal page heroes stay at 132px top offset; legal outer column 1120px where already set.
- Australian spelling; no em dashes in new marketing copy.
- Booking is async (user submits workload; team replies with times), not inline scheduling.

**Pending**

- Build the book-a-call form inside `data-booking-form-mount` and wire submission (endpoint TBD).
- Remaining indexable pages: add `og:description` where only meta description exists (if parity wanted).
- Privacy copy still mentions “scheduling page”; align when booking form ships.
- Optional: move style guide to `/_internal/styleguide`, Lighthouse/cache follow-ups (only if requested).

**Conventions**

- Book-a-call forms: reuse paper card + `bt-light`, `field`, `field-label`, `field-hint`, `field-error`, `btn-mint` (same as design brief builder).
- Shared chrome: `assets/site-nav.js` and `assets/site-footer.js` on public pages; nav script `defer`.
- CSS: edit `input.css`, run `npm run build:css` (minified output to `style.css`).
