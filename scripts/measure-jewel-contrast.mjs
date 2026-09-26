/**
 * Sample jewel panel contrast at the lightest edge behind copy (375 / 768 / 1280).
 * Local only. Requires devDependency puppeteer (.npmrc skips Chromium on CI/Vercel).
 * First run locally: npx puppeteer browsers install chrome
 * Usage: node scripts/measure-jewel-contrast.mjs http://127.0.0.1:PORT/
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let puppeteer;
try {
  puppeteer = require('puppeteer');
} catch {
  console.error('Missing puppeteer. Run: npm install (dev) then npx puppeteer browsers install chrome');
  process.exit(1);
}

const WIDTHS = [375, 768, 1280];

const OLD_RAMPS = {
  'jewel-purple-icon-top': 'linear-gradient(180deg, #A661F2 0%, #6E2EB0 58%)',
  'jewel-purple-copy-left': 'linear-gradient(90deg, #6E2EB0 0%, #6E2EB0 46%, #A661F2 100%)',
  'jewel-purple-copy-center': 'linear-gradient(180deg, #A661F2 0%, #6E2EB0 40%, #6E2EB0 100%)',
  'jewel-purple-copy-top': 'linear-gradient(180deg, #6E2EB0 0%, #6E2EB0 62%, #A661F2 100%)',
  'jewel-blue-icon-top': 'linear-gradient(180deg, #61A5F2 0%, #2E5FB0 55%)',
  'jewel-indigo-icon-top': 'linear-gradient(180deg, #6170F2 0%, #2E38B0 55%)',
  'jewel-indigo-copy-left': 'linear-gradient(90deg, #2E38B0 0%, #2E38B0 46%, #6170F2 100%)',
  'jewel-indigo-copy-top': 'linear-gradient(180deg, #2E38B0 0%, #2E38B0 68%, #6170F2 100%)',
  'jewel-red-copy-left': 'linear-gradient(90deg, #B02E2E 0%, #B02E2E 42%, #F26161 100%)',
  'jewel-red-copy-top': 'linear-gradient(180deg, #B02E2E 0%, #B02E2E 62%, #F26161 100%)',
  'jewel-pink-icon-top': 'linear-gradient(180deg, #F2619E 0%, #B02E5E 55%)',
  'jewel-magenta-icon-top': 'linear-gradient(180deg, #E161F2 0%, #B02EAE 55%)',
  'jewel-red-icon-top': 'linear-gradient(180deg, #F26161 0%, #B02E2E 55%)',
  'jewel-indigo-icon-top-a6': 'linear-gradient(180deg, #6170F2 0%, #2E38A6 55%)',
};

const NEW_RAMPS = {
  'jewel-purple-icon-top': 'linear-gradient(180deg, #A661F2 0%, #6E2EB0 42%)',
  'jewel-purple-copy-left': 'linear-gradient(90deg, #6E2EB0 0%, #6E2EB0 80%, #A661F2 100%)',
  'jewel-purple-copy-center': 'linear-gradient(180deg, #A661F2 0%, #6E2EB0 22%, #6E2EB0 100%)',
  'jewel-purple-copy-top': 'linear-gradient(180deg, #6E2EB0 0%, #6E2EB0 72%, #A661F2 100%)',
  'jewel-blue-icon-top': 'linear-gradient(180deg, #61A5F2 0%, #2E5FB0 34%)',
  'jewel-indigo-icon-top': 'linear-gradient(180deg, #6170F2 0%, #2E38B0 42%)',
  'jewel-indigo-copy-left': 'linear-gradient(90deg, #2E38B0 0%, #2E38B0 80%, #6170F2 100%)',
  'jewel-indigo-copy-top': 'linear-gradient(180deg, #2E38B0 0%, #2E38B0 74%, #6170F2 100%)',
  'jewel-red-copy-left': 'linear-gradient(90deg, #B02E2E 0%, #B02E2E 92%, #F26161 100%)',
  'jewel-red-copy-top': 'linear-gradient(180deg, #B02E2E 0%, #B02E2E 78%, #F26161 100%)',
  'jewel-pink-icon-top': 'linear-gradient(180deg, #F2619E 0%, #B02E5E 42%)',
  'jewel-magenta-icon-top': 'linear-gradient(180deg, #E161F2 0%, #B02EAE 42%)',
  'jewel-red-icon-top': 'linear-gradient(180deg, #F26161 0%, #B02E2E 42%)',
  'jewel-indigo-icon-top-a6': 'linear-gradient(180deg, #6170F2 0%, #2E38A6 42%)',
};

function hexRgb(h) {
  const x = h.replace('#', '');
  return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)];
}
function lin(c) {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function lum(rgb) {
  return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
}
function contrast(fg, bg) {
  const L1 = lum(fg);
  const L2 = lum(bg);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}
function blend(fg, bg, a) {
  return fg.map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
}

function parseStops(css) {
  const m = css.match(/linear-gradient\(([^)]+)\)/);
  if (!m) return null;
  const parts = m[1].split(',').map((s) => s.trim());
  const angle = parts[0].includes('deg') ? parseFloat(parts[0]) : 180;
  const stops = parts.slice(parts[0].includes('deg') ? 1 : 0).map((p) => {
    const bits = p.split(/\s+/);
    const color = bits[0].startsWith('#') ? bits[0] : bits[0];
    let pos = bits[1] ? parseFloat(bits[1]) / 100 : null;
    return { color: hexRgb(color), pos };
  });
  for (let i = 0; i < stops.length; i++) {
    if (stops[i].pos == null) stops[i].pos = i / (stops.length - 1);
  }
  return { angle, stops };
}

function sampleLinear(stopsSpec, angleDeg, px, py, w, h) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const corners = [
    [0, 0],
    [w, 0],
    [0, h],
    [w, h],
  ];
  let minP = Infinity;
  let maxP = -Infinity;
  for (const [cx, cy] of corners) {
    const p = cx * dx + cy * dy;
    minP = Math.min(minP, p);
    maxP = Math.max(maxP, p);
  }
  const p = px * dx + py * dy;
  const t = (p - minP) / (maxP - minP);
  const { stops } = stopsSpec;
  let i = 0;
  while (i < stops.length - 1 && t > stops[i + 1].pos) i++;
  const a = stops[i];
  const b = stops[Math.min(i + 1, stops.length - 1)];
  const span = b.pos - a.pos || 1;
  const u = Math.max(0, Math.min(1, (t - a.pos) / span));
  const rgb = a.color.map((c, j) => Math.round(c + (b.color[j] - c) * u));
  return rgb;
}

const PANELS = [
  { name: 'Home bento — Consistent', page: '/', panel: '#why .grid > div:nth-child(1)', mode: 'icon-top', rampKey: 'jewel-purple-icon-top', label: 'span.text-micro', h: 'h3', p: 'h3 + p' },
  { name: 'Home bento — Reliable', page: '/', panel: '#why .grid > div:nth-child(2)', mode: 'icon-top', rampKey: 'jewel-blue-icon-top', label: 'span.text-micro', h: 'h3', p: 'p' },
  { name: 'Home bento — Senior', page: '/', panel: '#why .grid > div:nth-child(3)', mode: 'icon-top', rampKey: 'jewel-indigo-icon-top', label: 'span.text-micro', h: 'h3', p: 'p' },
  { name: 'Home bento — Effortless', page: '/', panel: '#why .grid > div:nth-child(4)', mode: 'copy-left', rampKey: 'jewel-red-copy-left', rampKeyMd: 'jewel-red-copy-left', rampKeySm: 'jewel-red-copy-top', label: 'span.text-micro', h: 'h3', p: 'p' },
  { name: 'Home — lead magnet', page: '/', panel: 'section:has(a[href="/design-capacity-formula"]) .rounded-lg', mode: 'copy-left', rampKey: 'jewel-purple-copy-left', rampKeySm: 'jewel-purple-copy-top', label: null, h: 'h2', p: 'p' },
  { name: 'Why — purple card', page: '/why/', panel: '#why .grid > div:nth-child(1)', mode: 'icon-top', rampKey: 'jewel-purple-icon-top', h: 'h3', p: 'p' },
  { name: 'Why — blue card', page: '/why/', panel: '#why .grid > div:nth-child(2)', mode: 'icon-top', rampKey: 'jewel-blue-icon-top', h: 'h3', p: 'p' },
  { name: 'Why — pink card', page: '/why/', panel: '#why .grid > div:nth-child(3)', mode: 'icon-top', rampKey: 'jewel-pink-icon-top', h: 'h3', p: 'p' },
  { name: 'Why — indigo card', page: '/why/', panel: '#why .grid > div:nth-child(4)', mode: 'icon-top', rampKey: 'jewel-indigo-icon-top-a6', h: 'h3', p: 'p' },
  { name: 'Why — magenta card', page: '/why/', panel: '#why .grid > div:nth-child(5)', mode: 'icon-top', rampKey: 'jewel-magenta-icon-top', h: 'h3', p: 'p' },
  { name: 'Why — red card', page: '/why/', panel: '#why .grid > div:nth-child(6)', mode: 'icon-top', rampKey: 'jewel-red-icon-top', h: 'h3', p: 'p' },
  { name: 'Blog index CTA', page: '/blog/', panel: 'section:has(a[href="/design-capacity-formula"]) .rounded-lg', mode: 'copy-left', rampKey: 'jewel-purple-copy-left', rampKeySm: 'jewel-purple-copy-top', h: 'h2', p: 'p' },
  { name: 'Blog article CTA', page: '/blog/why-design-hours-blow-out/', panel: 'section.bg-paper .rounded-lg', mode: 'copy-left', rampKey: 'jewel-purple-copy-left', rampKeySm: 'jewel-purple-copy-top', h: 'h2', p: 'p' },
  { name: 'Resources hero', page: '/resources/', panel: 'section.pt-hero-offset .rounded-lg', mode: 'copy-left', rampKey: 'jewel-purple-copy-left', rampKeySm: 'jewel-purple-copy-top', h: 'h1', p: 'p' },
  { name: 'Capacity calc hero', page: '/capacity-calculator/', panel: 'section.pt-hero-offset .rounded-lg', mode: 'copy-left', rampKey: 'jewel-indigo-copy-left', rampKeySm: 'jewel-indigo-copy-top', h: 'h1', p: 'p.text-lead' },
  { name: 'Formula subscription', page: '/design-capacity-formula/', panel: '.bg-jewel-purple-copy-center', mode: 'copy-center', rampKey: 'jewel-purple-copy-center', h: 'h4', p: 'p' },
  { name: 'Formula CTA', page: '/design-capacity-formula/', panel: '.cs-print-hide.rounded-lg', mode: 'copy-center', rampKey: 'jewel-purple-copy-center', h: 'h2', p: 'p' },
  { name: 'Careers aside', page: '/careers/account-manager/', panel: 'aside.rounded-lg', mode: 'copy-top', rampKey: 'jewel-indigo-copy-top', h: '.text-title', p: '.text-base' },
];

function resolveRampKey(cfg, width) {
  if (cfg.rampKeySm) {
    const mdStack = cfg.name === 'Resources hero' || cfg.name === 'Capacity calc hero';
    if (mdStack && width < 769) return cfg.rampKeySm;
    if (!mdStack && width < 640) return cfg.rampKeySm;
  }
  if (cfg.rampKeyMd && width >= 768) return cfg.rampKeyMd;
  return cfg.rampKey;
}

async function measurePage(page, width, ramps, base) {
  await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
  const out = [];
  for (const cfg of PANELS) {
    const url = base + cfg.page.replace(/^\//, '');
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    const rampKey = resolveRampKey(cfg, width);
    const css = ramps[rampKey];
    const spec = parseStops(css);
    if (!spec) continue;

    const data = await page.evaluate(
      (panelSel, mode, labelSel, hSel, pSel) => {
        const panel = document.querySelector(panelSel);
        if (!panel) return null;
        const pr = panel.getBoundingClientRect();
        function lineEdge(el, edge) {
          if (!el) return null;
          const range = document.createRange();
          range.selectNodeContents(el);
          const rects = [...range.getClientRects()];
          if (!rects.length) {
            const r = el.getBoundingClientRect();
            rects.push(r);
          }
          if (edge === 'top') {
            const r = rects.reduce((a, b) => (a.top < b.top ? a : b));
            return { x: r.left + r.width * 0.15, y: r.top + 2 };
          }
          if (edge === 'right') {
            const r = rects.reduce((a, b) => (a.right > b.right ? a : b));
            return { x: r.right - 2, y: r.top + r.height / 2 };
          }
          if (edge === 'ends') {
            const r = rects[0];
            const left = { x: r.left + 2, y: r.top + r.height / 2 };
            const right = { x: r.right - 2, y: r.top + r.height / 2 };
            return [left, right];
          }
          return null;
        }
        const h = panel.querySelector(hSel);
        const p = panel.querySelector(pSel);
        const label = labelSel ? panel.querySelector(labelSel) : null;
        let points = [];
        if (mode === 'icon-top') {
          points.push({ role: 'heading', ...lineEdge(h, 'top') });
          points.push({ role: 'body', ...lineEdge(p, 'top') });
          if (label) points.push({ role: 'label', ...lineEdge(label, 'top') });
        } else if (mode === 'copy-left') {
          points.push({ role: 'heading', ...lineEdge(h, 'right') });
          points.push({ role: 'body', ...lineEdge(p, 'right') });
          if (label) points.push({ role: 'label', ...lineEdge(label, 'right') });
        } else if (mode === 'copy-center') {
          for (const pt of lineEdge(h, 'ends') || []) points.push({ role: 'heading', ...pt });
          for (const pt of lineEdge(p, 'ends') || []) points.push({ role: 'body', ...pt });
        } else if (mode === 'copy-top') {
          points.push({ role: 'heading', ...lineEdge(h, 'top') });
          points.push({ role: 'body', ...lineEdge(p, 'top') });
        }
        return {
          w: pr.width,
          h: pr.height,
          left: pr.left,
          top: pr.top,
          points: points.filter((x) => x && x.x != null),
        };
      },
      cfg.panel,
      cfg.mode,
      cfg.label,
      cfg.h,
      cfg.p
    );

    if (!data || !data.points.length) {
      out.push({ cfg: cfg.name, width, error: 'no panel' });
      continue;
    }

    const white = hexRgb('#FFFFFF');
    for (const pt of data.points) {
      const px = pt.x - data.left;
      const py = pt.y - data.top;
      const bg = sampleLinear(spec, spec.angle, px, py, data.w, data.h);
      const bodyFg = blend(white, bg, 0.9);
      const isHeading = pt.role === 'heading';
      const fg = isHeading ? white : bodyFg;
      const ratio = contrast(fg, bg);
      out.push({
        panel: cfg.name,
        width,
        role: pt.role,
        bg: `#${bg.map((c) => c.toString(16).padStart(2, '0')).join('')}`,
        ratio: Math.round(ratio * 100) / 100,
        need: isHeading ? 3 : 4.5,
        pass: ratio >= (isHeading ? 3 : 4.5),
      });
    }
  }
  return out;
}

async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:59400/';
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const out = { old: {}, new: {} };
  for (const w of WIDTHS) {
    out.old[w] = await measurePage(page, w, OLD_RAMPS, base);
    out.new[w] = await measurePage(page, w, NEW_RAMPS, base);
  }
  await browser.close();
  console.log(JSON.stringify(out, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
