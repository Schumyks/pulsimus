type Dolor = {
  hoy: string;
  conPulsimus: string;
  sello: string;
};

const dolores: Dolor[] = [
  {
    hoy: "“Publico los productos de a uno y no tengo el catálogo completo en una sola pantalla.”",
    conPulsimus:
      "Todo tu catálogo en una página, siempre al día. El cliente ve todo junto y elige.",
    sello: "CATÁLOGO A LA VISTA",
  },
  {
    hoy: "“Me escribe mucha gente y no siempre son pedidos. Se me traspapelan los chats y pierdo ventas.”",
    conPulsimus:
      "El pedido entra por un solo lugar y te cae ordenado. Lo importante no se mezcla con la consulta.",
    sello: "PEDIDOS ORDENADOS",
  },
  {
    hoy: "“No llevo bien el stock. No sé qué me queda ni qué se vende más.”",
    conPulsimus:
      "Ves tu stock de un vistazo. Lo que se vende, se descuenta solo.",
    sello: "STOCK AL DÍA",
  },
];

// The ECG line stays as a dim rail; a brand star (pulse→star) travels it once
// per beat, synced to the section's sick heartbeat (~45 bpm). The line's two
// peaks read as the lub-dub. No scaling — content never moves.
function PulseDivider() {
  return (
    <div className="my-8 flex items-center" aria-hidden="true">
      <span className="h-px flex-1 bg-noche/10" />
      <svg
        width="40"
        height="24"
        viewBox="0 0 40 24"
        fill="none"
        className="shrink-0 overflow-visible text-bruma/45"
      >
        <path
          d="M0 12 H8 L14 4 L20 20 L26 8 L30 12 H40"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          className="px-pulse-star"
          d="M0 -3.4 C0.65 -1 1.04 -0.65 3.4 0 C1.04 0.65 0.65 1 0 3.4 C-0.65 1 -1.04 0.65 -3.4 0 C-1.04 -0.65 -0.65 -1 0 -3.4 Z"
          fill="#F2A63E"
        />
      </svg>
      <span className="h-px flex-1 bg-noche/10" />
    </div>
  );
}

export default function Dolores() {
  return (
    <section id="dolores" aria-labelledby="dolores-title" className="bg-hueso">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <h2
          id="dolores-title"
          data-rv=""
          className="max-w-3xl text-3xl font-semibold text-noche md:text-4xl"
        >
          Instagram es tu vidriera, no tu mostrador.
        </h2>

        <div className="mt-14 max-w-4xl" data-rv="" data-rv-d="100">
          <p className="text-2xl leading-snug font-medium text-noche/85 md:text-3xl">
            “Sin las redes hoy no existo. Todo pasa por ahí. Y gestionarlo
            entero es difícil y lleva mucho tiempo.”
          </p>
          <p className="mt-6 flex items-start gap-3 text-lg font-semibold text-noche md:text-xl">
            <span
              className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
              aria-hidden="true"
            />
            Instagram es tu vidriera. Te damos el mostrador: los dos lados.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {dolores.map((item, index) => (
            <article
              key={item.sello}
              data-rv=""
              data-rv-d={index * 120}
              className="px-card-lit flex flex-col rounded-2xl bg-noche/[0.03] p-8 md:p-10"
            >
              <div className="flex-1">
                <p className="text-xs font-medium tracking-[0.2em] text-bruma">
                  HOY
                </p>
                <p className="mt-3 text-lg leading-relaxed font-medium text-noche/80">
                  {item.hoy}
                </p>
              </div>

              <PulseDivider />

              <div className="flex-1">
                <p className="text-xs font-medium tracking-[0.2em] text-noche">
                  CON PULSIMUS
                </p>
                <p className="mt-3 text-lg leading-relaxed font-medium text-noche">
                  {item.conPulsimus}
                </p>
              </div>

              <p className="mt-8 flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-bruma">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
                  aria-hidden="true"
                />
                {item.sello}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
