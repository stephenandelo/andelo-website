import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = process.cwd();
const assets = path.join(root, 'assets');

function capFor(name) {
  if (name === 'hero-collage.png') return [1120, 1200];
  if (name.startsWith('trusted-')) {
    const h = {
      'trusted-mask.png': 56,
      'trusted-goodwill.png': 64,
      'trusted-ungc.png': 72,
      'trusted-butcher-crowd.png': 52,
      'trusted-speedfit.png': 44,
      'trusted-scope.png': 60,
      'trusted-bridgit.png': 48,
      'trusted-fitness-cartel.png': 56
    }[name] || 80;
    return [h * 8, h];
  }
  if (name.startsWith('service-')) return [1220, 700];
  if (['home-hannah.png', 'maskco-hannah.png', 'speedfit-matej.png', 'oren-hero.png'].includes(name)) return [840, 1500];
  if (name === 'why-founder.jpg') return [440, 530];
  if (name === 'why-matej-avatar.png') return [104, 104];
  if (name === 'stephen-andelo.jpeg') return [120, 120];
  if (name.startsWith('work-case-')) return [800, 420];
  if (/^work-(port|email|print|pres|social)-/.test(name)) return [1520, 950];
  if (name === 'capacity-cta-panel.png') return [1680, 1200];
  if (['capacity-formula-hero.png', 'resources-hero.png', 'capacity-calculator-hero.png', 'careers-hero.png'].includes(name)) return [1000, 600];
  if (name === 'icon-calculator.png' || name === 'icon-brief.png') return [400, 156];
  if (['blog-hours-blow-out.png', 'blog-design-subscription.png'].includes(name)) return [1280, 860];
  if (['blog-instruction-vs-direction.jpg', 'blog-good-output-good-input.jpg'].includes(name)) return [1440, 900];
  if (name.startsWith('blog-')) return [760, 400];
  return [1600, 1600];
}

async function hasTransparency(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const step = Math.max(1, Math.floor(data.length / (info.width * 4) / 4000)) * 4;
  for (let i = 3; i < data.length; i += step) {
    if (data[i] < 250) return true;
  }
  return false;
}

async function encode(buf, transparent, maxW, maxH) {
  const base = sharp(buf).rotate().resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true });
  if (transparent) {
    let quality = 90;
    for (let attempt = 0; attempt < 6; attempt++) {
      const out = await base.clone().png({ compressionLevel: 9, quality, palette: true }).toBuffer();
      const meta = await sharp(out).metadata();
      if (out.length <= 250 * 1024) return { out, w: meta.width, h: meta.height, ext: '.png', bytes: out.length };
      quality -= 12;
    }
  }
  let q = 78;
  for (let attempt = 0; attempt < 8; attempt++) {
    const out = await sharp(buf).rotate().resize({ width: maxW, height: maxH, fit: 'inside', withoutEnlargement: true }).webp({ quality: q, effort: 4, alphaQuality: q }).toBuffer();
    const meta = await sharp(out).metadata();
    if (out.length <= 250 * 1024 || q <= 46) return { out, w: meta.width, h: meta.height, ext: '.webp', bytes: out.length };
    q -= 8;
  }
}

const files = fs.readdirSync(assets).filter((f) => /\.(png|jpe?g)$/i.test(f) && !f.startsWith('.'));
const map = {};
const skipped = [];
for (const file of files) {
  const full = path.join(assets, file);
  const [maxW, maxH] = capFor(file);
  const transparent = file.endsWith('.png') && await hasTransparency(full);
  const input = fs.readFileSync(full);
  const made = await encode(input, transparent, maxW, maxH);
  const next = file.replace(/\.(png|jpe?g)$/i, made.ext);
  if (next !== file) fs.writeFileSync(path.join(assets, next), made.out);
  else fs.writeFileSync(full, made.out);
  if (next !== file) fs.unlinkSync(full);
  map[file] = { next, w: made.w, h: made.h, bytes: made.bytes, transparent };
  if (made.bytes > 250 * 1024) skipped.push(next + ' ' + Math.round(made.bytes / 1024) + 'KB');
  console.log(file, '->', next, made.w + 'x' + made.h, Math.round(made.bytes / 1024) + 'KB', transparent ? 'png-alpha' : 'webp');
}

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'scripts') continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (/\.(html|js|css)$/.test(name)) out.push(p);
  }
  return out;
}

