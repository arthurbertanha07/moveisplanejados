import { DIFERENCIAIS } from '../data/conteudo.js';
import { Foto } from './Foto.jsx';
import './diferenciais.css';

export function Diferenciais() {
  return (
    <section id="diferenciais" className="diferenciais" aria-labelledby="diferenciais-titulo">
      <div className="container diferenciais__grade">
        <div className="diferenciais__lateral">
          <p className="rotulo" data-reveal>
            <span>04</span> Diferenciais
          </p>
          <h2 id="diferenciais-titulo" className="titulo-secao" data-reveal style={{ '--atraso': '80ms' }}>
            O cuidado que se vê <em>e o que se sente.</em>
          </h2>
          <p className="texto-intro" data-reveal style={{ '--atraso': '160ms' }}>
            Um móvel planejado é usado todos os dias, por muitos anos. Por isso cada decisão — do veio da lâmina à
            corrediça da gaveta — é tomada com o mesmo critério.
          </p>
          <Foto
            nome="detalhe-gaveta"
            className="diferenciais__foto"
            revelar
            sizes="(max-width: 900px) 92vw, 34vw"
            posicao="50% 50%"
            alt="Detalhe de gaveta em madeira de teca com puxador cavado na própria peça."
          />
        </div>

        <ol className="diferenciais__lista" role="list">
          {DIFERENCIAIS.map((d, i) => (
            <li key={d.titulo} className="diferencial" data-reveal style={{ '--atraso': `${(i % 2) * 90}ms` }}>
              <span className="diferencial__num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="diferencial__titulo">{d.titulo}</h3>
              <p className="diferencial__texto">{d.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
