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
      "Nos sentamos 20 minutos por videollamada —desde el navegador, sin instalar nada— y te muestro dónde se te está escapando la plata. Sin compromiso.",
    href: "#contacto",
  },
  {
    rotulo: "02",
    titulo: "Propuesta",
    descripcion:
      "Te llevo un plan concreto: qué se hace, qué gana tu negocio y cuánto sale. En idioma de mostrador, no técnico.",
  },
  {
    rotulo: "03",
    titulo: "Construcción",
    descripcion:
      "Diseñamos y construimos tu web de cero, cuidando cada detalle. Vos ves los avances; sale cuando está para salir.",
  },
];

export default function Proceso() {
  return (
    <section id="proceso" aria-labelledby="proceso-title">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="max-w-2xl">
          <h2
            id="proceso-title"
            className="text-3xl font-semibold text-noche md:text-4xl"
          >
            Cómo trabajamos
          </h2>
          <p className="mt-4 font-normal text-bruma">
            Sin vueltas y en tu idioma. Del primer café a tu web andando.
          </p>
        </div>

        <ol className="mt-16 grid grid-cols-1 gap-y-12 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-0">
          {pasos.map((paso, index) => {
            const esUltimo = index === pasos.length - 1;

            return (
              <li key={paso.rotulo} className="relative">
                {paso.href ? (
                  <a
                    href={paso.href}
                    className="flex h-12 w-fit items-center gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
                  >
                    <span
                      aria-hidden
                      className="text-4xl font-semibold text-noche/30 md:text-5xl"
                    >
                      {paso.rotulo}
                    </span>
                    <h3 className="text-xl font-semibold text-noche underline-offset-4 hover:underline">
                      {paso.titulo}
                    </h3>
                  </a>
                ) : (
                  <div className="flex h-12 items-center gap-4">
                    <span
                      aria-hidden
                      className="text-4xl font-semibold text-noche/30 md:text-5xl"
                    >
                      {paso.rotulo}
                    </span>
                    <h3 className="text-xl font-semibold text-noche">
                      {paso.titulo}
                    </h3>
                  </div>
                )}

                {!esUltimo && (
                  <span
                    aria-hidden
                    className="absolute top-6 left-full hidden h-px w-10 bg-noche/15 lg:block"
                  />
                )}

                <p className="mt-4 font-normal leading-relaxed text-noche/80">
                  {paso.descripcion}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
