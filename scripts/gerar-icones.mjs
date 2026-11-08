// Gera favicon.svg e os ícones PNG a partir da marca (duas portas e o filete de luz).
// Uso: node scripts/gerar-icones.mjs
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const FUNDO = [27, 23, 20], PORTA = [233, 225, 211], LUZ = [196, 163, 124];
// Formas no espaço 40×40: [x0, y0, x1, y1, cor]
const FORMAS = [
  [9, 7, 19, 33, PORTA],
  [21, 7, 31, 33, PORTA],
  [16.2, 17, 17.2, 23, FUNDO],
  [22.8, 17, 23.8, 23, FUNDO],
  [19.55, 4, 20.45, 36, LUZ],
];

function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function bloco(tipo, dados) {
  const t = Buffer.from(tipo);
  const tam = Buffer.alloc(4); tam.writeUInt32BE(dados.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, dados])));
  return Buffer.concat([tam, t, dados, crc]);
}

function png(tamanho) {
  const ss = 4; // superamostragem para bordas suaves
  const linhas = [];
  for (let y = 0; y < tamanho; y++) {
    const linha = [0];
    for (let x = 0; x < tamanho; x++) {
      const acc = [0, 0, 0];
      for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
        const u = ((x + (sx + 0.5) / ss) / tamanho) * 40;
        const v = ((y + (sy + 0.5) / ss) / tamanho) * 40;
        let cor = FUNDO;
        for (const [x0, y0, x1, y1, c] of FORMAS) if (u >= x0 && u < x1 && v >= y0 && v < y1) cor = c;
        acc[0] += cor[0]; acc[1] += cor[1]; acc[2] += cor[2];
      }
      linha.push(...acc.map((a) => Math.round(a / (ss * ss))), 255);
    }
    linhas.push(Buffer.from(linha));
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(tamanho, 0); ihdr.writeUInt32BE(tamanho, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    bloco('IHDR', ihdr),
    bloco('IDAT', deflateSync(Buffer.concat(linhas), { level: 9 })),
    bloco('IEND', Buffer.alloc(0)),
  ]);
}

const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" rx="6" fill="${hex(FUNDO)}"/>${FORMAS.map(([x0, y0, x1, y1, c]) => `<rect x="${x0}" y="${y0}" width="${+(x1 - x0).toFixed(2)}" height="${y1 - y0}" fill="${hex(c)}"/>`).join('')}</svg>\n`;

writeFileSync('public/favicon.svg', svg);
writeFileSync('public/favicon-32.png', png(32));
writeFileSync('public/apple-touch-icon.png', png(180));
writeFileSync('public/icone-192.png', png(192));
writeFileSync('public/icone-512.png', png(512));
console.log('ícones gerados');
