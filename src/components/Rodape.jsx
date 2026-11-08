import { empresa, linkWhatsApp, linkTelefone, linkEmail, enderecoCompleto } from '../config/empresa.js';
import { NAVEGACAO } from '../data/conteudo.js';
import { FOTOS } from '../data/fotos.js';
import { Logo } from './Logo.jsx';
import './rodape.css';

const creditos = Object.values(
  Object.values(FOTOS).reduce((acc, f) => {
    if (!acc[f.autor]) acc[f.autor] = f;
    return acc;
  }, {}),
);

export function Rodape() {
  const ano = new Date().getFullYear();
  const redes = Object.entries(empresa.redes).filter(([, url]) => url);

  return (
    <footer className="rodape tema-escuro">
      <div className="container">
        <div className="rodape__grade">
          <div className="rodape__marca">
            <a href="#inicio" aria-label={`${empresa.nome} — voltar ao início`}>
              <Logo />
            </a>
            <p>{empresa.descricaoCurta}</p>
            <a className="btn btn--contorno btn--sobre-escuro" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
              Solicitar orçamento
            </a>
          </div>

          <nav className="rodape__coluna" aria-label="Links rápidos">
            <h2>Navegação</h2>
            <ul role="list">
              {NAVEGACAO.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`}>{n.rotulo}</a>
                </li>
              ))}
              <li>
                <a href="#contato">Contato</a>
              </li>
            </ul>
          </nav>

          <div className="rodape__coluna">
            <h2>Contato</h2>
            <ul role="list">
              <li>
                <a href={linkTelefone()}>{empresa.contato.telefoneExibicao}</a>
              </li>
              <li>
                <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                  WhatsApp {empresa.contato.whatsappExibicao}
                </a>
              </li>
              <li>
                <a href={linkEmail()}>{empresa.contato.email}</a>
              </li>
              <li>{enderecoCompleto()}</li>
            </ul>
          </div>

          <div className="rodape__coluna">
            <h2>Atendimento</h2>
            <ul role="list">
              {empresa.horarios.map((h) => (
                <li key={h.dias}>
                  {h.dias}: {h.horas}
                </li>
              ))}
              <li>{empresa.regiao.titulo}</li>
              {redes.map(([rede, url]) => (
                <li key={rede}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="rodape__rede">
                    {rede}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="rodape__assinatura" aria-hidden="true">
          Lumen
        </p>

        <div className="rodape__base">
          <p>
            © {ano} {empresa.nome}. Todos os direitos reservados.
          </p>
          {empresa.demonstrativo && (
            <p className="rodape__demo">
              Projeto demonstrativo: empresa fictícia, com dados de contato e imagens ilustrativos.
            </p>
          )}
          <details className="rodape__creditos">
            <summary>Créditos das imagens</summary>
            <p>
              Fotografias sob a{' '}
              <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
                Licença Unsplash
              </a>
              , utilizadas como referências conceituais:
            </p>
            <ul role="list">
              {creditos.map((f) => (
                <li key={f.autor}>
                  <a href={f.unsplash} target="_blank" rel="noopener noreferrer">
                    {f.autor}
                  </a>
                </li>
              ))}
            </ul>
            <p>O guarda-roupa do showroom 3D é um modelo próprio, gerado em código.</p>
          </details>
        </div>
      </div>
    </footer>
  );
}
