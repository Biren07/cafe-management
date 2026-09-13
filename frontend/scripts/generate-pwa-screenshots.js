const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Pure Node.js PNG encoder
function createPng(width, height, drawFn) {
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc((width * bytesPerPixel + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * bytesPerPixel + 1);
    rawData[rowOffset] = 0; // Filter None
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
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

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

// Helpers for drawing geometric shapes
function inRect(x, y, rx, ry, rw, rh, radius = 0) {
  if (x < rx || x > rx + rw || y < ry || y > ry + rh) return false;
  if (radius > 0) {
    const left = rx + radius;
    const right = rx + rw - radius;
    const top = ry + radius;
    const bottom = ry + rh - radius;
    if (x < left && y < top) return Math.hypot(x - left, y - top) <= radius;
    if (x > right && y < top) return Math.hypot(x - right, y - top) <= radius;
    if (x < left && y > bottom) return Math.hypot(x - left, y - bottom) <= radius;
    if (x > right && y > bottom) return Math.hypot(x - right, y - bottom) <= radius;
  }
  return true;
}

// 1. DESKTOP SCREENSHOT RENDERER (1280 x 720)
function renderDesktopDashboard(x, y, w, h) {
  // Base background: Slate-50 (#f8fafc)
  let r = 248, g = 250, b = 252, a = 255;

  const sidebarW = 220;
  const headerH = 64;

  // Sidebar (Left: x < 220)
  if (x <= sidebarW) {
    r = 255; g = 255; b = 255; // White sidebar
    if (x >= sidebarW - 1) { r = 226; g = 232; b = 240; } // Slate-200 border-r

    // Logo area (x: 16-200, y: 16-48)
    if (inRect(x, y, 16, 16, 36, 36, 10)) {
      // Amber logo box
      return [217, 119, 6, 255];
    }
    if (inRect(x, y, 60, 24, 110, 10, 3)) {
      return [15, 23, 42, 255]; // Title "Artisan Cafe"
    }
    if (inRect(x, y, 60, 38, 70, 7, 2)) {
      return [148, 163, 184, 255]; // Subtitle
    }

    // Nav items
    const navItems = [
      { y: 80, active: true },
      { y: 124, active: false },
      { y: 168, active: false },
      { y: 212, active: false },
      { y: 256, active: false },
      { y: 300, active: false },
      { y: 344, active: false },
    ];

    for (const nav of navItems) {
      if (inRect(x, y, 12, nav.y, 196, 36, 8)) {
        if (nav.active) {
          // Amber active pill
          if (inRect(x, y, 24, nav.y + 11, 14, 14, 4)) return [217, 119, 6, 255];
          if (inRect(x, y, 48, nav.y + 14, 80, 8, 2)) return [180, 83, 9, 255];
          return [254, 243, 199, 255]; // Amber-100 bg
        } else {
          // Inactive nav item
          if (inRect(x, y, 24, nav.y + 11, 14, 14, 4)) return [148, 163, 184, 255];
          if (inRect(x, y, 48, nav.y + 14, 70, 8, 2)) return [71, 85, 105, 255];
          return [255, 255, 255, 255];
        }
      }
    }
    return [r, g, b, a];
  }

  // Header (Top: y < 64)
  if (y <= headerH) {
    r = 255; g = 255; b = 255; // White header
    if (y >= headerH - 1) { r = 226; g = 232; b = 240; } // Slate-200 border-b

    // Title on header
    if (inRect(x, y, sidebarW + 28, 22, 140, 14, 3)) return [15, 23, 42, 255];
    if (inRect(x, y, sidebarW + 28, 40, 100, 8, 2)) return [148, 163, 184, 255];

    // Search bar
    if (inRect(x, y, 680, 16, 280, 34, 10)) {
      if (inRect(x, y, 692, 28, 12, 12, 3)) return [148, 163, 184, 255];
      if (inRect(x, y, 712, 30, 80, 8, 2)) return [148, 163, 184, 255];
      return [241, 245, 249, 255]; // Slate-100
    }

    // Avatar & Notifications
    if (inRect(x, y, 1180, 16, 32, 32, 16)) return [217, 119, 6, 255]; // Avatar
    if (inRect(x, y, 1130, 20, 24, 24, 6)) return [241, 245, 249, 255]; // Bell icon

    return [r, g, b, a];
  }

  // Main Dashboard Content
  const contentX = sidebarW + 28;
  const contentW = w - contentX - 28;

  // 4 KPI Summary Cards (y: 84 to 184)
  const cardW = (contentW - 3 * 16) / 4;
  for (let i = 0; i < 4; i++) {
    const cardX = contentX + i * (cardW + 16);
    if (inRect(x, y, cardX, 84, cardW, 100, 16)) {
      // Border
      if (x === cardX || x === cardX + cardW - 1 || y === 84 || y === 183) return [226, 232, 240, 255];
      // Icon badge
      const badgeColors = [
        [217, 119, 6],   // Amber (Sales)
        [16, 185, 129],  // Emerald (Tables)
        [59, 130, 246],  // Blue (Orders)
        [168, 85, 247],  // Purple (Low Stock)
      ];
      if (inRect(x, y, cardX + 16, 100, 32, 32, 8)) {
        return [...badgeColors[i], 255];
      }
      // Value & Label text lines
      if (inRect(x, y, cardX + 58, 104, 60, 8, 2)) return [100, 116, 139, 255];
      if (inRect(x, y, cardX + 58, 118, 90, 14, 3)) return [15, 23, 42, 255];
      if (inRect(x, y, cardX + 16, 152, 110, 7, 2)) return [148, 163, 184, 255];
      return [255, 255, 255, 255];
    }
  }

  // Two columns: Left Weekly Chart (60% width), Right Table Status (40% width)
  const chartCardW = contentW * 0.58;
  const tableCardW = contentW * 0.39;
  const tableCardX = contentX + chartCardW + contentW * 0.03;

  // Chart Card (y: 204 to 680)
  if (inRect(x, y, contentX, 204, chartCardW, 480, 16)) {
    if (x === contentX || x === contentX + chartCardW - 1 || y === 204 || y === 683) return [226, 232, 240, 255];
    // Card Header
    if (inRect(x, y, contentX + 20, 224, 140, 12, 3)) return [15, 23, 42, 255];
    if (inRect(x, y, contentX + 20, 242, 180, 8, 2)) return [148, 163, 184, 255];

    // Bar Chart preview (7 bars)
    const barBaseY = 620;
    const barHeights = [220, 310, 180, 290, 360, 410, 280];
    for (let bIdx = 0; bIdx < 7; bIdx++) {
      const bx = contentX + 48 + bIdx * (chartCardW - 96) / 7;
      const bw = 38;
      const bh = barHeights[bIdx] * 0.7;
      if (inRect(x, y, bx, barBaseY - bh, bw, bh, 6)) {
        return [217, 119, 6, 255]; // Amber-600 bars
      }
      // Day label
      if (inRect(x, y, bx + 6, barBaseY + 12, 26, 7, 2)) return [148, 163, 184, 255];
    }

    return [255, 255, 255, 255];
  }

  // Right Table / Recent Orders Card (y: 204 to 680)
  if (inRect(x, y, tableCardX, 204, tableCardW, 480, 16)) {
    if (x === tableCardX || x === tableCardX + tableCardW - 1 || y === 204 || y === 683) return [226, 232, 240, 255];
    // Card Header
    if (inRect(x, y, tableCardX + 20, 224, 130, 12, 3)) return [15, 23, 42, 255];

    // Order Rows
    for (let rIdx = 0; rIdx < 6; rIdx++) {
      const rowY = 270 + rIdx * 64;
      if (inRect(x, y, tableCardX + 16, rowY, tableCardW - 32, 52, 10)) {
        // Table badge
        if (inRect(x, y, tableCardX + 24, rowY + 12, 28, 28, 6)) return [241, 245, 249, 255];
        // Table text & order code
        if (inRect(x, y, tableCardX + 62, rowY + 14, 80, 9, 2)) return [15, 23, 42, 255];
        if (inRect(x, y, tableCardX + 62, rowY + 28, 100, 7, 2)) return [148, 163, 184, 255];
        // Status pill
        if (inRect(x, y, tableCardX + tableCardW - 90, rowY + 16, 62, 20, 10)) {
          return rIdx % 2 === 0 ? [209, 250, 229, 255] : [254, 243, 199, 255];
        }
        return [248, 250, 252, 255];
      }
    }

    return [255, 255, 255, 255];
  }

  return [r, g, b, a];
}

// 2. MOBILE SCREENSHOT RENDERER (390 x 844)
function renderMobileDashboard(x, y, w, h) {
  let r = 248, g = 250, b = 252, a = 255;

  // Mobile Top Header (y < 60)
  if (y <= 60) {
    r = 255; g = 255; b = 255;
    if (y >= 59) { r = 226; g = 232; b = 240; }

    // Hamburger icon
    if (inRect(x, y, 16, 22, 20, 16, 2)) return [71, 85, 105, 255];

    // Center brand
    if (inRect(x, y, 140, 18, 24, 24, 6)) return [217, 119, 6, 255];
    if (inRect(x, y, 172, 24, 90, 12, 3)) return [15, 23, 42, 255];

    // Notification bell
    if (inRect(x, y, 350, 20, 22, 22, 6)) return [241, 245, 249, 255];
    return [r, g, b, a];
  }

  const pad = 16;
  const cardW = w - 2 * pad;

  // Hero Overview Header (y: 76-116)
  if (inRect(x, y, pad, 76, 140, 14, 3)) return [15, 23, 42, 255];
  if (inRect(x, y, pad, 96, 190, 8, 2)) return [148, 163, 184, 255];

  // 2x2 Grid of Stat Cards (y: 124-280)
  const miniCardW = (cardW - 12) / 2;
  const statCards = [
    { cx: pad, cy: 124, color: [217, 119, 6] },
    { cx: pad + miniCardW + 12, cy: 124, color: [16, 185, 129] },
    { cx: pad, cy: 206, color: [59, 130, 246] },
    { cx: pad + miniCardW + 12, cy: 206, color: [168, 85, 247] },
  ];

  for (const sc of statCards) {
    if (inRect(x, y, sc.cx, sc.cy, miniCardW, 72, 14)) {
      if (inRect(x, y, sc.cx + 12, sc.cy + 14, 26, 26, 6)) return [...sc.color, 255];
      if (inRect(x, y, sc.cx + 46, sc.cy + 16, 40, 7, 2)) return [100, 116, 139, 255];
      if (inRect(x, y, sc.cx + 46, sc.cy + 28, 60, 11, 2)) return [15, 23, 42, 255];
      return [255, 255, 255, 255];
    }
  }

  // Quick Action Buttons (y: 296-360)
  if (inRect(x, y, pad, 296, cardW, 64, 14)) {
    // 3 action buttons
    const actW = (cardW - 16) / 3;
    for (let aIdx = 0; aIdx < 3; aIdx++) {
      const ax = pad + 6 + aIdx * (actW + 2);
      if (inRect(x, y, ax, 304, actW - 4, 48, 10)) {
        if (aIdx === 0) return [217, 119, 6, 255]; // New Order button
        return [241, 245, 249, 255];
      }
    }
    return [255, 255, 255, 255];
  }

  // Live Orders List Section (y: 376-760)
  if (inRect(x, y, pad, 376, 120, 12, 3)) return [15, 23, 42, 255];

  for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
    const rY = 404 + rowIdx * 70;
    if (inRect(x, y, pad, rY, cardW, 60, 14)) {
      if (inRect(x, y, pad + 12, rY + 14, 32, 32, 8)) return [241, 245, 249, 255];
      if (inRect(x, y, pad + 54, rY + 16, 90, 10, 2)) return [15, 23, 42, 255];
      if (inRect(x, y, pad + 54, rY + 32, 110, 8, 2)) return [148, 163, 184, 255];
      // Status tag
      if (inRect(x, y, pad + cardW - 74, rY + 18, 60, 22, 11)) {
        return rowIdx % 2 === 0 ? [209, 250, 229, 255] : [254, 243, 199, 255];
      }
      return [255, 255, 255, 255];
    }
  }

  // Bottom Navigation Bar (y > 780)
  if (y >= 780) {
    r = 255; g = 255; b = 255;
    if (y === 780) r = 226; g = 232; b = 240;
    // 4 tab icons
    const tabW = w / 4;
    for (let tIdx = 0; tIdx < 4; tIdx++) {
      const tx = tIdx * tabW + tabW / 2;
      if (inRect(x, y, tx - 10, 800, 20, 16, 4)) {
        return tIdx === 0 ? [217, 119, 6, 255] : [148, 163, 184, 255];
      }
      if (inRect(x, y, tx - 14, 822, 28, 6, 2)) {
        return tIdx === 0 ? [217, 119, 6, 255] : [148, 163, 184, 255];
      }
    }
    return [r, g, b, a];
  }

  return [r, g, b, a];
}

// Generate screenshots
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Generating Desktop Screenshot (1280x720)...');
const desktopBuffer = createPng(1280, 720, renderDesktopDashboard);
fs.writeFileSync(path.join(screenshotsDir, 'desktop.png'), desktopBuffer);
console.log(`Generated desktop.png (${desktopBuffer.length} bytes)`);

console.log('Generating Mobile Screenshot (390x844)...');
const mobileBuffer = createPng(390, 844, renderMobileDashboard);
fs.writeFileSync(path.join(screenshotsDir, 'mobile.png'), mobileBuffer);
console.log(`Generated mobile.png (${mobileBuffer.length} bytes)`);
