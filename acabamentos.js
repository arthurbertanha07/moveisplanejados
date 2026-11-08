// Acabamentos disponíveis no showroom 3D.
// Este arquivo não importa Three.js: é usado tanto pela interface quanto pelo motor 3D.

export const MADEIRAS = [
  {
    id: 'carvalho',
    nome: 'Carvalho Natural',
    resumo: 'Tom claro e luminoso, de veios retos e discretos.',
    claro: '#cdb18c',
    escuro: '#94704b',
    poro: 0.16,
    contraste: 1,
    ripado: 0.78,
    amostra: ['#d6b98f', '#c4a174', '#b08a5f'],
  },
  {
    id: 'freijo',
    nome: 'Freijó',
    resumo: 'Madeira brasileira de tom dourado e desenho marcante.',
    claro: '#b98b5c',
    escuro: '#76502f',
    poro: 0.2,
    contraste: 1.15,
    ripado: 0.8,
    amostra: ['#c08f5b', '#a87644', '#8d5f36'],
  },
  {
    id: 'nogueira',
    nome: 'Nogueira Escura',
    resumo: 'Profunda e sofisticada, com nuances de chocolate.',
    claro: '#6c4831',
    escuro: '#33211a',
    poro: 0.22,
    contraste: 1.1,
    ripado: 0.86,
    amostra: ['#7a5338', '#5e3e2a', '#452d1f'],
  },
];

export const PUXADORES = [
  { id: 'bronze', nome: 'Bronze escovado', cor: '#8d6b47', metal: 1, rugosidade: 0.32 },
  { id: 'grafite', nome: 'Grafite fosco', cor: '#2b2a29', metal: 0.65, rugosidade: 0.48 },
];

export const FICHA_TECNICA = [
  { rotulo: 'Dimensões', valor: '2.800 × 2.600 × 600 mm' },
  { rotulo: 'Estrutura', valor: 'MDF 25 mm com lâmina natural' },
  { rotulo: 'Portas e frentes', valor: 'MDF 18 mm, montagem embutida' },
  { rotulo: 'Iluminação', valor: 'Fita LED 2700 K no nicho e no interior' },
];
