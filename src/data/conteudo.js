// Textos e listas das seções. Edite aqui sem mexer na estrutura dos componentes.

export const NAVEGACAO = [
  { id: 'sobre', rotulo: 'Sobre' },
  { id: 'ambientes', rotulo: 'Ambientes' },
  { id: 'showroom', rotulo: 'Showroom 3D' },
  { id: 'projetos', rotulo: 'Projetos' },
  { id: 'processo', rotulo: 'Processo' },
  { id: 'atendimento', rotulo: 'Atendimento' },
];

export const AMBIENTES = [
  {
    id: 'cozinhas',
    curto: 'cozinha',
    nome: 'Cozinhas',
    foto: 'amb-cozinha',
    posicao: '50% 60%',
    texto:
      'Bancadas na altura certa, torres quentes integradas e despensas que guardam tudo à vista de quem cozinha. Uma cozinha planejada em torno do seu jeito de usar.',
    itens: ['Ilhas e penínsulas', 'Torres quentes', 'Despenseiros', 'Iluminação embutida'],
  },
  {
    id: 'closets',
    curto: 'closet ou guarda-roupa',
    nome: 'Closets e guarda-roupas',
    foto: 'amb-closet',
    posicao: '50% 45%',
    texto:
      'Cabideiros em alturas diferentes, gaveteiros com divisórias e nichos para cada par de sapatos. Cada centímetro é dimensionado para o que você realmente guarda.',
    itens: ['Closets abertos', 'Portas de correr e de giro', 'Gaveteiros internos', 'LED com sensor'],
  },
  {
    id: 'dormitorios',
    curto: 'dormitório',
    nome: 'Dormitórios',
    foto: 'amb-dormitorio',
    posicao: '50% 50%',
    texto:
      'Cabeceiras, criados-mudos e painéis que organizam o quarto com calma. Marcenaria que acolhe, com tomadas, iluminação e apoios exatamente onde fazem falta.',
    itens: ['Cabeceiras e painéis', 'Criados-mudos', 'Penteadeiras', 'Quartos infantis'],
  },
  {
    id: 'home-office',
    curto: 'home office',
    nome: 'Home office',
    foto: 'amb-homeoffice',
    posicao: '50% 55%',
    texto:
      'Mesas na medida do corpo, estantes que escondem cabos e arquivos, e armários que fecham o expediente com um gesto. Trabalhar em casa com foco e conforto.',
    itens: ['Bancadas de trabalho', 'Estantes e nichos', 'Gestão de cabos', 'Armários de apoio'],
  },
  {
    id: 'salas',
    curto: 'sala ou painel de TV',
    nome: 'Salas e painéis de TV',
    foto: 'amb-sala',
    posicao: '50% 40%',
    texto:
      'Painéis ripados, racks suspensos e estantes que organizam a sala sem pesar. Equipamentos ficam acessíveis e a fiação, invisível.',
    itens: ['Painéis ripados', 'Racks suspensos', 'Estantes e bares', 'Aparadores'],
  },
  {
    id: 'banheiros',
    curto: 'banheiro ou espaço comercial',
    nome: 'Banheiros e comerciais',
    foto: 'amb-banheiro',
    posicao: '50% 50%',
    texto:
      'Gabinetes resistentes à umidade em banheiros e lavabos, e marcenaria para lojas, consultórios e escritórios que precisam traduzir uma marca em espaço.',
    itens: ['Gabinetes e lavabos', 'Espelheiras', 'Lojas e escritórios', 'Consultórios'],
  },
];

export const PRINCIPIOS = [
  { titulo: 'Personalização', texto: 'Cada projeto parte de medidas, hábitos e referências de quem vai usar o espaço.' },
  { titulo: 'Aproveitamento', texto: 'Cantos, vãos e alturas pensados para guardar mais sem perder leveza.' },
  { titulo: 'Funcionalidade', texto: 'Ferragens, aberturas e alturas escolhidas para o uso diário, não só para a foto.' },
  { titulo: 'Detalhe', texto: 'Encontros de veio, folgas alinhadas e acabamentos que se percebem ao toque.' },
];

