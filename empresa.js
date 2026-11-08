// ============================================================================
// Dados da empresa — edite aqui para atualizar todo o site.
// Todos os valores abaixo são FICTÍCIOS e servem apenas para demonstração.
// ============================================================================

export const empresa = {
  nome: 'Lumen Móveis Planejados',
  marca: 'Lumen',
  descricaoCurta: 'Marcenaria autoral e móveis planejados sob medida.',

  // Quando true, o site exibe avisos discretos de que dados e imagens são demonstrativos.
  demonstrativo: true,

  contato: {
    // WhatsApp: apenas dígitos, com código do país (55) e DDD.
    whatsapp: '5511000000000',
    whatsappExibicao: '(11) 00000-0000',
    telefone: '+551100000000',
    telefoneExibicao: '(11) 0000-0000',
    email: 'contato@lumenmoveis.example',
  },

  // Mensagem enviada ao abrir o WhatsApp pelos botões de orçamento.
  mensagemWhatsApp: 'Olá, Lumen! Gostaria de solicitar um orçamento de móveis planejados.',

  endereco: {
    logradouro: 'Rua Exemplo, 000',
    complemento: 'Showroom',
    bairro: 'Pinheiros',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '00000-000',
  },

  horarios: [
    { dias: 'Segunda a sexta', horas: '9h às 18h' },
    { dias: 'Sábado', horas: '9h às 13h' },
  ],
  observacaoAtendimento: 'Visitas ao showroom e medições técnicas com hora marcada.',

  regiao: {
    titulo: 'São Paulo e Grande São Paulo',
    resumo: 'Atendemos a capital paulista e cidades da Grande São Paulo.',
    areas: [
      { nome: 'São Paulo — capital', locais: ['Zona Oeste', 'Zona Sul', 'Centro', 'Zona Norte', 'Zona Leste'] },
      { nome: 'Grande São Paulo', locais: ['ABC Paulista', 'Osasco', 'Barueri e Alphaville', 'Guarulhos'] },
    ],
    nota: 'Outras localidades sob consulta.',
  },

  mapa: {
    // URL de incorporação (iframe). Pode ser substituída por um link de incorporação do Google Maps.
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-46.7105%2C-23.5745%2C-46.6745%2C-23.5555&layer=mapnik',
    linkExterno: 'https://www.openstreetmap.org/#map=15/-23.5650/-46.6925',
    legenda: 'Pinheiros, São Paulo — região aproximada',
  },

  // Deixe vazio ('') para ocultar a rede social.
  redes: {
    instagram: '',
    pinterest: '',
  },
};

/** Link do WhatsApp com mensagem pré-preenchida. */
export function linkWhatsApp(mensagem = empresa.mensagemWhatsApp) {
  return `https://wa.me/${empresa.contato.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export const linkEmail = () =>
  `mailto:${empresa.contato.email}?subject=${encodeURIComponent('Orçamento — móveis planejados')}`;

export const linkTelefone = () => `tel:${empresa.contato.telefone}`;

export const enderecoCompleto = () => {
  const e = empresa.endereco;
  return `${e.logradouro} — ${e.bairro}, ${e.cidade}/${e.uf}`;
};
