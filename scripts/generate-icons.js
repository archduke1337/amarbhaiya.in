/**
 * PWA Icon Generator Script
 * Generates placeholder PNG icons for the PWA manifest.
 * 
 * These are simple branded placeholders using an SVG-to-PNG pipeline.
 * Replace with actual designed icons before production launch.
 * 
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

function generateSVG(size, isMaskable = false) {
  const padding = isMaskable ? size * 0.1 : 0;
  const innerSize = size - padding * 2;
  const centerX = size / 2;
  const centerY = size / 2;
  const fontSize = Math.round(innerSize * 0.35);
  const subFontSize = Math.round(innerSize * 0.08);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
    <linearGradient id="text-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg-grad)" rx="${isMaskable ? 0 : Math.round(size * 0.15)}"/>
  <text x="${centerX}" y="${centerY - subFontSize * 0.3}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="900" fill="url(#text-grad)" text-anchor="middle" dominant-baseline="central">AB</text>
  <text x="${centerX}" y="${centerY + fontSize * 0.45}" font-family="system-ui, -apple-system, sans-serif" font-size="${subFontSize}" font-weight="600" fill="#6366f1" text-anchor="middle" dominant-baseline="central" opacity="0.7">PHODU</text>
</svg>`;
}

function generateScreenshotSVG(width, height, label) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a0a14"/>
      <stop offset="100%" stop-color="#1a1a2e"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <text x="${width/2}" y="${height/2 - 30}" font-family="system-ui, sans-serif" font-size="48" font-weight="900" fill="#6366f1" text-anchor="middle">Amarnath Bhaiya</text>
  <text x="${width/2}" y="${height/2 + 30}" font-family="system-ui, sans-serif" font-size="24" font-weight="400" fill="#888" text-anchor="middle">${label}</text>
</svg>`;
}

// Generate icon SVGs (will be used as-is since browsers support SVG icons, 
// but for maximum compatibility we save as SVG with .png extension note)
// For production, use a proper image processing library like sharp

for (const size of sizes) {
  const svg = generateSVG(size);
  const svgPath = path.join(ICONS_DIR, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Generated: icon-${size}x${size}.svg`);
}

// Maskable icon
const maskableSvg = generateSVG(512, true);
fs.writeFileSync(path.join(ICONS_DIR, 'maskable-icon-512x512.svg'), maskableSvg);
console.log('Generated: maskable-icon-512x512.svg');

// Screenshots
fs.writeFileSync(
  path.join(ICONS_DIR, 'screenshot-wide.svg'),
  generateScreenshotSVG(1280, 720, 'Mentor • System Builder • Career Architect')
);
fs.writeFileSync(
  path.join(ICONS_DIR, 'screenshot-narrow.svg'),
  generateScreenshotSVG(720, 1280, 'Confusion → Clarity → Outcomes')
);
console.log('Generated: screenshot SVGs');

console.log('\nDone! SVG icons generated in public/icons/');
console.log('Note: For production, convert these SVGs to PNGs using a tool like sharp or an online converter.');
console.log('Update manifest.json icon src paths from .png to .svg if using SVGs directly.');
