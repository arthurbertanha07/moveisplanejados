// Fotografias otimizadas em /public/img (WebP em três larguras).
// Todas sob a Licença Unsplash (uso comercial gratuito): https://unsplash.com/license
// São imagens ilustrativas; não retratam obras executadas pela Lumen.

const f = (larguras, w, h, autor, id) => ({ larguras, w, h, autor, unsplash: `https://unsplash.com/photos/${id}` });

export const FOTOS = {
  'hero-cozinha': f([800, 1400, 2400], 2400, 1600, 'Franco Debartolo', 'pGVQwb5lGX4'),
  'sobre-oficina': f([640, 1200, 1920], 1920, 1280, 'Craft Kitties', 'GfYA6q5ESLI'),
  'detalhe-puxador': f([640, 1200, 1920], 1920, 886, 'Manifest Stefany', 'uRBHzqrUHDY'),
  'amb-cozinha': f([640, 1200, 1920], 1920, 1280, 'SPurno Animation Studio', '80DAbtNfh4k'),
  'amb-closet': f([640, 1200, 1920], 1920, 1919, 'Aswa Hanifah', 'qlAWpiUiFyc'),
  'amb-dormitorio': f([640, 1200, 1920], 1920, 1282, 'Obegi Home', 'Jxam7P99NMA'),
  'amb-homeoffice': f([640, 1200, 1920], 1920, 1920, 'Puscas Adryan', 'CkzzjmZbEMA'),
  'amb-sala': f([480, 860, 1300], 1300, 1949, 'Tile Merchant Ireland', 'tKy1HivnC2I'),
  'amb-banheiro': f([640, 1200, 1920], 1920, 1280, 'Clay Banks', '7Z2OTozIY_0'),
  'detalhe-gaveta': f([640, 1200, 1920], 1920, 1287, 'Barney Goodman', '42RKDJR5MFQ'),
  'gal-cozinha-ilha': f([640, 1200, 1920], 1920, 1536, 'GoodLifeConstruction', 'Jl5BfxX089Q'),
  'gal-cozinha-nicho': f([640, 1200, 1920], 1920, 1282, 'Franco Debartolo', 'bmmXSqxv53U'),
  'gal-copa-escura': f([480, 860, 1300], 1300, 1961, 'Caroline Badran', 'UBoDgr8Y0YA'),
  'gal-cozinha-torre': f([640, 1200, 1920], 1920, 1280, 'Franco Debartolo', '_zoKw1ew0wY'),
  'gal-closet-amplo': f([640, 1200, 1920], 1920, 1469, 'Ali Moradi', '9KVtDmNnFP4'),
  'gal-closet-penteadeira': f([640, 1200, 1920], 1920, 1440, 'Billy Jo Catbagan', 'SseNV6Ycb1c'),
  'gal-dormitorio-ripado': f([640, 1200, 1920], 1920, 1499, 'krishna kumar c', '-xnPVP3ldqo'),
  'gal-homeoffice-claro': f([480, 860, 1300], 1300, 1733, 'João Emanuel', 'ngpAHJludHA'),
  'gal-homeoffice-estante': f([480, 860, 1300], 1300, 1625, 'Prydumano Design', 'QOlRGOCQaC4'),
  'gal-sala-aparador': f([640, 1200, 1920], 1920, 1200, 'Wemel Wood', '4J4-wa1poNg'),
  'gal-banheiro': f([480, 860, 1300], 1300, 1950, 'Peter Muniz', 'sZJ43n7lJ1o'),
  'gal-comercial-cafe': f([480, 860, 1300], 1300, 1950, 'Roman', 'M5IdzhyYl1k'),
  'gal-guarda-roupa': f([640, 1200, 1920], 1920, 1280, 'Lisa Anna', '6Y3avYzs6os'),
  'contato-nicho': f([480, 860, 1300], 1300, 1950, 'Caroline Badran', 'XneRmPhXl0w'),
};

export const srcFoto = (nome, largura) => `/img/${nome}-${largura}.webp`;

export const srcsetFoto = (nome) =>
  FOTOS[nome].larguras.map((l) => `${srcFoto(nome, l)} ${l}w`).join(', ');
