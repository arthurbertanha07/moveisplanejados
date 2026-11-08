import { Foto } from './Foto.jsx';
import { Cota } from './Cota.jsx';
import { PRINCIPIOS } from '../data/conteudo.js';
import './sobre.css';

export function Sobre() {
  return (
    <section id="sobre" className="sobre" aria-labelledby="sobre-titulo">
      <div className="container sobre__grade">
        <p className="rotulo sobre__rotulo" data-reveal>
          <span>01</span> A Lumen
        </p>

        <div className="sobre__texto">
          <h2 id="sobre-titulo" className="titulo-secao" data-reveal>
            Móveis que começam na escuta e terminam no <em>detalhe.</em>
          </h2>
          <div className="sobre__paragrafos" data-reveal style={{ '--atraso': '100ms' }}>
            <p>
              A Lumen é uma marcenaria dedicada a móveis planejados para quem valoriza o desenho e o uso diário na
              mesma medida. Cada projeto nasce de uma conversa: como a casa funciona, o que precisa ser guardado e
              que atmosfera se deseja criar.
            </p>
            <p>
              A partir daí, desenhamos soluções sob medida que aproveitam cada vão com inteligência, combinam
              materiais com critério e tratam o acabamento como parte essencial do projeto — não como etapa final.
            </p>
          </div>

          <ol className="sobre__principios" role="list">
            {PRINCIPIOS.map((p, i) => (
              <li key={p.titulo} data-reveal style={{ '--atraso': `${120 + i * 70}ms` }}>
                <span className="sobre__num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{p.titulo}</h3>
                <p>{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="sobre__imagens">
          <Cota rotulo="Medir · desenhar · executar" className="sobre__cota" />
          <Foto
            nome="sobre-oficina"
            className="sobre__foto-principal"
            revelar
            sizes="(max-width: 760px) 92vw, 40vw"
            posicao="40% 50%"
            alt="Mãos marcando com lápis uma tábua de madeira em uma bancada de marcenaria, entre aparas."
          />
          <figure className="sobre__detalhe">
            <Foto
              nome="detalhe-puxador"
              revelar
              atraso="200ms"
              sizes="(max-width: 760px) 70vw, 26vw"
              posicao="35% 50%"
              alt="Detalhe de porta em madeira com puxador metálico e a sombra projetada pela luz do fim de tarde."
            />
            <figcaption>Puxador, veio e luz: o detalhe como parte do desenho.</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
