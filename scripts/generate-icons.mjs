// Gera os ícones do PWA a partir de um único desenho em SVG.
// Rodar com `npm run icons` sempre que mudar o desenho abaixo.
// Usa o sharp que já vem instalado junto com o Next.
import { writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const BACKGROUND = '#020617'; // slate-950, mesmo fundo do app
const SHIELD_FILL = '#0f172a'; // slate-900

function iconSvg({ scale = 1, rounded = false } = {}) {
  const background = rounded
    ? `<rect width="512" height="512" rx="112" fill="${BACKGROUND}"/>`
    : `<rect width="512" height="512" fill="${BACKGROUND}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbbf24"/>
      <stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  ${background}
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <path d="M256 92 L388 138 V248 C388 332 332 394 256 426 C180 394 124 332 124 248 V138 Z"
      fill="${SHIELD_FILL}" stroke="url(#brand)" stroke-width="28" stroke-linejoin="round"/>
    <path d="M256 176 L273.6 227.7 L326.4 229.1 L284.5 261.3 L299.5 311.9 L256 282 L212.5 311.9 L227.5 261.3 L185.6 229.1 L238.4 227.7 Z"
      fill="url(#brand)" stroke="url(#brand)" stroke-width="10" stroke-linejoin="round"/>
  </g>
</svg>
`;
}

function png(svg, size, path) {
  return sharp(Buffer.from(svg)).resize(size, size).png().toFile(path);
}

await mkdir('public/icons', { recursive: true });

// Favicon da aba do navegador (convenção `app/icon.svg` do Next).
await writeFile('src/app/icon.svg', iconSvg({ rounded: true }));

// Ícones "any" do manifest: cantos arredondados e transparentes.
await png(iconSvg({ rounded: true }), 192, 'public/icons/icon-192.png');
await png(iconSvg({ rounded: true }), 512, 'public/icons/icon-512.png');

// Ícone "maskable" (Android recorta em círculo/squircle): fundo cheio e
// desenho menor para caber na zona segura de 80% do centro.
await png(iconSvg({ scale: 0.8 }), 512, 'public/icons/icon-maskable-512.png');

// Ícone da tela inicial do iOS (convenção `app/apple-icon.png` do Next).
// O iOS não aceita transparência e arredonda os cantos sozinho.
await png(iconSvg(), 180, 'src/app/apple-icon.png');

console.log('Ícones gerados.');
