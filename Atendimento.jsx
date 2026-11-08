import { useState } from 'react';
import { empresa } from '../config/empresa.js';
import { Icone } from './Icone.jsx';
import './atendimento.css';

/** Ilustração de mapa (traço técnico) exibida antes de carregar o mapa real. */
function MapaIlustrado() {
  const ruas = [];
  for (let i = -6; i <= 14; i++) {
    ruas.push(<path key={`a${i}`} d={`M${i * 70 - 200} 0 L${i * 70 + 160} 600`} />);
    ruas.push(<path key={`b${i}`} d={`M-100 ${i * 58} L900 ${i * 58 - 260}`} />);
  }
  return (
    <svg className="mapa__ilustracao" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g className="mapa__ruas">{ruas}</g>
      <path className="mapa__avenida" d="M-20 470 C 180 420, 330 360, 470 250 S 720 90, 840 40" />
      <path className="mapa__avenida" d="M120 -20 L 360 620" />
      <path className="mapa__rio" d="M-30 560 C 120 520, 210 600, 360 540 S 560 380, 640 330 S 760 260, 840 250" />
      <g className="mapa__pino" transform="translate(400 300)">
        <circle r="46" className="mapa__onda" />
        <circle r="7" />
      </g>
    </svg>
  );
}

export function Atendimento() {
  const [mapaAtivo, setMapaAtivo] = useState(false);
  const { endereco, regiao, horarios, mapa } = empresa;

  return (
    <section id="atendimento" className="atendimento" aria-labelledby="atendimento-titulo">
      <div className="container atendimento__grade">
        <div className="atendimento__info">
          <p className="rotulo" data-reveal>
            <span>07</span> Localização e atendimento
          </p>
          <h2 id="atendimento-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
            Perto de você, <em>do projeto à obra.</em>
          </h2>
          <p className="texto-intro" data-reveal style={{ '--atraso': '140ms' }}>
            {regiao.resumo} A medição técnica e a instalação são feitas pela nossa própria equipe.
          </p>

          <div className="atendimento__blocos" data-reveal style={{ '--atraso': '200ms' }}>
            <div className="atendimento__bloco">
              <h3>Região atendida</h3>
              {regiao.areas.map((a) => (
                <div key={a.nome} className="atendimento__area">
                  <p className="atendimento__area-nome">{a.nome}</p>
                  <ul role="list">
                    {a.locais.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p className="atendimento__nota">{regiao.nota}</p>
            </div>

            <div className="atendimento__bloco">
              <h3>Showroom</h3>
              <address>
                {endereco.logradouro}
                <br />
                {endereco.bairro} — {endereco.cidade}/{endereco.uf}
                <br />
                CEP {endereco.cep}
              </address>
              <h3 className="atendimento__subtitulo">Horários</h3>
              <dl className="atendimento__horarios">
                {horarios.map((h) => (
                  <div key={h.dias}>
                    <dt>{h.dias}</dt>
                    <dd>{h.horas}</dd>
                  </div>
                ))}
              </dl>
              <p className="atendimento__nota">{empresa.observacaoAtendimento}</p>
            </div>
          </div>

          {empresa.demonstrativo && (
            <p className="etiqueta-demo atendimento__demo">
              Endereço, telefone e região são fictícios, apenas para demonstração
            </p>
          )}
        </div>

        <div className="atendimento__mapa" data-reveal="imagem">
          {mapaAtivo ? (
            <iframe
              title={`Mapa: ${mapa.legenda}`}
              src={mapa.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="mapa__fachada">
              <MapaIlustrado />
              <div className="mapa__cartao">
                <span className="mapa__cartao-rotulo">
                  <Icone nome="local" /> {mapa.legenda}
                </span>
                <button type="button" className="btn btn--escuro" onClick={() => setMapaAtivo(true)}>
                  Carregar mapa interativo
                </button>
                <small>O mapa é fornecido por um serviço externo e só carrega após o seu clique.</small>
              </div>
            </div>
          )}
          <a className="link-linha atendimento__link-mapa" href={mapa.linkExterno} target="_blank" rel="noopener noreferrer">
            Abrir em outra aba <Icone nome="seta-diagonal" />
          </a>
        </div>
      </div>
    </section>
  );
}
