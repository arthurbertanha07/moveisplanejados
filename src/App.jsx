import { Cabecalho } from './components/Cabecalho.jsx';
import { Hero } from './components/Hero.jsx';
import { Sobre } from './components/Sobre.jsx';
import { Ambientes } from './components/Ambientes.jsx';
import { Showroom } from './showroom/Showroom.jsx';
import { Diferenciais } from './components/Diferenciais.jsx';
import { Galeria } from './components/Galeria.jsx';
import { Processo } from './components/Processo.jsx';
import { Atendimento } from './components/Atendimento.jsx';
import { Contato } from './components/Contato.jsx';
import { Rodape } from './components/Rodape.jsx';
import { WhatsAppFlutuante } from './components/WhatsAppFlutuante.jsx';
import { useRevelar } from './hooks/useRevelar.js';

export default function App() {
  useRevelar();
  return (
    <>
      <a className="pular-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" tabIndex={-1}>
        <Hero />
        <Sobre />
        <Ambientes />
        <Showroom />
        <Diferenciais />
        <Galeria />
        <Processo />
        <Atendimento />
        <Contato />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
    </>
  );
}
