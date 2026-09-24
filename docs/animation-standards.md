# Animation standards — andelo-website

Motion guides attention and confirms interaction. It never decorates for its own sake.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **Live house curve** (default exit / settle). Source of truth for the site; older materials that cite `0.16, 0.8, 0.24, 1` are superseded. |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Balanced enter/exit |
| `--dur-fast` | `150ms` | Hover, focus, button press |
| `--dur-base` | `250ms` | Menus, dropdowns, tabs, accordions |
| `--dur-slow` | `500ms` | Scroll reveals, section entrances |

Transitions: nothing longer than `700ms`. The cap does not apply to ambient loops (see rule 11).

## Rules

1. Never animate layout properties (`width`, `height`, `max-height`, `top`, `left`, `margin`, `padding`). Colour, background, border, shadow, transform and opacity are fine.
2. Scroll reveals: fade in and move up 16–24px, trigger once when 15% visible, using one shared IntersectionObserver script. Never re-trigger on scroll up.
3. Stagger: max 80ms between items, max 6 items per group. After 6, the rest appear together.
4. Above the fold: headline and main CTA are visible immediately, no reveal delay. Supporting elements may fade in within 300ms.
5. Hover effects only inside `@media (hover: hover)`, so touch devices don't get stuck states.
6. Every animation respects `prefers-reduced-motion`: no movement, opacity changes instant or under 100ms.
7. No layout shift. Reserve space for anything that animates in.
8. `will-change` only on elements while they animate.
9. No animation libraries unless already in the project. CSS first, small vanilla JS for scroll triggers.
10. Same component gets the same animation on every page.
11. Ambient loops (marquee, background glow) are allowed, max 2 per page. They must pause when off-screen and stop fully under `prefers-reduced-motion`. The 700ms cap applies to transitions, not loops.