const dims = {};
for (const [from, info] of Object.entries(map)) dims[info.next] = info;

for (const file of walk(root)) {
  let text = fs.readFileSync(file, 'utf8');
  let changed = false;
  for (const [from, info] of Object.entries(map)) {
    if (from === info.next) continue;
    if (text.includes(from)) {
      text = text.split(from).join(info.next);
      changed = true;
    }
  }
  if (file.endsWith('.html')) {
    const next = text.replace(/<img\b[^>]*>/gi, (tag) => {
      const srcM = tag.match(/\ssrc=["']([^"']+)["']/);
      if (!srcM) return tag;
      const base = srcM[1].split('/').pop().split('?')[0];
      if (!dims[base]) return tag;
      const hero = /fetchpriority|hero-collage|hero-vid-img|careers-hero|capacity-calculator-hero|resources-hero|capacity-formula-hero/.test(tag);
      let t = tag.replace(/\s(?:width|height|loading|fetchpriority)=["'][^"']*["']/gi, '');
      const extra = ` width="${dims[base].w}" height="${dims[base].h}"` + (hero ? ' fetchpriority="high"' : ' loading="lazy"');
      t = t.replace(/\s*\/?>$/, extra + (t.trimEnd().endsWith('/>') ? ' />' : '>'));
      return t;
    });
    if (next !== text) { text = next; changed = true; }
    const beforeHead = text;
    text = text
      .replace(/\n?<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com">/g, '')
      .replace(/\n?<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>/g, '')
      .replace(/\n?<link href="https:\/\/fonts\.googleapis\.com\/css2[^"]+" rel="stylesheet">/g, '')
      .replace(/\n?<link href="https:\/\/assets\.calendly\.com\/assets\/external\/widget\.css" rel="stylesheet" data-calendly-css>/g, '')
      .replace(/\n?<script src="https:\/\/assets\.calendly\.com\/assets\/external\/widget\.js" type="text\/javascript" async data-calendly-js><\/script>/g, '')
      .replace(/<script src="(\/assets\/site-nav\.js)"><\/script>/g, '<script src="$1" defer></script>');
    if (!text.includes('rel="icon"') && text.includes('</head>')) {
      const links = '\n<link rel="icon" href="/favicon.ico" sizes="32x32">\n<link rel="icon" href="/icon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">';
      text = text.replace('</head>', links + '\n</head>');
    }
    if (text !== beforeHead) changed = true;
  }
  if (changed) fs.writeFileSync(file, text);
}

fs.writeFileSync(path.join(root, 'scripts', 'image-dims.json'), JSON.stringify(dims, null, 2));

const mint = { r: 61, g: 230, b: 140 };
const png16 = await sharp({ create: { width: 16, height: 16, channels: 3, background: mint } }).png().toBuffer();
const png32 = await sharp({ create: { width: 32, height: 32, channels: 3, background: mint } }).png().toBuffer();
const apple = await sharp({ create: { width: 180, height: 180, channels: 3, background: mint } }).png().toBuffer();
fs.writeFileSync(path.join(root, 'favicon.ico'), await toIco([png16, png32]));
fs.writeFileSync(path.join(root, 'apple-touch-icon.png'), apple);
fs.writeFileSync(path.join(root, 'icon.svg'), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#3DE68C"/></svg>\n');

console.log('OVER 250KB', skipped.length ? skipped.join('\n') : 'none');
