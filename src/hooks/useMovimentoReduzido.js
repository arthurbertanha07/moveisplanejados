import { useEffect, useState } from 'react';

const consulta = '(prefers-reduced-motion: reduce)';

/** Retorna true quando o visitante pediu menos movimento nas preferências do sistema. */
export function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(consulta).matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia(consulta);
    const atualizar = () => setReduzido(mq.matches);
    mq.addEventListener('change', atualizar);
    return () => mq.removeEventListener('change', atualizar);
  }, []);
  return reduzido;
}
