import { useCallback, useEffect, useRef } from 'react';
import { FOTOS, srcFoto, srcsetFoto } from '../data/fotos.js';
import { Icone } from './Icone.jsx';

/** Visualização ampliada da galeria, com teclado, deslize e foco gerenciado (elemento <dialog>). */
export function Ampliacao({ itens, indice, onMudar, onFechar, rotuloCategoria }) {
  const dialogoRef = useRef(null);
  const toqueRef = useRef(null);
  const aberto = indice !== null && indice !== undefined && itens[indice];

  useEffect(() => {
    const d = dialogoRef.current;
    if (!d) return;
    if (aberto && !d.open) {
      d.showModal();
      document.documentElement.classList.add('sem-rolagem');
    } else if (!aberto && d.open) {
      d.close();
    }
  }, [aberto]);

  // Fecha sem depender apenas do evento "close" (botão, Esc e clique no fundo chamam esta função)
  const fechar = useCallback(() => {
    const d = dialogoRef.current;
    if (d?.open) d.close();
    document.documentElement.classList.remove('sem-rolagem');
    onFechar();
  }, [onFechar]);

  useEffect(() => () => document.documentElement.classList.remove('sem-rolagem'), []);

  const total = itens.length;
  const anterior = () => onMudar((i) => (i - 1 + total) % total);
  const proximo = () => onMudar((i) => (i + 1) % total);

  function aoTeclar(e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); anterior(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); proximo(); }
  }

  function aoPressionar(e) {
    toqueRef.current = { x: e.clientX, y: e.clientY };
  }

  function aoSoltar(e) {
    const ini = toqueRef.current;
    toqueRef.current = null;
    if (!ini) return;
    const dx = e.clientX - ini.x;
    const dy = e.clientY - ini.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) proximo();
      else anterior();
    }
  }

  const item = aberto ? itens[indice] : null;
  const foto = item ? FOTOS[item.foto] : null;

  return (
    <dialog
      ref={dialogoRef}
      className="ampliacao tema-escuro"
      aria-label="Imagem ampliada"
      onKeyDown={aoTeclar}
      onCancel={(e) => {
        e.preventDefault();
        fechar();
      }}
      onClose={fechar}
      onClick={(e) => {
        if (e.target === dialogoRef.current) fechar();
      }}
    >
      {item && (
        <div className="ampliacao__conteudo">
          <div className="ampliacao__barra">
            <span className="ampliacao__contador">
              {String(indice + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <button type="button" className="ampliacao__fechar" onClick={fechar} autoFocus>
              Fechar
              <Icone nome="fechar" />
            </button>
          </div>

          <figure className="ampliacao__figura" onPointerDown={aoPressionar} onPointerUp={aoSoltar}>
            <img
              key={item.foto}
              src={srcFoto(item.foto, foto.larguras[1])}
              srcSet={srcsetFoto(item.foto)}
              sizes="100vw"
              width={foto.w}
              height={foto.h}
              alt={`${item.titulo}. ${item.descricao}`}
              draggable="false"
            />
            <figcaption className="ampliacao__legenda">
              <span className="ampliacao__categoria">{rotuloCategoria(item.categoria)}</span>
              <strong>{item.titulo}</strong>
              <span>{item.descricao}</span>
              <span className="ampliacao__credito">
                Imagem ilustrativa — demonstração conceitual. Foto:{' '}
                <a href={foto.unsplash} target="_blank" rel="noopener noreferrer">
                  {foto.autor} / Unsplash
                </a>
              </span>
            </figcaption>
          </figure>

          {total > 1 && (
            <div className="ampliacao__navegacao">
              <button type="button" onClick={anterior} aria-label="Imagem anterior">
                <Icone nome="seta-esq" />
              </button>
              <button type="button" onClick={proximo} aria-label="Próxima imagem">
                <Icone nome="seta" />
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
