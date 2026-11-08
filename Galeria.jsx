import { useMemo, useState } from 'react';
import { GALERIA, CATEGORIAS_GALERIA } from '../data/conteudo.js';
import { FOTOS } from '../data/fotos.js';
import { Foto } from './Foto.jsx';
import { Icone } from './Icone.jsx';
import { Ampliacao } from './Ampliacao.jsx';
import './galeria.css';

const rotuloCategoria = (id) => CATEGORIAS_GALERIA.find((c) => c.id === id)?.rotulo ?? '';

export function Galeria() {
  const [filtro, setFiltro] = useState('todos');
  const [aberta, setAberta] = useState(null);

  const itens = useMemo(
    () => (filtro === 'todos' ? GALERIA : GALERIA.filter((g) => g.categoria === filtro)),
    [filtro],
  );

  return (
    <section id="projetos" className="galeria" aria-labelledby="galeria-titulo">
      <div className="container">
        <div className="galeria__topo">
          <p className="rotulo" data-reveal>
            <span>05</span> Projetos
          </p>
          <h2 id="galeria-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
            Referências para <em>imaginar o seu.</em>
          </h2>
          <div className="galeria__aviso" data-reveal style={{ '--atraso': '160ms' }}>
            <p className="etiqueta-demo">Demonstrações conceituais</p>
            <p>
              As imagens desta galeria ilustram estilos e soluções de marcenaria planejada. São referências
              conceituais e não representam obras executadas pela Lumen.
            </p>
          </div>
        </div>

        <div className="galeria__filtros" role="group" aria-label="Filtrar projetos por ambiente" data-reveal>
          {CATEGORIAS_GALERIA.map((c) => {
            const qtd = c.id === 'todos' ? GALERIA.length : GALERIA.filter((g) => g.categoria === c.id).length;
            return (
              <button
                key={c.id}
                type="button"
                className="galeria__filtro"
                aria-pressed={filtro === c.id}
                onClick={() => setFiltro(c.id)}
              >
                {c.rotulo}
                <sup>{qtd}</sup>
              </button>
            );
          })}
        </div>

        <p className="visualmente-oculto" aria-live="polite">
          {itens.length} {itens.length === 1 ? 'projeto exibido' : 'projetos exibidos'}
        </p>
        <ul className="galeria__lista" role="list">
          {itens.map((g, i) => {
            const f = FOTOS[g.foto];
            return (
              <li key={`${filtro}-${g.foto}`} className="galeria__item" style={{ '--ar': (f.w / f.h).toFixed(4), '--i': i }}>
                <button type="button" className="galeria__botao" onClick={() => setAberta(i)}>
                  <Foto
                    nome={g.foto}
                    sizes="(max-width: 600px) 92vw, (max-width: 1100px) 50vw, 34vw"
                    alt={`${g.titulo}. ${g.descricao}`}
                  />
                  <span className="galeria__ampliar" aria-hidden="true">
                    <Icone nome="ampliar" />
                  </span>
                  <span className="visualmente-oculto">Ampliar imagem</span>
                </button>
                <div className="galeria__legenda">
                  <span>{rotuloCategoria(g.categoria)}</span>
                  <h3>{g.titulo}</h3>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Ampliacao
        itens={itens}
        indice={aberta}
        onMudar={setAberta}
        onFechar={() => setAberta(null)}
        rotuloCategoria={rotuloCategoria}
      />
    </section>
  );
}
