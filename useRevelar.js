import { useEffect } from 'react';

/**
 * Observa elementos com [data-reveal] e adiciona .is-visivel quando entram na tela.
 * Também observa elementos adicionados depois (ex.: filtros da galeria).
 */
export function useRevelar() {
  useEffect(() => {
    const marcar = (el) => el.classList.add('is-visivel');
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(marcar);
      return undefined;
    }
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            marcar(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observarTodos = (raiz) => {
      raiz.querySelectorAll?.('[data-reveal]:not(.is-visivel)').forEach((el) => obs.observe(el));
    };
    observarTodos(document);
    const mutacoes = new MutationObserver((lista) => {
      lista.forEach((m) => m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.matches('[data-reveal]:not(.is-visivel)')) obs.observe(n);
        observarTodos(n);
      }));
    });
    mutacoes.observe(document.body, { childList: true, subtree: true });
    return () => {
      obs.disconnect();
      mutacoes.disconnect();
    };
  }, []);
}
