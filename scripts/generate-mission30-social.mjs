import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

// Code-authored campaign artwork. Uses Astro's existing Sharp dependency.
for (const preview of [false, true]) {
  const seats = Array.from({ length: 30 }, (_, i) => {
    const x = 808 + (i % 6) * 48;
    const y = 230 + Math.floor(i / 6) * 48;
    return `<rect x="${x}" y="${y}" width="38" height="38" rx="7" fill="#6533aa" stroke="#aa83dc"/><text x="${x + 19}" y="${y + 25}" fill="#eadbff" text-anchor="middle" font-size="12">${String(i + 1).padStart(2, '0')}</text>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#fbf8f1"/><rect x="750" width="450" height="630" fill="#54219d"/>
    <g font-family="Arial, sans-serif">
    ${preview ? '<rect width="1200" height="44" fill="#f5db9f"/><text x="60" y="29" font-size="18" font-weight="700" fill="#503410">ILLUSTRATIVE PREVIEW — NOT ACTUAL RESULTS</text>' : ''}
    <text x="60" y="106" fill="#6a407f" font-size="17" letter-spacing="2">UNIVERSITYX · BUILDING IN PUBLIC</text>
    <text x="55" y="239" fill="#241333" font-size="101" font-weight="700" letter-spacing="-5">Mission <tspan fill="#8a40f5">30</tspan></text>
    <text x="60" y="310" fill="#241333" font-size="31" font-weight="700">30 Instructors. 4 Countries.</text>
    <text x="60" y="355" fill="#7640a7" font-size="34" font-weight="700">One Mission.</text>
    <text x="60" y="434" fill="#695d72" font-size="20">Nigeria · United States · United Kingdom · Canada</text>
    <line x1="60" y1="480" x2="685" y2="480" stroke="#d9cfe1"/>
    <text x="60" y="523" fill="#695d72" font-size="18">1 NOV 2026 → 1 JAN 2027</text>
    <text x="60" y="576" fill="#6e2ec4" font-size="20" font-weight="700">universityx.app/mission30</text>
    <text x="808" y="113" fill="#e9d7ff" font-size="14" letter-spacing="2">30 SEATS. ONE AMBITION.</text>
    <text x="808" y="189" fill="white" font-size="48" font-weight="700">Make room.</text>
    ${seats}
    <text x="808" y="530" fill="#e9d7ff" font-size="16">Bring what you know.</text>
    <text x="808" y="558" fill="#e9d7ff" font-size="16">Build what comes next.</text>
    </g></svg>`;
  const destination = fileURLToPath(new URL(`../public/images/mission30${preview ? '-preview' : ''}-social.png`, import.meta.url));
  await sharp(Buffer.from(svg)).png().toFile(destination);
  console.log(`Generated ${destination}`);
}
