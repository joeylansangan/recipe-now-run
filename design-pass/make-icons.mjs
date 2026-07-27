// Minimal PNG + ICO writer — no image deps.
//
// Draws the Recipe Now mark from design-pass/ASSET_SPEC.md: a gold sun resting
// on a horizon line, on warm paper, under a thin sky ribbon. Geometry follows
// the spec's percentages; the palette is reconciled to this app (the spec's
// navy horizon becomes our ink, its azure ribbon becomes our mint wall).
//
// Emits the full inventory the spec calls for:
//   icon-192.png, icon-512.png, icon-512-maskable.png, apple-icon.png, favicon.ico
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const PAPER = [246, 240, 228]; // cream
const GOLD = [233, 168, 32];
const INK = [33, 26, 21];
const RIBBON = [191, 222, 214]; // mint — the sky, matching the app's wall

function crc32(buf) {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = table[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/**
 * Renders the mark at `size`.
 * `maskable` drops the sky ribbon (a platform mask would crop it to a smear)
 * and pulls the composition into the ~80% safe circle.
 */
function render(size, { maskable = false, rgba = false } = {}) {
  const px = (x, y) => {
    // Sky ribbon across the top edge, 5.4% of canvas.
    if (!maskable && y < size * 0.054) return RIBBON;

    const cx = size * 0.5;
    const cy = size * (maskable ? 0.487 : 0.483);
    const r = size * (maskable ? 0.129 : 0.17);

    // Horizon bar with round caps, drawn ON TOP of the sun.
    const barY = size * (maskable ? 0.62 : 0.659);
    const barH = Math.max(2, size * (maskable ? 0.0156 : 0.02));
    const x0 = size * (maskable ? 0.182 : 0.08);
    const x1 = size * (maskable ? 0.818 : 0.92);
    const half = barH / 2;
    const withinBar =
      Math.abs(y - barY) <= half &&
      ((x >= x0 && x <= x1) ||
        Math.hypot(x - x0, y - barY) <= half ||
        Math.hypot(x - x1, y - barY) <= half);
    if (withinBar) return INK;

    // The sun is not clipped — the bar simply draws over it.
    if (Math.hypot(x - cx, y - cy) <= r) return GOLD;

    return PAPER;
  };

  // ICO entries must carry an alpha channel — Next.js's ICO decoder rejects
  // RGB PNGs outright ("The PNG is not in RGBA format!"). Still fully opaque.
  const channels = rgba ? 4 : 3;
  const raw = Buffer.alloc(size * (size * channels + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size * channels + 1);
    raw[row] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const [r, g, b] = px(x + 0.5, y + 0.5);
      const i = row + 1 + x * channels;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      if (rgba) raw[i + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = rgba ? 6 : 2; // truecolour, with alpha for ICO entries
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** ICO container with PNG-encoded entries. */
function ico(sizes) {
  const images = sizes.map((s) => render(s, { rgba: true }));
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);

  let offset = 6 + sizes.length * 16;
  const entries = sizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e[0] = s >= 256 ? 0 : s; // width
    e[1] = s >= 256 ? 0 : s; // height
    e[2] = 0; // palette
    e[3] = 0; // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(images[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += images[i].length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images]);
}

const pub = process.argv[2];
const app = process.argv[3];

writeFileSync(`${pub}/icon-192.png`, render(192));
writeFileSync(`${pub}/icon-512.png`, render(512));
writeFileSync(`${pub}/icon-512-maskable.png`, render(512, { maskable: true }));
writeFileSync(`${pub}/apple-icon.png`, render(180));
console.log("wrote icon-192, icon-512, icon-512-maskable, apple-icon");

if (app) {
  writeFileSync(`${app}/favicon.ico`, ico([16, 32, 48]));
  console.log("wrote favicon.ico (16/32/48) — replaces Next.js boilerplate");
}
