import { useEffect, useRef, useState } from 'react';
import { NAVEGACAO } from '../data/conteudo.js';
import { empresa, linkWhatsApp, linkTelefone, linkEmail } from '../config/empresa.js';
import { Logo } from './Logo.jsx';
import { Icone, IconeWhatsApp } from './Icone.jsx';
import './cabecalho.css';

export function Cabecalho() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [ativa, setAtiva] = useState('');
  const botaoRef = useRef(null);
  const menuRef = useRef(null);

  // Fundo sólido após sair do topo
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  // Destaca a seção atual na navegação
  useEffect(() => {
    const secoes = NAVEGACAO.map((n) => document.getElementById(n.id)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => { if (e.isIntersecting) setAtiva(e.target.id); });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    secoes.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Menu móvel: trava a rolagem, fecha com Esc e mantém o foco dentro
  useEffect(() => {
    if (!aberto) return undefined;
    document.body.classList.add('menu-aberto');
    const focaveis = () => menuRef.current?.querySelectorAll('a, button') ?? [];
    focaveis()[0]?.focus();
    const aoTeclar = (e) => {
      if (e.key === 'Escape') {
        setAberto(false);
        botaoRef.current?.focus();
      }
      if (e.key === 'Tab') {
        const lista = [botaoRef.current, ...focaveis()];
        const primeiro = lista[0];
        const ultimo = lista[lista.length - 1];
        if (e.shiftKey && document.activeElement === primeiro) {
          e.preventDefault();
          ultimo.focus();
        } else if (!e.shiftKey && document.activeElement === ultimo) {
          e.preventDefault();
          primeiro.focus();
        }
      }
    };
    document.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.classList.remove('menu-aberto');
      document.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1081px)');
    const fechar = () => mq.matches && setAberto(false);
    mq.addEventListener('change', fechar);
    return () => mq.removeEventListener('change', fechar);
  }, []);

  const fechar = () => setAberto(false);

  return (
    <header className={`cabecalho${rolou ? ' is-solido' : ''}${aberto ? ' is-menu' : ''}`}>
      <div className="container cabecalho__barra">
        <a href="#inicio" className="cabecalho__logo" aria-label={`${empresa.nome} — voltar ao início`} onClick={fechar}>
          <Logo />
        </a>

        <nav className="cabecalho__nav" aria-label="Navegação principal">
          <ul role="list">
            {NAVEGACAO.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} aria-current={ativa === n.id ? 'true' : undefined}>
                  {n.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <a href="#contato" className="btn btn--contorno cabecalho__cta">
          Contato
        </a>

        <button
          ref={botaoRef}
          type="button"
          className="cabecalho__menu-botao"
          aria-expanded={aberto}
          aria-controls="menu-movel"
          onClick={() => setAberto((a) => !a)}
        >
          <span className="cabecalho__menu-texto">{aberto ? 'Fechar' : 'Menu'}</span>
          <span className="cabecalho__hamburguer" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <div
        id="menu-movel"
        ref={menuRef}
        className="menu-movel tema-escuro"
        hidden={!aberto}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <nav aria-label="Navegação do menu">
          <ol className="menu-movel__lista" role="list">
            {NAVEGACAO.map((n, i) => (
              <li key={n.id} style={{ '--i': i }}>
                <a href={`#${n.id}`} onClick={fechar}>
                  <span className="menu-movel__num">{String(i + 1).padStart(2, '0')}</span>
                  {n.rotulo}
                </a>
              </li>
            ))}
            <li style={{ '--i': NAVEGACAO.length }}>
              <a href="#contato" onClick={fechar}>
                <span className="menu-movel__num">{String(NAVEGACAO.length + 1).padStart(2, '0')}</span>
                Contato
              </a>
            </li>
          </ol>
        </nav>
        <div className="menu-movel__rodape">
          <a className="btn btn--bronze" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
            <IconeWhatsApp className="icone" />
            Orçamento pelo WhatsApp
          </a>
          <div className="menu-movel__contatos">
            <a href={linkTelefone()}>
              <Icone nome="telefone" /> {empresa.contato.telefoneExibicao}
            </a>
            <a href={linkEmail()}>
              <Icone nome="email" /> {empresa.contato.email}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
