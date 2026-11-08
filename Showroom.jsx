import { useCallback, useEffect, useRef, useState } from 'react';
import { MADEIRAS, PUXADORES, FICHA_TECNICA } from './acabamentos.js';
import { DesenhoElevacao } from './DesenhoElevacao.jsx';
import { Icone } from '../components/Icone.jsx';
import { useMovimentoReduzido } from '../hooks/useMovimentoReduzido.js';
import './showroom.css';

function suportaWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

const economiaDeDados = () => !!navigator.connection?.saveData;

const HOTSPOTS = [
  {
    id: 'puxador',
    titulo: 'Puxador em barra',
    texto: (p) => `Barra de 110 cm com apoios recuados, em ${p.toLowerCase()}. Desenhada para a mão encontrar sem procurar.`,
  },
  {
    id: 'nicho',
    titulo: 'Nicho ripado iluminado',
    texto: () => 'Ripas de 3 cm sobre fundo escuro e fita de LED em luz quente embutida sob as prateleiras.',
  },
  {
    id: 'gavetas',
    titulo: 'Gavetas com fechamento suave',
    texto: () => 'Corrediças telescópicas com amortecimento e frentes alinhadas no mesmo veio da madeira.',
  },
];

export function Showroom() {
  const secaoRef = useRef(null);
  const palcoRef = useRef(null);
  const motorRef = useRef(null);
  const hotspotRefs = useRef({});
  const reduzido = useMovimentoReduzido();

  // aguardando | manual | carregando | pronto | indisponivel
  const [estado, setEstado] = useState('aguardando');
  const [progresso, setProgresso] = useState(0);
  const [madeira, setMadeira] = useState(MADEIRAS[0].id);
  const [puxador, setPuxador] = useState(PUXADORES[0].id);
  const [aberto, setAberto] = useState(false);
  const [giro, setGiro] = useState(true);
  const [interagiu, setInteragiu] = useState(false);
  const [hotspotAtivo, setHotspotAtivo] = useState(null);

  const iniciar = useCallback(async () => {
    if (motorRef.current || !palcoRef.current) return;
    setEstado('carregando');
    try {
      const { criarShowroom } = await import('./motor/showroom.js');
      const motor = await criarShowroom(palcoRef.current, {
        movimentoReduzido: reduzido,
        movel: window.matchMedia('(max-width: 760px), (pointer: coarse)').matches,
        madeira,
        puxador,
        onProgresso: (p) => setProgresso(Math.round(p * 100)),
        onInteracao: ({ giro: g }) => {
          setInteragiu(true);
          if (g === false) setGiro(false);
        },
        onContextoPerdido: () => setEstado('indisponivel'),
      });
      motorRef.current = motor;
      motor.registrarHotspots(HOTSPOTS.map(({ id }) => ({ id, el: hotspotRefs.current[id] })));
      motor.definirGiro(!reduzido && giro);
      setEstado('pronto');
    } catch (erro) {
      console.error('Showroom 3D indisponível:', erro);
      setEstado('indisponivel');
    }
    // As preferências iniciais são lidas apenas na criação do motor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Carrega o 3D apenas quando a seção se aproxima da área visível
  useEffect(() => {
    if (!suportaWebGL()) {
      setEstado('indisponivel');
      return undefined;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        obs.disconnect();
        if (economiaDeDados()) setEstado('manual');
        else iniciar();
      },
      { rootMargin: '600px 0px' },
    );
    obs.observe(secaoRef.current);
    return () => obs.disconnect();
  }, [iniciar]);

  useEffect(() => () => motorRef.current?.destruir(), []);

  useEffect(() => { motorRef.current?.definirMadeira(madeira); }, [madeira]);
  useEffect(() => { motorRef.current?.definirPuxador(puxador); }, [puxador]);
  useEffect(() => { motorRef.current?.definirAberto(aberto); }, [aberto]);
  useEffect(() => { if (reduzido) setGiro(false); }, [reduzido]);

  const alternarGiro = () => {
    const novo = !giro;
    setGiro(novo);
    motorRef.current?.definirGiro(novo);
  };

  const comando = (fn) => () => {
    setInteragiu(true);
    fn(motorRef.current);
  };

  function aoTeclar(e) {
    const m = motorRef.current;
    if (!m) return;
    const acoes = {
      ArrowLeft: () => m.girar(0.16),
      ArrowRight: () => m.girar(-0.16),
      ArrowUp: () => m.inclinar(0.06),
      ArrowDown: () => m.inclinar(-0.06),
      '+': () => m.aproximar(0.9),
      '=': () => m.aproximar(0.9),
      '-': () => m.aproximar(1.1),
      Home: () => m.redefinirVista(),
    };
    const acao = acoes[e.key];
    if (acao) {
      e.preventDefault();
      setInteragiu(true);
      if (giro) setGiro(false);
      acao();
    }
  }

  const madeiraAtual = MADEIRAS.find((m) => m.id === madeira);
  const puxadorAtual = PUXADORES.find((p) => p.id === puxador);
  const pronto = estado === 'pronto';

  return (
    <section id="showroom" className="showroom tema-escuro" ref={secaoRef} aria-labelledby="showroom-titulo">
      <div className="container showroom__topo">
        <p className="rotulo" data-reveal>
          <span>03</span> Showroom digital
        </p>
        <h2 id="showroom-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
          Um projeto Lumen, <em>em todos os ângulos.</em>
        </h2>
        <p className="texto-intro" data-reveal style={{ '--atraso': '160ms' }}>
          Gire o guarda-roupa Atelier, abra portas e gavetas e troque madeiras e puxadores. É assim que
          apresentamos cada projeto: em 3D, antes de qualquer peça ser produzida.
        </p>
      </div>

      <div className="container showroom__grade">
        <div className="showroom__visor" data-reveal="imagem">
          <div
            ref={palcoRef}
            className={`showroom__palco is-${estado}`}
            tabIndex={pronto ? 0 : -1}
            role="group"
            aria-roledescription="visualizador 3D"
            aria-label="Guarda-roupa Atelier em 3D. Use as setas do teclado para girar e inclinar, as teclas mais e menos para aproximar e Home para voltar à vista inicial."
            onKeyDown={aoTeclar}
          >
            {/* Marcadores de detalhes ancorados no modelo */}
            <div className="showroom__hotspots" hidden={!pronto}>
              {HOTSPOTS.map((h) => (
                <div
                  key={h.id}
                  className={`hotspot${hotspotAtivo === h.id ? ' is-aberto' : ''}`}
                  ref={(el) => { hotspotRefs.current[h.id] = el; }}
                >
                  <button
                    type="button"
                    className="hotspot__botao"
                    aria-expanded={hotspotAtivo === h.id}
                    aria-controls={`hotspot-${h.id}`}
                    onClick={() => setHotspotAtivo((a) => (a === h.id ? null : h.id))}
                  >
                    <span className="visualmente-oculto">Detalhe: {h.titulo}</span>
                  </button>
                  <div className="hotspot__balao" id={`hotspot-${h.id}`} role="note" hidden={hotspotAtivo !== h.id}>
                    <strong>{h.titulo}</strong>
                    <span>{h.texto(puxadorAtual.nome)}</span>
                  </div>
                </div>
              ))}
            </div>

            {estado !== 'pronto' && (
              <div className="showroom__poster">
                <DesenhoElevacao animado={estado === 'carregando' || estado === 'aguardando'} />
                {(estado === 'aguardando' || estado === 'carregando') && (
                  <p className="showroom__status" role="status">
                    Preparando o showroom
                    <span className="showroom__percentual">{String(progresso).padStart(2, '0')}%</span>
                  </p>
                )}
                {estado === 'manual' && (
                  <div className="showroom__aviso">
                    <p>Seu dispositivo está em modo de economia de dados.</p>
                    <button type="button" className="btn btn--claro" onClick={iniciar}>
                      Carregar visualização 3D
                    </button>
                  </div>
                )}
                {estado === 'indisponivel' && (
                  <div className="showroom__aviso">
                    <p>
                      A visualização 3D não está disponível neste navegador. Acima, a vista técnica do guarda-roupa
                      Atelier; ao lado, os acabamentos que oferecemos.
                    </p>
                  </div>
                )}
              </div>
            )}

            {pronto && (
              <p className={`showroom__dica${interagiu ? ' is-oculta' : ''}`} aria-hidden="true">
                <Icone nome="mao" />
                <span className="so-desktop">Arraste para girar</span>
                <span className="so-toque">Deslize para os lados para girar</span>
              </p>
            )}
          </div>

          <div className="showroom__controles" role="toolbar" aria-label="Controles da visualização 3D">
            <div className="showroom__grupo">
              <button type="button" className="ctrl" onClick={comando((m) => m?.girar(0.35))} disabled={!pronto} aria-label="Girar para a esquerda" title="Girar para a esquerda">
                <Icone nome="girar-esq" />
              </button>
              <button type="button" className="ctrl" onClick={comando((m) => m?.girar(-0.35))} disabled={!pronto} aria-label="Girar para a direita" title="Girar para a direita">
                <Icone nome="girar-dir" />
              </button>
              <button type="button" className="ctrl" onClick={comando((m) => m?.aproximar(1.12))} disabled={!pronto} aria-label="Afastar" title="Afastar">
                <Icone nome="menos" />
              </button>
              <button type="button" className="ctrl" onClick={comando((m) => m?.aproximar(0.88))} disabled={!pronto} aria-label="Aproximar" title="Aproximar">
                <Icone nome="mais" />
              </button>
              <button type="button" className="ctrl" onClick={comando((m) => m?.redefinirVista())} disabled={!pronto} aria-label="Voltar à vista inicial" title="Vista inicial">
                <Icone nome="centro" />
              </button>
              {!reduzido && (
                <button type="button" className="ctrl" onClick={alternarGiro} disabled={!pronto} aria-pressed={giro} aria-label="Giro automático" title={giro ? 'Pausar giro automático' : 'Ativar giro automático'}>
                  <Icone nome={giro ? 'pausa' : 'play'} />
                </button>
              )}
            </div>
            <button
              type="button"
              className="ctrl ctrl--texto"
              onClick={() => setAberto((a) => !a)}
              disabled={!pronto}
              aria-pressed={aberto}
            >
              <Icone nome="porta" />
              {aberto ? 'Fechar portas' : 'Abrir portas e gavetas'}
            </button>
          </div>
        </div>

        <aside className="showroom__painel" aria-label="Personalização do guarda-roupa">
          <div className="painel__bloco" data-reveal>
            <h3 className="painel__titulo">Atelier</h3>
            <p className="painel__sub">Guarda-roupa em três módulos · conceito</p>
          </div>

          <fieldset className="painel__bloco" data-reveal style={{ '--atraso': '80ms' }}>
            <legend className="painel__legenda">Madeira</legend>
            <div className="amostras">
              {MADEIRAS.map((m) => (
                <label key={m.id} className="amostra">
                  <input
                    type="radio"
                    name="madeira"
                    value={m.id}
                    checked={madeira === m.id}
                    onChange={() => setMadeira(m.id)}
                    className="visualmente-oculto"
                  />
                  <span
                    className="amostra__chip"
                    style={{
                      '--a': m.amostra[0],
                      '--b': m.amostra[1],
                      '--c': m.amostra[2],
                    }}
                    aria-hidden="true"
                  />
                  <span className="amostra__nome">{m.nome}</span>
                </label>
              ))}
            </div>
            <p className="painel__descricao" aria-live="polite">{madeiraAtual.resumo}</p>
          </fieldset>

          <fieldset className="painel__bloco" data-reveal style={{ '--atraso': '140ms' }}>
            <legend className="painel__legenda">Puxadores</legend>
            <div className="opcoes">
              {PUXADORES.map((p) => (
                <label key={p.id} className="opcao">
                  <input
                    type="radio"
                    name="puxador"
                    value={p.id}
                    checked={puxador === p.id}
                    onChange={() => setPuxador(p.id)}
                    className="visualmente-oculto"
                  />
                  <span className="opcao__cor" style={{ background: p.cor }} aria-hidden="true" />
                  <span>{p.nome}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="painel__bloco" data-reveal style={{ '--atraso': '200ms' }}>
            <dl className="ficha">
              {FICHA_TECNICA.map((f) => (
                <div key={f.rotulo} className="ficha__linha">
                  <dt>{f.rotulo}</dt>
                  <dd>{f.valor}</dd>
                </div>
              ))}
            </dl>
            <p className="painel__nota">
              Medidas, divisões internas e acabamentos são definidos para cada ambiente. O modelo é uma
              demonstração conceitual.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
