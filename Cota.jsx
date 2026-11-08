/** Linha de cota (dimensão técnica), motivo gráfico recorrente da marca. */
export function Cota({ rotulo, className, vertical = false }) {
  return (
    <span className={['cota', vertical && 'cota--vertical', className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className="cota__linha" />
      <span className="cota__rotulo">{rotulo}</span>
      <span className="cota__linha" />
    </span>
  );
}
