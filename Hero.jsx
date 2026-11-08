import { Foto } from './Foto.jsx';
import { Icone } from './Icone.jsx';
import { empresa } from '../config/empresa.js';
import './hero.css';

export function Hero() {
  return (
    <section id="inicio" className="hero tema-escuro" aria-labelledby="hero-titulo">
      <Foto
        nome="hero-cozinha"
        className="hero__midia"
        prioridade
        sizes="100vw"
        posicao="62% 50%"
        alt="Cozinha planejada com armários em madeira natural, frontão em mármore e iluminação quente sob os armários."
      />
      <div className="hero__veu" aria-hidden="true" />

      <div className="container hero__conteudo">
        <p className="hero__sobretitulo hero__anim" style={{ '--d': '200ms' }}>
          Marcenaria autoral <span aria-hidden="true">·</span> Móveis planejados
        </p>
        <h1 id="hero-titulo" className="hero__titulo">
          <span className="hero__linha"><span style={{ '--d': '320ms' }}>A forma exata</span></span>
          <span className="hero__linha"><span style={{ '--d': '440ms' }}>do seu <em>espaço.</em></span></span>
        </h1>
        <p className="hero__texto hero__anim" style={{ '--d': '640ms' }}>
          Projetamos e produzimos móveis planejados com desenho autoral, materiais selecionados e acabamento
          preciso — para cozinhas, closets, salas e ambientes de trabalho que funcionam tão bem quanto parecem.
        </p>
        <div className="hero__acoes hero__anim" style={{ '--d': '780ms' }}>
          <a href="#contato" className="btn btn--claro">
            Solicitar orçamento
            <Icone nome="seta" className="icone-seta" />
          </a>
          <a href="#projetos" className="btn btn--contorno btn--sobre-escuro">
            Conhecer projetos
          </a>
        </div>
      </div>

      <div className="container hero__base hero__anim" style={{ '--d': '1000ms' }}>
        <dl className="hero__fatos">
          <div>
            <dt>Projetos</dt>
            <dd>Residenciais e corporativos</dd>
          </div>
          <div>
            <dt>Atendimento</dt>
            <dd>{empresa.regiao.titulo}</dd>
          </div>
          <div className="hero__fato-desktop">
            <dt>Processo</dt>
            <dd>Projeto em 3D antes da produção</dd>
          </div>
        </dl>
        <a href="#sobre" className="hero__rolar" aria-label="Rolar para a próxima seção">
          <span>Explorar</span>
          <span className="hero__rolar-linha" aria-hidden="true" />
        </a>
      </div>
      {empresa.demonstrativo && <p className="hero__credito">Imagem ilustrativa</p>}
    </section>
  );
}
