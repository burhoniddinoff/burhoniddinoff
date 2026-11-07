// Generates every image the profile README uses. All text is converted to
// vector paths, so the SVGs need no web fonts and no third-party image service.
// Run: npm install --ignore-scripts && npm run build
import fs from 'node:fs';
import path from 'node:path';
import opentype from 'opentype.js';
import { Resvg } from '@resvg/resvg-js';

const root = path.resolve(import.meta.dirname, '..');
const assets = path.join(root, 'assets');
const chipsDir = path.join(assets, 'chips');
const fontsDir = path.join(root, '.fonts');
for (const d of [assets, chipsDir, fontsDir]) fs.mkdirSync(d, { recursive: true });

// Brand tokens, same values as the Akuma portfolio.
const C = {
  bg: '#0A0C13', card: '#141826', card2: '#1A1F30',
  fg: '#ECEEF5', muted: '#8B91A8', dim: '#5D6379',
  indigo: '#7B8BFF', saffron: '#F4B740', madder: '#E8604A', teal: '#38C9B6',
};
const THREADS = [C.indigo, C.saffron, C.madder, C.teal];

// Google Fonts serves plain TTF to clients that are not browsers.
async function loadFont(key, query) {
  const file = path.join(fontsDir, `${key}.ttf`);
  if (!fs.existsSync(file)) {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`, {
      headers: { 'User-Agent': 'profile-assets-build' },
    })).text();
    const url = css.match(/url\((https:[^)]+)\)/)?.[1];
    if (!url) throw new Error(`No TTF for ${key}: ${css.slice(0, 200)}`);
    fs.writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
  }
  const b = fs.readFileSync(file);
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength));
}

const fonts = {
  mark: await loadFont('dela', 'family=Dela+Gothic+One&text=AKUMA'),
  head: await loadFont('bricolage', 'family=Bricolage+Grotesque:opsz,wdth,wght@96,80,800'),
  body: await loadFont('onest', 'family=Onest:wght@400'),
  chip: await loadFont('onest500', 'family=Onest:wght@500'),
  mono: await loadFont('jbmono', 'family=JetBrains+Mono:wght@500'),
  jp: await loadFont('notojp', `family=Noto+Sans+JP&text=${encodeURIComponent('悪魔・アクマ')}`),
};

const width = (font, s, size, ls = 0) => font.getAdvanceWidth(s, size, { letterSpacing: ls, kerning: true });
const d = (font, s, x, y, size, ls = 0) =>
  font.getPath(s, x, y, size, { letterSpacing: ls, kerning: true }).toPathData(2);

// The portfolio logo: a 10x10 twill weave in the four thread colours.
function weaveCells(cols, rows, pitch, cell, ox = 0, oy = 0) {
  let out = '';
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    if ((i + j) % 4 < 2) {
      out += `<rect x="${ox + i * pitch}" y="${oy + j * pitch}" width="${cell}" height="${cell}" fill="${THREADS[(i >> 1) % 4]}"/>`;
    }
  }
  return out;
}

function hero() {
  const W = 1280, H = 520, P = 60, RIB = 24;
  const ghostSize = 300;
  const ghostW = width(fonts.mark, 'AKUMA', ghostSize, 0.02);
  const ghost = d(fonts.mark, 'AKUMA', (W - ghostW) / 2, 300, ghostSize, 0.02);

  const hs = 112, hl = -0.03;
  const y1 = 276, y2 = y1 + hs * 0.98;
  const pre = 'Bots, sites, ';
  const em = '1C automation';
  const preW = width(fonts.head, pre, hs, hl);

  const eyebrow = 'SOFTWARE DEVELOPER  /  ANDIJAN, UZBEKISTAN';
  const sub = 'From the problem to the server, one person.';
  const jp = ['悪', '魔', '・', 'ア', 'ク', 'マ'];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Akuma. Bots, sites, 1C automation and AI video.">
<title>Akuma. Bots, sites, 1C automation and AI video.</title>
<defs>
<clipPath id="card"><rect width="${W}" height="${H}" rx="26"/></clipPath>
<linearGradient id="em" x1="0" y1="0" x2="1" y2="0.18"><stop offset="0" stop-color="${C.indigo}"/><stop offset=".7" stop-color="${C.saffron}"/></linearGradient>
<radialGradient id="glow" cx=".82" cy=".1" r=".75"><stop offset="0" stop-color="${C.indigo}" stop-opacity=".16"/><stop offset="1" stop-color="${C.indigo}" stop-opacity="0"/></radialGradient>
<pattern id="warp" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M.5 0V32" stroke="${C.fg}" stroke-opacity=".03"/></pattern>
<pattern id="cloth" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="${C.card2}"/>${weaveCells(8, 4, 6, 5)}</pattern>
</defs>
<style>
.cloth{animation:loom 7s linear infinite}
.ping{transform-box:fill-box;transform-origin:center;animation:ping 2.8s ease-out infinite}
@keyframes loom{to{transform:translateX(-48px)}}
@keyframes ping{0%{transform:scale(.6);opacity:.55}80%,100%{transform:scale(2.3);opacity:0}}
@media (prefers-reduced-motion:reduce){.cloth,.ping{animation:none}.ping{opacity:.25}}
</style>
<g clip-path="url(#card)">
<rect width="${W}" height="${H}" fill="${C.bg}"/>
<rect width="${W}" height="${H}" fill="url(#warp)"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<path d="${ghost}" fill="none" stroke="${C.fg}" stroke-opacity=".075" stroke-width="1.5"/>
<g transform="translate(${P} 50)"><rect width="46" height="46" rx="8" fill="${C.card2}"/><g transform="translate(1.5 1.5) scale(.72)">${weaveCells(10, 10, 6, 5, 0.5, 0.5)}</g></g>
<path d="${d(fonts.mark, 'AKUMA', P + 60, 85, 30, 0.04)}" fill="${C.fg}"/>
${jp.map((c, i) => `<path d="${d(fonts.jp, c, W - P - 22, 78 + i * 31, 22)}" fill="${C.dim}"/>`).join('')}
<circle class="ping" cx="${P + 7}" cy="151" r="8" fill="${C.teal}"/>
<circle cx="${P + 7}" cy="151" r="7" fill="${C.teal}"/>
<path d="${d(fonts.mono, eyebrow, P + 30, 159, 22, 0.09)}" fill="${C.muted}"/>
<path d="${d(fonts.head, pre, P, y1, hs, hl)}" fill="${C.fg}"/>
<path d="${d(fonts.head, em, P + preW, y1, hs, hl)}" fill="url(#em)"/>
<path d="${d(fonts.head, 'and AI video.', P, y2, hs, hl)}" fill="${C.fg}"/>
<path d="${d(fonts.body, sub, P, H - RIB - 32, 27)}" fill="${C.muted}"/>
<rect class="cloth" y="${H - RIB}" width="${W + 96}" height="${RIB}" fill="url(#cloth)"/>
</g>
</svg>
`;
}

function ribbon() {
  const W = 1280, H = 18;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="presentation">
<defs><clipPath id="c"><rect width="${W}" height="${H}" rx="5"/></clipPath>
<pattern id="cloth" width="48" height="24" patternUnits="userSpaceOnUse"><rect width="48" height="24" fill="${C.card2}"/>${weaveCells(8, 4, 6, 5)}</pattern></defs>
<style>.cloth{animation:loom 7s linear infinite}@keyframes loom{to{transform:translateX(-48px)}}@media (prefers-reduced-motion:reduce){.cloth{animation:none}}</style>
<g clip-path="url(#c)"><rect class="cloth" width="${W + 96}" height="${H}" fill="url(#cloth)"/></g>
</svg>
`;
}

function iconPath(slug) {
  const f = path.join(root, 'node_modules/simple-icons/icons', `${slug}.svg`);
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').match(/ d="([^"]+)"/)[1] : null;
}

// Each chip carries its own background, so it reads on light and dark GitHub
// themes, and wraps naturally on phones because every chip is a separate image.
function chip(label, color, slug) {
  const h = 44, pad = 14, ic = 22, gap = 10, size = 18;
  const w = Math.ceil(pad + ic + gap + width(fonts.chip, label, size) + pad);
  const glyph = slug && iconPath(slug);
  const icon = glyph
    ? `<g transform="translate(${pad} ${(h - ic) / 2}) scale(${ic / 24})"><path fill="${color}" d="${glyph}"/></g>`
    : `<g transform="translate(${pad} ${(h - ic) / 2})">${[0, 1, 2, 3].flatMap(j => [0, 1, 2, 3].map(i => ((i + j) % 4 < 2
      ? `<rect x="${i * 6}" y="${j * 6}" width="4.6" height="4.6" fill="${color}"/>` : ''))).join('')}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
<title>${label}</title>
<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="11" fill="${C.card}" stroke="${C.fg}" stroke-opacity=".14"/>
${icon}
<path fill="${C.fg}" d="${d(fonts.chip, label, pad + ic + gap, h / 2 + size * 0.36, size)}"/>
</svg>
`;
}

const CHIPS = [
  ['python', 'Python', C.indigo, 'python'], ['aiogram', 'aiogram', C.indigo, 'telegram'],
  ['telethon', 'Telethon', C.indigo, 'telegram'], ['fastapi', 'FastAPI', C.indigo, 'fastapi'],
  ['react', 'React', C.indigo, 'react'], ['javascript', 'JavaScript', C.indigo, 'javascript'],
  ['nodejs', 'Node.js', C.indigo, 'nodedotjs'], ['sqlite', 'SQLite', C.indigo, 'sqlite'],
  ['1c', '1C', C.saffron, null], ['powershell', 'PowerShell', C.saffron, null],
  ['linux', 'Linux', C.saffron, 'linux'], ['caddy', 'Caddy', C.saffron, 'caddy'],
  ['whisper', 'Whisper', C.madder, null], ['comfyui', 'ComfyUI', C.madder, null],
  ['ffmpeg', 'FFmpeg', C.madder, 'ffmpeg'], ['obs', 'OBS', C.madder, 'obsstudio'],
  ['kotlin', 'Kotlin', C.teal, 'kotlin'], ['java', 'Java', C.teal, 'openjdk'],
  ['compose', 'Jetpack Compose', C.teal, 'jetpackcompose'], ['firebase', 'Firebase', C.teal, 'firebase'],
  ['telegram', 'Telegram', C.indigo, 'telegram'], ['linkedin', 'LinkedIn', C.saffron, 'linkedin'],
  ['leetcode', 'LeetCode', C.madder, 'leetcode'], ['email', 'Email', C.teal, 'gmail'],
];

function avatar() {
  const S = 600;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}"><rect width="${S}" height="${S}" fill="${C.card2}"/>${weaveCells(10, 10, 60, 50, 5, 5)}</svg>`;
}

fs.writeFileSync(path.join(assets, 'hero.svg'), hero());
fs.writeFileSync(path.join(assets, 'ribbon.svg'), ribbon());
for (const [file, label, color, slug] of CHIPS) fs.writeFileSync(path.join(chipsDir, `${file}.svg`), chip(label, color, slug));
fs.writeFileSync(path.join(assets, 'avatar.png'), new Resvg(avatar(), { fitTo: { mode: 'width', value: 600 } }).render().asPng());

const kb = f => (fs.statSync(path.join(assets, f)).size / 1024).toFixed(1);
console.log(`hero.svg ${kb('hero.svg')} KB, ribbon.svg ${kb('ribbon.svg')} KB, ${CHIPS.length} chips, avatar.png ${kb('avatar.png')} KB`);
console.log('missing icons:', CHIPS.filter(c => c[3] && !iconPath(c[3])).map(c => c[1]).join(', ') || 'none');
