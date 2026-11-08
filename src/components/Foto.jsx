import { FOTOS, srcFoto, srcsetFoto } from '../data/fotos.js';

/**
 * Imagem responsiva (WebP em três larguras) com carregamento preguiçoso.
 * `revelar` aplica a animação de entrada por máscara.
 */
export function Foto({ nome, alt, sizes = '100vw', className, prioridade = false, posicao, revelar = false, atraso, children }) {
  const foto = FOTOS[nome];
  if (!foto) return null;
  return (
    <div
      className={['foto', className].filter(Boolean).join(' ')}
      data-reveal={revelar ? 'imagem' : undefined}
      style={atraso ? { '--atraso': atraso } : undefined}
    >
      <img
        src={srcFoto(nome, foto.larguras[1])}
        srcSet={srcsetFoto(nome)}
        sizes={sizes}
        width={foto.w}
        height={foto.h}
        alt={alt}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding={prioridade ? 'sync' : 'async'}
        fetchPriority={prioridade ? 'high' : undefined}
        style={posicao ? { objectPosition: posicao } : undefined}
        draggable="false"
      />
      {children}
    </div>
  );
}
