import { useEffect, useRef, useState } from 'react';
import { AMBIENTES } from '../data/conteudo.js';
import { Foto } from './Foto.jsx';
import { Icone } from './Icone.jsx';
import './ambientes.css';

const altDe = (a) => `${a.nome}: ambiente planejado em madeira (imagem ilustrativa).`;

export function Ambientes() {
  const [ativo, setAtivo] = useState(0);
  const [slide, setSlide] = useState(0);
  const trilhoRef = useRef(null);

  // Carrossel móvel: acompanha o cartão visível
  useEffect(() => {
    const trilho = trilhoRef.current;
    if (!trilho) return undefined;
    let quadro = 0;
    const aoRolar = () => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const cartao = trilho.firstElementChild;
        if (!cartao) return;
        const passo = cartao.getBoundingClientRect().width + parseFloat(getComputedStyle(trilho).columnGap || 0);
        setSlide(Math.min(AMBIENTES.length - 1, Math.round(trilho.scrollLeft / passo)));
      });
    };
    trilho.addEventListener('scroll', aoRolar, { passive: true });
    return () => {
      trilho.removeEventListener('scroll', aoRolar);
      cancelAnimationFrame(quadro);
    };
  }, []);

  const irPara = (i) => {
    const trilho = trilhoRef.current;
    const alvo = trilho?.children[i];
    if (alvo) trilho.scrollTo({ left: alvo.offsetLeft - trilho.firstElementChild.offsetLeft, behavior: 'smooth' });
  };

  const atual = AMBIENTES[ativo];

  return (
    <section id="ambientes" className="ambientes" aria-labelledby="ambientes-titulo">
      <div className="container">
        <div className="ambientes__topo">
          <p className="rotulo" data-reveal>
            <span>02</span> Ambientes planejados
          </p>
          <h2 id="ambientes-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
            Cada cômodo, <em>na sua medida.</em>
          </h2>
          <p className="texto-intro" data-reveal style={{ '--atraso': '160ms' }}>
            Da cozinha ao escritório, desenhamos marcenaria que organiza a rotina e dá caráter ao espaço. Escolha um
            ambiente para conhecer o que planejamos nele.
          </p>
        </div>

        {/* Desktop: índice editorial com imagem que acompanha a seleção */}
        <div className="ambientes__indice" data-reveal>
          <ol className="ambientes__lista" role="list">
            {AMBIENTES.map((a, i) => (
              <li key={a.id} className={i === ativo ? 'is-ativo' : undefined}>
                <button
                  type="button"
                  className="ambientes__item"
                  aria-expanded={i === ativo}
                  aria-controls={`ambiente-${a.id}`}
                  onMouseEnter={() => setAtivo(i)}
                  onFocus={() => setAtivo(i)}
                  onClick={() => setAtivo(i)}
                >
                  <span className="ambientes__num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="ambientes__nome">{a.nome}</span>
                  <Icone nome="seta-diagonal" className="ambientes__seta" />
                </button>
                <div className="ambientes__detalhe" id={`ambiente-${a.id}`}>
                  <div>
                    <p>{a.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="ambientes__palco">
            {AMBIENTES.map((a, i) => (
              <Foto
                key={a.id}
                nome={a.foto}
                className={`ambientes__foto${i === ativo ? ' is-ativa' : ''}`}
                sizes="(max-width: 1280px) 56vw, 760px"
                posicao={a.posicao}
                alt={i === ativo ? altDe(a) : ''}
              />
            ))}
            <div className="ambientes__legenda">
              <span className="ambientes__contador">
                {String(ativo + 1).padStart(2, '0')} <span>/ {String(AMBIENTES.length).padStart(2, '0')}</span>
              </span>
              <ul role="list" className="ambientes__itens">
                {atual.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Celular: carrossel com deslize horizontal */}
      <div className="ambientes__carrossel">
        <ol className="ambientes__trilho" ref={trilhoRef} role="list" aria-label="Ambientes planejados">
          {AMBIENTES.map((a, i) => (
            <li key={a.id} className="ambientes__cartao" aria-label={`${i + 1} de ${AMBIENTES.length}: ${a.nome}`}>
              <Foto nome={a.foto} className="ambientes__cartao-foto" sizes="84vw" posicao={a.posicao} alt={altDe(a)} />
              <span className="ambientes__num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{a.nome}</h3>
              <p>{a.texto}</p>
              <ul role="list" className="ambientes__itens">
                {a.itens.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="container ambientes__navegacao">
          <span className="ambientes__contador" aria-live="polite">
            {String(slide + 1).padStart(2, '0')} <span>/ {String(AMBIENTES.length).padStart(2, '0')}</span>
          </span>
          <span className="ambientes__barra" aria-hidden="true">
            <span style={{ transform: `scaleX(${(slide + 1) / AMBIENTES.length})` }} />
          </span>
          <div className="ambientes__setas">
            <button
              type="button"
              onClick={() => irPara(Math.max(0, slide - 1))}
              disabled={slide === 0}
              aria-label="Ambiente anterior"
            >
              <Icone nome="seta-esq" />
            </button>
            <button
              type="button"
              onClick={() => irPara(Math.min(AMBIENTES.length - 1, slide + 1))}
              disabled={slide === AMBIENTES.length - 1}
              aria-label="Próximo ambiente"
            >
              <Icone nome="seta" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
