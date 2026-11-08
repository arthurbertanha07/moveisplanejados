/** Marca Lumen: duas portas e o filete de luz entre elas. */
export function MarcaLumen({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect x="8.5" y="6.5" width="10.5" height="27" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <rect x="21" y="6.5" width="10.5" height="27" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M20 3v34" stroke="var(--c-bronze-claro)" strokeWidth="1.4" />
      <path d="M16.5 17v6M23.5 17v6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function Logo({ className }) {
  return (
    <span className={['logo', className].filter(Boolean).join(' ')}>
      <MarcaLumen className="logo__marca" />
      <span className="logo__texto">
        <span className="logo__nome">Lumen</span>
        <span className="logo__sub">Móveis Planejados</span>
      </span>
    </span>
  );
}
