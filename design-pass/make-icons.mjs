// Minimal PNG writer — no image deps. Draws the app icon at two sizes.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const BG = [179, 32, 43];
const FG = [246, 240, 228];

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
  const raw = Buffer.alloc(size * (size * 3 + 1));
  const c = (size - 1) / 2;
  // Plate: an outer ring and a filled centre — reads as a plate at 48px.
  const outer = size * 0.36;
  const inner = size * 0.3;
  const dot = size * 0.16;

  for (let y = 0; y < size; y++) {
    const row = y * (size * 3 + 1);
    raw[row] = 0; // filter byte
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - c, y - c);
      const on = (d <= outer && d >= inner) || d <= dot;
      const [r, g, b] = on ? FG : BG;
      const i = row + 1 + x * 3;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type: truecolour
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const out = process.argv[2];
for (const size of [192, 512]) {
  writeFileSync(`${out}/icon-${size}.png`, png(size));
  console.log(`wrote icon-${size}.png`);
}
