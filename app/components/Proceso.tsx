type Paso = {
  rotulo: string;
  titulo: string;
  descripcion: string;
  href?: string;
};

const pasos: Paso[] = [
  {
    rotulo: "01",
    titulo: "Diagnóstico gratis",
    descripcion:
      "Nos juntamos 20 minutos por videollamada. Desde el navegador, sin instalar nada. Ya sabés por dónde se te escapa la plata; yo te muestro cómo cerrar la canilla. Sin compromiso.",
    href: "#contacto",
  },
  {
    rotulo: "02",
    titulo: "Propuesta",
    descripcion:
      "Te armamos un plan concreto: qué se hace, qué ganás y cuánto sale. Fácil, bien estructurado y bajado a tierra.",
  },
  {
    rotulo: "03",
    titulo: "Construcción",
    descripcion:
      "Te construimos la web desde cero, cuidando cada detalle. Vos ves los avances. Sale cuando tenga que salir.",
  },
];

export default function Proceso() {
  return (
    <section id="proceso" aria-labelledby="proceso-title">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl" data-rv="">
          <h2
            id="proceso-title"
            className="text-3xl font-semibold text-hueso md:text-4xl"
          >
            Cómo trabajamos
          </h2>
          <p className="mt-4 font-normal text-hueso/70">
            Sin vueltas y en tu idioma.
          </p>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          {pasos.map((paso, index) => {
            const esUltimo = index === pasos.length - 1;

            return (
              <li
                key={paso.rotulo}
                className="relative"
                data-rv=""
                data-rv-d={index * 120}
              >
                {paso.href ? (
                  <a
                    href={paso.href}
                    className="flex h-12 w-fit items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
                  >
                    <span
                      aria-hidden
                      className="text-4xl font-semibold text-hueso/30 md:text-5xl"
                    >
                      {paso.rotulo}
                    </span>
                    <h3 className="text-xl font-semibold text-hueso underline-offset-4 hover:underline">
                      {paso.titulo}
                    </h3>
                  </a>
                ) : (
                  <div className="flex h-12 items-center gap-4">
                    <span
                      aria-hidden
                      className="text-4xl font-semibold text-hueso/30 md:text-5xl"
                    >
                      {paso.rotulo}
                    </span>
                    <h3 className="text-xl font-semibold text-hueso">
                      {paso.titulo}
                    </h3>
                  </div>
                )}

                {!esUltimo && (
                  <span
                    aria-hidden
                    className="absolute top-6 left-full hidden h-px w-10 bg-hueso/15 lg:block"
                  />
                )}

                <p className="mt-4 font-normal leading-relaxed text-hueso/80">
                  {paso.descripcion}
                </p>
              </li>
            );
          })}
        </ol>

        <p
          className="mt-14 max-w-2xl text-lg text-hueso/80"
          data-rv=""
          data-rv-d="100"
        >
          <span className="font-semibold text-hueso">
            ¿Pensás que una web es cara?
          </span>{" "}
          El diagnóstico es gratis y te digo exactamente cuánto sale. Sin
          sorpresas.
        </p>

        <p
          className="mt-16 max-w-3xl text-2xl leading-snug font-semibold text-hueso md:text-3xl"
          data-rv=""
          data-rv-d="150"
        >
          Un corazón sano{" "}
          <span className="underline decoration-ambar decoration-[3px] underline-offset-[6px]">
            late fuerte
          </span>
          . Que el de tu negocio no pierda ni un latido: ni un pedido, ni un
          turno, ni un cliente.
        </p>
      </div>
    </section>
  );
}
