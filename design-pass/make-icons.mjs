// Minimal PNG/ICO writer — no image deps. Draws the counter badge:
// the app's red diamond inside an ink ring on the card white, the same
// object as the in-app <Mark>. Emits icon-192/512 for the PWA and a
// real favicon.ico (16/32/48). ICO entries must be RGBA — Next.js's ICO
// decoder rejects RGB PNGs ("The PNG is not in RGBA format!").
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const CARD = [255, 253, 248];
const INK = [33, 26, 21];
const VINYL = [179, 32, 43];

function crc32(buf) {
  let c,
    table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
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

function png(size) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  const c = (size - 1) / 2;
  // Badge geometry, scaled from the in-app mark (h-12 ring, h-[1.15rem]
  // gem). Below 48px the ring turns to noise, so the favicon sizes get
  // the diamond alone, drawn larger.
  const withRing = size >= 48;
  const ringOuter = size * 0.42;
  const ringInner = ringOuter - Math.max(2, size * 0.045);
  const gem = withRing ? size * 0.21 : size * 0.34; // half-diagonal

  for (let y = 0; y < size; y++) {
    const row = y * (size * 4 + 1);
    raw[row] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c);
      const diamond = Math.abs(x - c) + Math.abs(y - c) <= gem;
      const ring = withRing && d <= ringOuter && d >= ringInner;
      const [r, g, b] = diamond ? VINYL : ring ? INK : CARD;
      const i = row + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = 255;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: truecolour + alpha
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ico(sizes) {
  const images = sizes.map(png);
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4);
  const entries = [];
  let offset = 6 + 16 * sizes.length;
  for (let i = 0; i < sizes.length; i++) {
    const e = Buffer.alloc(16);
    e[0] = sizes[i] % 256; // 0 means 256
    e[1] = sizes[i] % 256;
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(images[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += images[i].length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...images]);
}

for (const size of [192, 512]) {
  writeFileSync(`public/icon-${size}.png`, png(size));
  console.log(`wrote public/icon-${size}.png`);
}
writeFileSync("app/favicon.ico", ico([16, 32, 48]));
console.log("wrote app/favicon.ico");
