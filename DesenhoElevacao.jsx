// Vista frontal técnica do guarda-roupa (em milímetros).
// Usada como tela de carregamento e como alternativa quando o WebGL não está disponível.

const ripas = Array.from({ length: 19 }, (_, i) => 1009 + i * 42);

export function DesenhoElevacao({ className, animado = false }) {
  const p = { pathLength: 1, vectorEffect: 'non-scaling-stroke' };
  return (
    <svg
      className={['elevacao', animado && 'elevacao--animada', className].filter(Boolean).join(' ')}
      viewBox="-260 -120 3260 3000"
      role="img"
      aria-label="Desenho técnico da vista frontal do guarda-roupa Atelier: 2.800 milímetros de largura por 2.600 de altura, com dois módulos de portas e um módulo central de gavetas e nicho ripado."
    >
      <g className="elevacao__estrutura">
        <rect x="0" y="0" width="2800" height="2600" {...p} />
        <rect x="25" y="2500" width="2750" height="100" className="elevacao__rodape" {...p} />
        <path d="M25 2475H2775M25 25H2775" {...p} />
        <path d="M975 25V2475M1000 25V2475M1800 25V2475M1825 25V2475" {...p} />
      </g>
      <g className="elevacao__portas">
        <rect x="28" y="28" width="470" height="2444" {...p} />
        <rect x="502" y="28" width="470" height="2444" {...p} />
        <rect x="1828" y="28" width="470" height="2444" {...p} />
        <rect x="2302" y="28" width="470" height="2444" {...p} />
        <path d="M453 930V2030M547 930V2030M2253 930V2030M2347 930V2030" className="elevacao__puxador" {...p} />
      </g>
      <g className="elevacao__central">
        <rect x="1003" y="1758" width="794" height="236" {...p} />
        <rect x="1003" y="1997" width="794" height="236" {...p} />
        <rect x="1003" y="2236" width="794" height="236" {...p} />
        <path d="M1230 1876H1570M1230 2115H1570M1230 2354H1570" className="elevacao__puxador" {...p} />
        <path d="M1000 1730H1800M1000 1755H1800" {...p} />
        <path d="M1000 585H1800M1000 615H1800M1000 1155H1800M1000 1185H1800" {...p} />
        {ripas.map((x) => (
          <path key={x} d={`M${x} 25V1730`} className="elevacao__ripa" {...p} />
        ))}
      </g>
      <g className="elevacao__cotas">
        <path d="M0 2720H2800M0 2680V2760M2800 2680V2760" {...p} />
        <path d="M-150 0V2600M-190 0H-110M-190 2600H-110" {...p} />
        <text x="1400" y="2840" textAnchor="middle">2.800</text>
        <text x="-185" y="1300" textAnchor="middle" transform="rotate(-90 -185 1300)">2.600</text>
      </g>
    </svg>
  );
}
