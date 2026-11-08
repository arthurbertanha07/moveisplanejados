import { useMemo, useState } from 'react';
import { empresa, linkWhatsApp, linkTelefone, linkEmail, enderecoCompleto } from '../config/empresa.js';
import { AMBIENTES } from '../data/conteudo.js';
import { Foto } from './Foto.jsx';
import { Icone, IconeWhatsApp } from './Icone.jsx';
import './contato.css';

function juntar(lista) {
  if (lista.length <= 1) return lista.join('');
  return `${lista.slice(0, -1).join(', ')} e ${lista[lista.length - 1]}`;
}

export function Contato() {
  const [escolhidos, setEscolhidos] = useState([]);
  const [nome, setNome] = useState('');
  const [local, setLocal] = useState('');

  const mensagem = useMemo(() => {
    const partes = ['Olá, Lumen!'];
    if (nome.trim()) partes.push(`Meu nome é ${nome.trim()}.`);
    if (escolhidos.length) {
      const nomes = AMBIENTES.filter((a) => escolhidos.includes(a.id)).map((a) => a.curto);
      partes.push(`Gostaria de solicitar um orçamento de móveis planejados. Ambientes de interesse: ${juntar(nomes)}.`);
    } else {
      partes.push('Gostaria de solicitar um orçamento de móveis planejados.');
    }
    if (local.trim()) partes.push(`O projeto é em ${local.trim()}.`);
    return partes.join(' ');
  }, [escolhidos, nome, local]);

  const link = linkWhatsApp(mensagem);

  const alternar = (id) =>
    setEscolhidos((atual) => (atual.includes(id) ? atual.filter((x) => x !== id) : [...atual, id]));

  return (
    <section id="contato" className="contato tema-escuro" aria-labelledby="contato-titulo">
      <div className="container contato__grade">
        <div className="contato__principal">
          <p className="rotulo" data-reveal>
            <span>08</span> Contato
          </p>
          <h2 id="contato-titulo" className="contato__titulo" data-reveal style={{ '--atraso': '80ms' }}>
            Vamos desenhar o seu <em>próximo ambiente?</em>
          </h2>
          <p className="texto-intro" data-reveal style={{ '--atraso': '140ms' }}>
            Conte um pouco sobre o seu projeto. Respondemos com os próximos passos para a medição técnica e o
            orçamento, sem compromisso.
          </p>

          <form
            className="compositor"
            data-reveal
            style={{ '--atraso': '200ms' }}
            onSubmit={(e) => {
              e.preventDefault();
              window.open(link, '_blank', 'noopener');
            }}
          >
            <fieldset className="compositor__ambientes">
              <legend>Quais ambientes? <span>(opcional)</span></legend>
              <div className="compositor__opcoes">
                {AMBIENTES.map((a) => (
                  <label key={a.id} className="compositor__opcao">
                    <input
                      type="checkbox"
                      checked={escolhidos.includes(a.id)}
                      onChange={() => alternar(a.id)}
                      className="visualmente-oculto"
                    />
                    <span>{a.nome}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="compositor__campos">
              <label className="compositor__campo">
                <span>Seu nome <small>(opcional)</small></span>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" maxLength={60} />
              </label>
              <label className="compositor__campo">
                <span>Bairro ou cidade <small>(opcional)</small></span>
                <input type="text" value={local} onChange={(e) => setLocal(e.target.value)} autoComplete="address-level2" maxLength={60} />
              </label>
            </div>

            <div className="compositor__previa" aria-live="polite">
              <span>Mensagem que será enviada</span>
              <p>“{mensagem}”</p>
            </div>

            <a className="btn btn--bronze contato__whatsapp" href={link} target="_blank" rel="noopener noreferrer">
              <IconeWhatsApp className="icone" />
              Solicitar orçamento pelo WhatsApp
            </a>
          </form>

          <ul className="contato__canais" role="list" data-reveal>
            <li>
              <Icone nome="telefone" />
              <div>
                <span>Telefone</span>
                <a href={linkTelefone()}>{empresa.contato.telefoneExibicao}</a>
              </div>
            </li>
            <li>
              <IconeWhatsApp className="icone" />
              <div>
                <span>WhatsApp</span>
                <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">{empresa.contato.whatsappExibicao}</a>
              </div>
            </li>
            <li>
              <Icone nome="email" />
              <div>
                <span>E-mail</span>
                <a href={linkEmail()}>{empresa.contato.email}</a>
              </div>
            </li>
            <li>
              <Icone nome="local" />
              <div>
                <span>Showroom</span>
                <a href="#atendimento">{enderecoCompleto()}</a>
              </div>
            </li>
          </ul>
          {empresa.demonstrativo && (
            <p className="etiqueta-demo contato__demo">Telefone, WhatsApp, e-mail e endereço demonstrativos</p>
          )}
        </div>

        <Foto
          nome="contato-nicho"
          className="contato__foto"
          revelar
          sizes="(max-width: 960px) 92vw, 36vw"
          posicao="50% 55%"
          alt="Nicho em madeira com prateleira iluminada por luz quente e objetos decorativos."
        />
      </div>
    </section>
  );
}
