// Texturas procedurais (madeira, superfícies e sombras suaves) geradas em canvas.
// Tudo é periódico, então as texturas se repetem sem emendas visíveis.
import { CanvasTexture, RepeatWrapping, SRGBColorSpace, NoColorSpace } from 'three';

function hash(x, y, seed) {
  let h = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

const mod = (a, n) => ((a % n) + n) % n;
const suave = (t) => t * t * (3 - 2 * t);
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Ruído de valor 2D periódico: x e y em unidades de grade, px/py = períodos inteiros.
function ruido(x, y, px, py, seed) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = suave(x - xi);
  const v = suave(y - yi);
  const x0 = mod(xi, px), x1 = mod(xi + 1, px);
  const y0 = mod(yi, py), y1 = mod(yi + 1, py);
  const a = hash(x0, y0, seed), b = hash(x1, y0, seed);
  const c = hash(x0, y1, seed), d = hash(x1, y1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x, y, px, py, seed, oitavas) {
  let soma = 0, amp = 0.5, total = 0;
  for (let i = 0; i < oitavas; i++) {
    soma += amp * ruido(x, y, px, py, seed + i * 31);
    total += amp;
    x *= 2; y *= 2; px *= 2; py *= 2; amp *= 0.5;
  }
  return soma / total;
}

const proximoQuadro = () =>
  globalThis.scheduler?.yield
    ? globalThis.scheduler.yield()
    : new Promise((r) => {
        const canal = new MessageChannel();
        canal.port1.onmessage = () => r();
        canal.port2.postMessage(0);
      });

/**
 * Gera os campos-base do veio da madeira (independentes da cor).
 * Executa em fatias para não travar a página durante o carregamento.
 */
export async function gerarCamposMadeira(N, onProgresso) {
  const tom = new Float32Array(N * N);
  const poro = new Float32Array(N * N);
  const seed = 11;
  let inicioFatia = performance.now();

  for (let j = 0; j < N; j++) {
    const v = j / N;
    for (let i = 0; i < N; i++) {
      const u = i / N;
      // Ondulação lenta e discreta do veio (lâmina de corte reto)
      const w =
        (fbm(u * 2, v, 2, 1, seed, 3) - 0.5) * 0.014 +
        (ruido(u * 3, v * 8, 3, 8, seed + 5) - 0.5) * 0.003;
      const xs = u + w;
      // Anéis de crescimento finos, com espaçamento irregular
      const t = xs * 58 + (fbm(xs * 14, 0, 14, 1, seed + 9, 3) - 0.5) * 7;
      const r = t - Math.floor(t);
      const forca = 0.25 + 0.75 * fbm(xs * 10, v * 3, 10, 3, seed + 13, 2);
      const tardio = smoothstep(0.6, 0.95, r) * (1 - 0.7 * smoothstep(0.95, 1, r)) * forca;
      // Fibras finas ao longo do veio
      const fibra = fbm(xs * 260, v * 3, 260, 3, seed + 21, 2);
      // Poros alongados
      const p = ruido(xs * 420, v * 40, 420, 40, seed + 33);
      const pm = smoothstep(0.8, 0.95, p) * (0.4 + 0.6 * tardio);
      // Variação ampla de tonalidade
      const amplo = fbm(u * 2, v * 2, 2, 2, seed + 41, 3);

      const k = j * N + i;
      tom[k] = 0.36 + 0.4 * tardio + 0.22 * (fibra - 0.5) + 0.4 * (amplo - 0.5);
      poro[k] = pm;
    }
    if (performance.now() - inicioFatia > 12) {
      onProgresso?.(j / N);
      await proximoQuadro();
      inicioFatia = performance.now();
    }
  }
  onProgresso?.(1);
  return { N, tom, poro };
}

const hexParaRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

function canvasComPixels(N, preencher) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = N;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(N, N);
  preencher(img.data);
  ctx.putImageData(img, 0, 0);
  return canvas;
}

function texturaRepetida(canvas, cor, anisotropia) {
  const tex = new CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.colorSpace = cor ? SRGBColorSpace : NoColorSpace;
  tex.anisotropy = anisotropia;
  return tex;
}

/** Textura de cor para uma madeira específica. */
export function texturaCorMadeira(campos, madeira, anisotropia = 4) {
  const { N, tom, poro } = campos;
  const claro = hexParaRgb(madeira.claro);
  const escuro = hexParaRgb(madeira.escuro);
  const contraste = madeira.contraste ?? 1;
  const canvas = canvasComPixels(N, (d) => {
    for (let k = 0; k < N * N; k++) {
      let t = 0.5 + (tom[k] - 0.5) * contraste;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const sombra = 1 - madeira.poro * poro[k];
      const o = k * 4;
      d[o] = (claro[0] + (escuro[0] - claro[0]) * t) * sombra;
      d[o + 1] = (claro[1] + (escuro[1] - claro[1]) * t) * sombra;
      d[o + 2] = (claro[2] + (escuro[2] - claro[2]) * t) * sombra;
      d[o + 3] = 255;
    }
  });
  return texturaRepetida(canvas, true, anisotropia);
}

/** Textura de dados: R = relevo (bump), G = rugosidade. */
export function texturaDadosMadeira(campos, anisotropia = 4) {
  const { N, tom, poro } = campos;
  const canvas = canvasComPixels(N, (d) => {
    for (let k = 0; k < N * N; k++) {
      const o = k * 4;
      const relevo = 0.75 - 0.25 * tom[k] - 0.5 * poro[k];
      const rug = 0.5 + 0.1 * tom[k] + 0.3 * poro[k];
      d[o] = Math.max(0, Math.min(1, relevo)) * 255;
      d[o + 1] = Math.max(0, Math.min(1, rug)) * 255;
      d[o + 2] = 0;
      d[o + 3] = 255;
    }
  });
  return texturaRepetida(canvas, false, anisotropia);
}

/** Ruído suave em escala de cinza para piso e parede (microcimento / reboco). */
export function texturaSuperficie(N, seed, escala, intensidade) {
  const canvas = canvasComPixels(N, (d) => {
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const u = i / N, v = j / N;
        const n =
          0.55 * fbm(u * escala, v * escala, escala, escala, seed, 4) +
          0.45 * ruido(u * N * 0.5, v * N * 0.5, N * 0.5, N * 0.5, seed + 3);
        const val = 255 * (1 - intensidade + intensidade * n);
        const o = (j * N + i) * 4;
        d[o] = d[o + 1] = d[o + 2] = val;
        d[o + 3] = 255;
      }
    }
  });
  return texturaRepetida(canvas, false, 4);
}

/**
 * Máscara de sombra suave em torno de um retângulo (oclusão ambiente "falsa").
 * meiaL/meiaA e queda em frações da textura (0..0.5).
 */
export function texturaSombraSuave(N, meiaL, meiaA, queda) {
  const canvas = canvasComPixels(N, (d) => {
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const x = Math.abs(i / (N - 1) - 0.5);
        const y = Math.abs(j / (N - 1) - 0.5);
        const dx = Math.max(x - meiaL, 0);
        const dy = Math.max(y - meiaA, 0);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const a = Math.exp(-(dist * dist) / (queda * queda));
        const o = (j * N + i) * 4;
        d[o] = d[o + 1] = d[o + 2] = 0;
        d[o + 3] = 255 * a;
      }
    }
  });
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = NoColorSpace;
  return tex;
}
