const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node.js PNG generator with RGBA buffer
function createPng(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc((width * bytesPerPixel + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * bytesPerPixel + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * bytesPerPixel;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);

  // PNG Header
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth: 8
  ihdr[9] = 6; // Color type: 6 (RGBA)
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const length = data.length;
  const buffer = Buffer.alloc(8 + length + 4);
  buffer.writeUInt32BE(length, 0);
  buffer.write(type, 4, 4, 'ascii');
  data.copy(buffer, 8);
  const crc = crc32(buffer.subarray(4, 8 + length));
  buffer.writeUInt32BE(crc, 8 + length);
  return buffer;
}

// CRC32 table & function
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Artisan Cafe icon drawing algorithm (Warm Amber brand, coffee cup & steam emblem)
function drawCafeIcon(x, y, w, h, isMaskable = false) {
  // Normalize coordinates (-1 to 1)
  const nx = (x / w) * 2 - 1;
  const ny = (y / h) * 2 - 1;
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Background
  const pad = isMaskable ? 0.98 : 0.88;
  if (!isMaskable && dist > pad) {
    // Transparent outside rounded corner
    const roundCornerRadius = 0.85;
    const ax = Math.abs(nx);
    const ay = Math.abs(ny);
    if (ax > roundCornerRadius && ay > roundCornerRadius) {
      const cornerDist = Math.sqrt((ax - roundCornerRadius) ** 2 + (ay - roundCornerRadius) ** 2);
      if (cornerDist > (1 - roundCornerRadius)) {
        return [0, 0, 0, 0];
      }
    }
  }

  // Gradient background from Amber-600 (#d97706) to Amber-700 (#b45309)
  const gradT = (ny + 1) / 2;
  let bgR = Math.round(217 * (1 - gradT) + 180 * gradT);
  let bgG = Math.round(119 * (1 - gradT) + 83 * gradT);
  let bgB = Math.round(6 * (1 - gradT) + 9 * gradT);
  let bgA = 255;

  // Scale factor for inner coffee cup
  const scale = isMaskable ? 0.65 : 0.75;
  const cx = nx / scale;
  const cy = ny / scale;

  // Coffee cup body shape (trapezoid with rounded bottom)
  const topY = -0.15;
  const bottomY = 0.45;
  const topWidth = 0.48;
  const bottomWidth = 0.36;

  let inCup = false;
  if (cy >= topY && cy <= bottomY) {
    const t = (cy - topY) / (bottomY - topY);
    const currentW = topWidth * (1 - t) + bottomWidth * t;
    if (Math.abs(cx) <= currentW) {
      inCup = true;
    }
  }

  // Cup bottom rounded base
  if (cy > bottomY && cy <= bottomY + 0.1) {
    const baseW = bottomWidth * (1 - (cy - bottomY) / 0.1);
    if (Math.abs(cx) <= baseW) {
      inCup = true;
    }
  }

  // Cup Handle (right side)
  const handleCenterX = 0.52;
  const handleCenterY = 0.12;
  const handleOuterRx = 0.22;
  const handleOuterRy = 0.24;
  const handleInnerRx = 0.12;
  const handleInnerRy = 0.14;

  const handleDistOuter = ((cx - handleCenterX) / handleOuterRx) ** 2 + ((cy - handleCenterY) / handleOuterRy) ** 2;
  const handleDistInner = ((cx - handleCenterX) / handleInnerRx) ** 2 + ((cy - handleCenterY) / handleInnerRy) ** 2;
  let inHandle = (cx > 0.3) && (handleDistOuter <= 1.0) && (handleDistInner >= 1.0);

  // Cup Saucer (oval below cup)
  const saucerY = 0.58;
  const saucerRx = 0.55;
  const saucerRy = 0.08;
  const saucerDist = (cx / saucerRx) ** 2 + ((cy - saucerY) / saucerRy) ** 2;
  let inSaucer = saucerDist <= 1.0;

  // Steam waves (3 vertical wavy lines above cup)
  let inSteam = false;
  [-0.2, 0.0, 0.2].forEach((sx) => {
    if (cy >= -0.65 && cy <= -0.25) {
      const wave = Math.sin((cy + 0.65) * 12) * 0.04;
      if (Math.abs(cx - (sx + wave)) <= 0.035) {
        inSteam = true;
      }
    }
  });

  if (inCup || inHandle || inSaucer || inSteam) {
    return [255, 255, 255, 255]; // Crisp white icon
  }

  return [bgR, bgG, bgB, bgA];
}

// Generate directory and all icons
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const targets = [
  { name: 'icon-192x192.png', size: 192, maskable: false },
  { name: 'icon-512x512.png', size: 512, maskable: false },
  { name: 'icon-maskable-192x192.png', size: 192, maskable: true },
  { name: 'icon-maskable-512x512.png', size: 512, maskable: true },
  { name: 'apple-touch-icon.png', size: 180, maskable: false },
  { name: 'favicon-32x32.png', size: 32, maskable: false },
  { name: 'favicon-16x16.png', size: 16, maskable: false },
];

targets.forEach(({ name, size, maskable }) => {
  const filePath = path.join(iconsDir, name);
  const pngBuffer = createPng(size, size, (x, y, w, h) => drawCafeIcon(x, y, w, h, maskable));
  fs.writeFileSync(filePath, pngBuffer);
  console.log(`Generated: ${name} (${size}x${size}, ${pngBuffer.length} bytes)`);
});
