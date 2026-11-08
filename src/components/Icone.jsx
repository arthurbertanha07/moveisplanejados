// Conjunto enxuto de ícones de traço fino, desenhados para a interface.
const TRACOS = {
  seta: <path d="M4 12h15m-6-6 6 6-6 6" />,
  'seta-esq': <path d="M20 12H5m6-6-6 6 6 6" />,
  'seta-diagonal': <path d="M7 17 17 7M9 7h8v8" />,
  fechar: <path d="m6 6 12 12M18 6 6 18" />,
  'girar-esq': (
    <>
      <path d="M4.5 9.5A8 8 0 1 1 4 13" />
      <path d="M4 4.5v5h5" />
    </>
  ),
  'girar-dir': (
    <>
      <path d="M19.5 9.5A8 8 0 1 0 20 13" />
      <path d="M20 4.5v5h-5" />
    </>
  ),
  mais: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  centro: (
    <>
      <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  play: <path d="M8 5.5v13l10-6.5z" />,
  pausa: <path d="M8.5 5.5v13M15.5 5.5v13" />,
  porta: (
    <>
      <path d="M5 20V4h9v16" />
      <path d="M14 4.8 19 6.5v12l-5 1.5" />
      <path d="M11 11.5v1.5" />
    </>
  ),
  telefone: (
    <path d="M6.6 3.5h2.6l1.6 4.2-2 1.3a10.5 10.5 0 0 0 5.2 5.2l1.3-2 4.2 1.6v2.6a2 2 0 0 1-2.1 2A15.5 15.5 0 0 1 4.6 5.6a2 2 0 0 1 2-2.1Z" />
  ),
  email: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </>
  ),
  local: (
    <>
      <path d="M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 1 1 13 0c0 4.9-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  relogio: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  ampliar: <path d="M14 4h6v6M10 20H4v-6M20 4l-6.5 6.5M4 20l6.5-6.5" />,
  mao: (
    <>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V10" />
      <path d="M12 9.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-.6a6 6 0 0 1-4.7-2.3L4 15.2a1.6 1.6 0 0 1 2.4-2.1L9 15" />
    </>
  ),
};

export function Icone({ nome, className, titulo, ...resto }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={['icone', `icone-${nome}`, className].filter(Boolean).join(' ')}
      aria-hidden={titulo ? undefined : 'true'}
      role={titulo ? 'img' : undefined}
      focusable="false"
      {...resto}
    >
      {titulo && <title>{titulo}</title>}
      {TRACOS[nome]}
    </svg>
  );
}

/** Logotipo do WhatsApp (marca preenchida). */
export function IconeWhatsApp({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M12.04 2.5a9.43 9.43 0 0 0-8.08 14.3L2.6 21.5l4.83-1.33A9.43 9.43 0 1 0 12.04 2.5Zm0 17.2a7.8 7.8 0 0 1-3.97-1.09l-.28-.17-2.87.79.8-2.8-.19-.29a7.78 7.78 0 1 1 6.51 3.56Zm4.27-5.83c-.23-.12-1.38-.68-1.6-.76-.21-.08-.37-.12-.53.12-.15.23-.6.76-.74.92-.14.15-.27.17-.5.06a6.38 6.38 0 0 1-1.88-1.16 7.07 7.07 0 0 1-1.3-1.62c-.14-.23 0-.36.1-.47.1-.1.23-.27.35-.41.11-.14.15-.23.23-.39.08-.15.04-.29-.02-.41-.06-.12-.53-1.27-.72-1.74-.19-.46-.38-.39-.53-.4h-.45a.86.86 0 0 0-.62.29 2.62 2.62 0 0 0-.82 1.95 4.55 4.55 0 0 0 .95 2.42 10.4 10.4 0 0 0 3.99 3.52c.56.24 1 .38 1.33.49.56.18 1.07.15 1.47.09.45-.07 1.38-.56 1.58-1.11.19-.55.19-1.02.14-1.12-.06-.1-.21-.16-.44-.27Z" />
    </svg>
  );
}