export const DIFERENCIAIS = [
  {
    titulo: 'Projetos personalizados',
    texto: 'Nada sai de catálogo. Desenhamos cada móvel a partir das medidas do ambiente e da rotina da casa.',
  },
  {
    titulo: 'Aproveitamento inteligente',
    texto: 'Vãos, cantos e alturas viram armazenamento útil, com circulação livre e proporções equilibradas.',
  },
  {
    titulo: 'Acabamento refinado',
    texto: 'Bordas, folgas e encontros de veio recebem a mesma atenção que as superfícies mais visíveis.',
  },
  {
    titulo: 'Materiais selecionados',
    texto: 'Lâminas naturais, MDF de qualidade e ferragens com amortecimento, escolhidos para durar.',
  },
  {
    titulo: 'Atendimento próximo',
    texto: 'Uma equipe acompanha o projeto do primeiro contato à instalação, com conversas claras em cada etapa.',
  },
  {
    titulo: 'Estética e função',
    texto: 'O desenho nasce do uso. Beleza que resiste à rotina e funcionalidade que não precisa se esconder.',
  },
];

export const CATEGORIAS_GALERIA = [
  { id: 'todos', rotulo: 'Todos' },
  { id: 'cozinhas', rotulo: 'Cozinhas' },
  { id: 'closets', rotulo: 'Closets' },
  { id: 'dormitorios', rotulo: 'Dormitórios' },
  { id: 'salas', rotulo: 'Salas' },
  { id: 'home-office', rotulo: 'Home office' },
  { id: 'banheiros', rotulo: 'Banheiros e comerciais' },
];

export const GALERIA = [
  { foto: 'gal-cozinha-ilha', categoria: 'cozinhas', titulo: 'Cozinha com ilha e luz linear', descricao: 'Carvalho claro, bancada contínua e iluminação no rodapé.' },
  { foto: 'gal-copa-escura', categoria: 'cozinhas', titulo: 'Copa em madeira escura', descricao: 'Nicho iluminado e armários em tom grafite.' },
  { foto: 'gal-closet-amplo', categoria: 'closets', titulo: 'Closet aberto em U', descricao: 'Módulos iluminados, gaveteiros e cabideiros em duas alturas.' },
  { foto: 'gal-dormitorio-ripado', categoria: 'dormitorios', titulo: 'Dormitório com frentes ripadas', descricao: 'Guarda-roupa de piso a teto e penteadeira integrada.' },
  { foto: 'gal-homeoffice-claro', categoria: 'home-office', titulo: 'Home office em madeira clara', descricao: 'Bancada suspensa e painel organizador.' },
  { foto: 'gal-cozinha-nicho', categoria: 'cozinhas', titulo: 'Cozinha com nichos abertos', descricao: 'Prateleiras iluminadas sobre a bancada de pedra.' },
  { foto: 'gal-sala-aparador', categoria: 'salas', titulo: 'Sala com aparador suspenso', descricao: 'Peça baixa em madeira e parede livre para a arte.' },
  { foto: 'gal-closet-penteadeira', categoria: 'closets', titulo: 'Closet com penteadeira', descricao: 'Portas de vidro, espelho iluminado e nichos para acessórios.' },
  { foto: 'gal-banheiro', categoria: 'banheiros', titulo: 'Banheiro com gabinete em madeira', descricao: 'Gabinete suspenso e espelho arqueado.' },
  { foto: 'gal-guarda-roupa', categoria: 'dormitorios', titulo: 'Guarda-roupa em carvalho', descricao: 'Portas de giro com espelhos embutidos.' },
  { foto: 'gal-homeoffice-estante', categoria: 'home-office', titulo: 'Estante e escrivaninha', descricao: 'Estrutura leve com prateleiras moduláveis.' },
  { foto: 'gal-cozinha-torre', categoria: 'cozinhas', titulo: 'Torre quente integrada', descricao: 'Forno e micro-ondas alinhados aos armários.' },
  { foto: 'gal-comercial-cafe', categoria: 'banheiros', titulo: 'Ambiente comercial', descricao: 'Balcão e mesas para uma cafeteria.' },
];

export const ETAPAS = [
  {
    titulo: 'Primeiro contato',
    texto: 'Você nos conta sobre o ambiente, o momento da obra e o que espera do projeto — por WhatsApp, telefone ou e-mail.',
  },
  {
    titulo: 'Entendimento das necessidades',
    texto: 'Fazemos a medição técnica e conversamos sobre rotina, objetos a guardar e referências de estilo.',
  },
  {
    titulo: 'Planejamento do ambiente',
    texto: 'Desenvolvemos plantas, vistas e imagens em 3D, definindo materiais, ferragens e iluminação até o projeto ficar exato.',
  },
  {
    titulo: 'Produção dos móveis',
    texto: 'Com o projeto aprovado, cada peça é cortada, usinada e acabada sob medida, com conferência antes do envio.',
  },
  {
    titulo: 'Entrega e instalação',
    texto: 'Nossa equipe instala, regula portas e gavetas e entrega o ambiente limpo e pronto para uso.',
  },
];
