// Baixa as fotografias (Licença Unsplash) em WebP, em larguras responsivas.
// Uso: node scripts/baixar-imagens.mjs   (gera public/img/* e imprime dimensões)
import { writeFile, mkdir } from 'node:fs/promises';

const FOTOS = {
  'hero-cozinha': 'photo-1772567733035-edbd44fb56b1',
  'sobre-oficina': 'photo-1659930087003-2d64e33181f7',
  'detalhe-puxador': 'photo-1693892985308-44965a6060d1',
  'amb-cozinha': 'photo-1684928365167-e91916573122',
  'amb-closet': 'photo-1708397016786-8916880649b8',
  'amb-dormitorio': 'photo-1760072513393-b9d81f65dd7e',
  'amb-homeoffice': 'photo-1764743111075-fb988af9ed75',
  'amb-sala': 'photo-1701422522371-d2cc964a708e',
  'amb-banheiro': 'photo-1771681278446-6f8eb0c7323f',
  'detalhe-gaveta': 'photo-1788506663477-3e147aea36dc',
  'gal-cozinha-ilha': 'photo-1771888703722-ee7ad9143a67',
  'gal-cozinha-nicho': 'photo-1771287490574-f5de29048a39',
  'gal-copa-escura': 'photo-1771270731051-9cfbb7222946',
  'gal-cozinha-torre': 'photo-1772567732993-3c546ee1a52c',
  'gal-closet-amplo': 'photo-1649361811423-a55616f7ab11',
  'gal-closet-penteadeira': 'photo-1672137233327-37b0c1049e77',
  'gal-dormitorio-ripado': 'photo-1779648596383-fc041f8bd4da',
  'gal-homeoffice-claro': 'photo-1781106743595-1a2c6397e812',
  'gal-homeoffice-estante': 'photo-1737233433647-b53b339306f4',
  'gal-sala-aparador': 'photo-1774437290640-ce5b87c71d57',
  'gal-banheiro': 'photo-1763485956303-daf935882443',
  'gal-comercial-cafe': 'photo-1761695939620-a18c88ab83b7',
  'contato-nicho': 'photo-1765371513189-44702dcee4be',
  'gal-guarda-roupa': 'photo-1722349674028-a148f4364e43',
};

function webpSize(buf) {
  const t = buf.toString('ascii', 12, 16);
  if (t === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (t === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (t === 'VP8L') {
    const b = buf.readUInt32LE(21);
    return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1];
  }
  throw new Error('formato desconhecido ' + t);
}

async function baixar(id, w, q, extra = '') {
  const url = `https://images.unsplash.com/${id}?w=${w}&q=${q}&fm=webp&fit=max${extra}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return Buffer.from(await r.arrayBuffer());
}

await mkdir('public/img', { recursive: true });
const saida = {};
for (const [nome, id] of Object.entries(FOTOS)) {
  const probe = await baixar(id, 200, 40);
  const [pw, ph] = webpSize(probe);
  const retrato = ph > pw;
  const larguras = nome === 'hero-cozinha' ? [800, 1400, 2400] : retrato ? [480, 860, 1300] : [640, 1200, 1920];
  const variantes = [];
  for (const w of larguras) {
    const buf = await baixar(id, w, w >= 1800 ? 68 : 72);
    const [rw, rh] = webpSize(buf);
    const arq = `${nome}-${rw}.webp`;
    await writeFile(`public/img/${arq}`, buf);
    variantes.push([rw, rh, Math.round(buf.length / 1024)]);
  }
  saida[nome] = variantes;
  console.log(nome, JSON.stringify(variantes));
}
// Imagem de compartilhamento (Open Graph) 1200x630 em JPG
const og = await fetch('https://images.unsplash.com/photo-1772567733035-edbd44fb56b1?w=1200&h=630&fit=crop&crop=entropy&q=78&fm=jpg');
await writeFile('public/og-image.jpg', Buffer.from(await og.arrayBuffer()));
await writeFile('scripts/imagens.json', JSON.stringify(saida, null, 1));
console.log('ok');
