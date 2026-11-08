import { useEffect, useState } from 'react';
import { linkWhatsApp } from '../config/empresa.js';
import { IconeWhatsApp } from './Icone.jsx';
import './whatsapp-flutuante.css';

/** Botão discreto de WhatsApp, exibido depois que o visitante passa da abertura. */
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);

  const [sobreposto, setSobreposto] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > window.innerHeight * 0.7);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    // Some quando a seção de contato ou o rodapé (que já têm WhatsApp) estão na tela
    const alvos = [document.getElementById('contato'), document.querySelector('footer')].filter(Boolean);
    const visiveis = new Set();
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => (e.isIntersecting ? visiveis.add(e.target) : visiveis.delete(e.target)));
      setSobreposto(visiveis.size > 0);
    }, { rootMargin: '0px 0px -25% 0px' });
    alvos.forEach((a) => obs.observe(a));
    return () => {
      window.removeEventListener('scroll', aoRolar);
      obs.disconnect();
    };
  }, []);

  const ativo = visivel && !sobreposto;

  return (
    <a
      href={linkWhatsApp()}
      target="_blank"
      rel="noopener noreferrer"
      className={`whatsapp-flutuante${ativo ? ' is-visivel' : ''}`}
      aria-label="Solicitar orçamento pelo WhatsApp (abre em nova aba)"
      tabIndex={ativo ? 0 : -1}
      aria-hidden={ativo ? undefined : 'true'}
    >
      <IconeWhatsApp className="whatsapp-flutuante__icone" />
      <span className="whatsapp-flutuante__texto">Orçamento</span>
    </a>
  );
}
