# Lumen Móveis Planejados — landing page

Site institucional de uma marcenaria **fictícia**, criado como projeto demonstrativo.
Página única em React + Vite, com showroom 3D interativo em Three.js, pronta para hospedagem
estática na **Vercel** ou no **Cloudflare Pages**.

## Rodando localmente

Requer Node.js 20.19 ou superior (o arquivo `.nvmrc` fixa a versão 22, usada também pelo Cloudflare Pages).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/
npm run preview    # serve o build de produção em http://localhost:4173
```

## Publicando na Vercel

O projeto já inclui `vercel.json` (build, pasta de saída e cabeçalhos de cache e segurança).

**Opção 1 — pelo site, com GitHub**

1. Crie um repositório no GitHub e envie todos os arquivos deste projeto (sem `node_modules` e `dist`).
2. Na Vercel: **Add New → Project → Import** e escolha o repositório.
3. A Vercel detecta o Vite sozinha (build `npm run build`, saída `dist`). Clique em **Deploy**.

**Opção 2 — pelo terminal, sem GitHub**

Dentro da pasta do projeto:

```bash
npx vercel --prod
```

Na primeira vez, o comando pede login na Vercel e confirma o nome do projeto. O build é feito na própria Vercel.

**Depois de publicar:** em **Settings → Environment Variables**, crie `VITE_SITE_URL` com o endereço final
(ex.: `https://lumen-moveis.vercel.app` ou seu domínio) e faça um novo deploy. Esse valor é usado no link
canônico e na imagem de compartilhamento (Open Graph).

## Publicando no Cloudflare Pages

1. Envie o projeto para um repositório no GitHub ou GitLab.
2. No painel da Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**.
3. Configure o build:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Variável de ambiente (opcional):** `VITE_SITE_URL` = endereço final do site (ex.: `https://www.seudominio.com.br`)
4. Salve e publique.

Também é possível publicar sem Git, enviando a pasta já compilada:

```bash
npm run build
npx wrangler pages deploy dist --project-name=lumen-moveis
```

O arquivo `public/_headers` (usado só pelo Cloudflare; a Vercel usa o `vercel.json`) define cache longo para os arquivos com hash e cabeçalhos de segurança básicos.

## Onde editar o conteúdo

| O quê | Arquivo |
| --- | --- |
| Nome, telefone, WhatsApp, e-mail, endereço, horários, região atendida, mapa e redes sociais | `src/config/empresa.js` |
| Textos de ambientes, diferenciais, galeria, etapas do processo e menu | `src/data/conteudo.js` |
| Fotografias (arquivos, autores e links de licença) | `src/data/fotos.js` e `public/img/` |
| Madeiras, puxadores e ficha técnica do showroom 3D | `src/showroom/acabamentos.js` |
| Endereço público do site (canonical e Open Graph) | `.env` → `VITE_SITE_URL` |

### WhatsApp

Em `src/config/empresa.js`, preencha `contato.whatsapp` só com dígitos, incluindo o código do país e o DDD
(ex.: `5511987654321`), e ajuste `mensagemWhatsApp`. Todos os botões de WhatsApp usam esse número: o botão
flutuante, o do menu, o da seção de contato e o do rodapé. Na seção de contato, o visitante pode marcar
ambientes e informar nome e bairro; a mensagem é montada e aberta no WhatsApp com esse texto já preenchido.

### Mapa

`mapa.embedUrl` aceita qualquer URL de incorporação (OpenStreetMap ou Google Maps → Compartilhar → Incorporar
um mapa → copie apenas o `src` do iframe). O mapa só é carregado quando o visitante clica em
"Carregar mapa interativo", o que preserva o desempenho e a privacidade.

### Avisos de demonstração

Com `demonstrativo: true`, o site exibe avisos discretos de que dados e imagens são ilustrativos. Ao usar
dados reais, mude para `false`.

## Showroom 3D

- Modelo próprio, gerado em código (`src/showroom/motor/movel.js`): guarda-roupa em três módulos, com portas de
  giro, gavetas com caixa interna, puxadores em barra, nicho ripado iluminado por LED e interior equipado.
- Texturas de madeira procedurais (`texturas.js`), sem arquivos externos. Três madeiras e dois acabamentos de
  puxador podem ser trocados em tempo real.
- Interação: arrastar (mouse ou toque), setas do teclado, botões de giro, zoom e vista inicial, além de
  abrir e fechar portas e gavetas. No celular, o deslize vertical continua rolando a página.
- Desempenho: o Three.js é carregado sob demanda quando a seção se aproxima da tela. A renderização acontece
  só quando há movimento, pausa fora da área visível e usa resolução e sombras menores no celular.
- Acessibilidade: respeita `prefers-reduced-motion` (sem giro automático, transições curtas). Sem WebGL,
  exibe o desenho técnico do móvel no lugar do 3D. Com o modo de economia de dados ativo, o 3D só carrega
  após um clique.

## Imagens

As fotografias são do [Unsplash](https://unsplash.com) e seguem a [Licença Unsplash](https://unsplash.com/license),
que permite uso comercial gratuito. Os autores estão em `src/data/fotos.js` e nos créditos do rodapé.
Elas são referências conceituais e não representam obras executadas pela empresa.

- `scripts/baixar-imagens.mjs` baixa novamente as fotos em WebP, em três larguras.
- `scripts/gerar-icones.mjs` gera o favicon e os ícones a partir da marca.

## Estrutura

```
src/
  config/empresa.js        dados editáveis da empresa
  data/                    textos, listas e catálogo de fotos
  components/              seções da página (cada uma com seu CSS)
  showroom/                seção 3D (interface) e motor/ (Three.js)
  hooks/                   animação de entrada e movimento reduzido
  styles/base.css          paleta, tipografia, botões e utilitários
public/
  img/                     fotografias otimizadas
  _headers, robots.txt, ícones, og-image.jpg, site.webmanifest
```
