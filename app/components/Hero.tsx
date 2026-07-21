const ctaBase =
  "inline-flex w-full items-center justify-center rounded-full px-8 py-4 text-base font-medium motion-safe:transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar sm:w-auto";

export default function Hero() {
  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="scroll-mt-[72px]"
    >
      <div
        className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:py-40"
        data-rv="hero"
      >
        <p className="text-xs font-medium tracking-[0.2em] text-hueso/60 uppercase sm:text-sm">
          Agencia web para negocios de barrio
        </p>

        <h1
          id="hero-title"
          className="mt-6 max-w-3xl text-4xl leading-[1.15] font-semibold text-hueso sm:text-5xl md:text-6xl"
        >
          <span className="block">Tu negocio ya tiene su ritmo.</span>
          <span className="block">
            Nosotros hacemos que lo digital le siga el{" "}
            <span className="text-ambar underline decoration-[3px] underline-offset-[6px]">
              pulso
            </span>
            .
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-lg font-normal text-hueso/70">
          Webs donde tus clientes piden fácil y vos ves todo ordenado.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#contacto"
            className={`${ctaBase} bg-ambar text-noche hover:bg-ambar/90`}
          >
            Agendá tu diagnóstico gratis
          </a>
          <a
            href="#contacto"
            className={`${ctaBase} border border-hueso/20 text-hueso hover:border-hueso/40`}
          >
            Contame tu caso
          </a>
        </div>
      </div>
    </section>
  );
}
