const dolores = [
  {
    quote:
      "“Me llegan pedidos por WhatsApp a toda hora y, entre mensaje y mensaje, siempre se me escapa alguno.”",
    label: "PEDIDOS ORDENADOS",
  },
  {
    quote:
      "“Los turnos los anoto en un cuaderno y la seña me la mandan por Revolut cuando se acuerdan.”",
    label: "AGENDA CON SEÑA",
  },
  {
    quote:
      "“Cargo los mismos datos dos veces: una en el chat y otra cuando lo paso a mi lista.”",
    label: "CERO DOBLE CARGA",
  },
  {
    quote:
      "“Tengo el Instagram lindo, pero para comprar el cliente tiene que preguntarme todo por privado.”",
    label: "DEL POSTEO AL PEDIDO",
  },
];

export default function Dolores() {
  return (
    <section id="dolores" aria-labelledby="dolores-title" className="bg-hueso">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <h2
            id="dolores-title"
            className="text-3xl font-semibold text-noche md:text-4xl"
          >
            Lo que hoy hacés a mano
          </h2>
          <p className="mt-4 text-base font-normal text-bruma md:text-lg">
            Tu negocio funciona. Lo que se rompe es el paso del “me interesa”
            al “listo, es tuyo” — y hoy lo cargás vos, mensaje por mensaje.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {dolores.map((item) => (
            <article
              key={item.label}
              className="flex flex-col justify-between gap-8 rounded-2xl bg-noche/[0.03] p-8 md:p-10"
            >
              <p className="text-lg leading-relaxed font-medium text-noche md:text-xl">
                {item.quote}
              </p>
              <p className="flex items-center gap-2 text-xs font-medium tracking-[0.2em] text-bruma md:text-sm">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-ambar"
                  aria-hidden="true"
                />
                {item.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
