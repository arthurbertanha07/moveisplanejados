import { ETAPAS } from '../data/conteudo.js';
import './processo.css';

export function Processo() {
  return (
    <section id="processo" className="processo" aria-labelledby="processo-titulo">
      <div className="container">
        <div className="processo__topo">
          <p className="rotulo" data-reveal>
            <span>06</span> Processo
          </p>
          <h2 id="processo-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
            Como funciona
          </h2>
          <p className="texto-intro" data-reveal style={{ '--atraso': '160ms' }}>
            Um caminho claro, do primeiro contato à instalação. Em cada etapa você sabe o que acontece e o que vem
            a seguir.
          </p>
        </div>

        <ol className="linha-tempo" role="list" data-reveal>
          {ETAPAS.map((e, i) => (
            <li key={e.titulo} className="etapa" style={{ '--i': i }}>
              <span className="etapa__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="etapa__marco" aria-hidden="true" />
              <h3 className="etapa__titulo">
                <span className="visualmente-oculto">Etapa {i + 1}: </span>
                {e.titulo}
              </h3>
              <p className="etapa__texto">{e.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
