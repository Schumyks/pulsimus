const contactMethods = ["WhatsApp", "Mail", "Llamada"] as const;

const needs = [
  { id: "web", label: "Una web" },
  { id: "gestion", label: "Un sistema de gestión" },
  { id: "no-se", label: "No sé, ayudame a decidir" },
] as const;

const fieldClass =
  "w-full rounded-lg border border-hueso/25 bg-hueso/5 px-4 py-3 text-hueso placeholder:text-hueso/40 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar";

export default function CtaFooter() {
  return (
    <>
      <section
        id="contacto"
        aria-labelledby="cta-title"
        className="text-hueso"
      >
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="max-w-2xl" data-rv="">
            <h2
              id="cta-title"
              className="text-3xl font-semibold text-hueso sm:text-4xl md:text-5xl"
            >
              ¿Arrancamos?
            </h2>
            <p className="mt-4 text-lg text-hueso/80">
              Contame qué se te complica y lo ordenamos.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 text-sm text-hueso/70">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-ambar"
              />
              Te respondo en 48 horas con ideas concretas.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-16 lg:gap-20">
            <div
              className="flex flex-col justify-center gap-4 rounded-2xl border border-hueso/15 bg-hueso/5 p-10 md:p-12"
              data-rv=""
              data-rv-d="120"
            >
              <h3 className="text-2xl font-semibold text-hueso">
                Diagnóstico gratis, 20 minutos
              </h3>
              <p className="text-hueso/80">
                Por videollamada, desde el navegador. Te vas con ideas
                concretas para tu negocio, me contrates o no.
              </p>
              <a
                href="#contacto"
                className="mt-2 inline-flex items-center justify-center self-start rounded-full bg-ambar px-8 py-4 text-center font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
              >
                Agendá tu diagnóstico gratis
              </a>
            </div>

            <div
              className="flex flex-col gap-6"
              data-rv=""
              data-rv-d="240"
            >
              <p className="text-sm text-hueso/60">
                o contame tu caso y te escribo
              </p>

              <form className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cta-nombre" className="text-sm text-hueso/70">
                    Tu nombre
                  </label>
                  <input
                    id="cta-nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="cta-negocio" className="text-sm text-hueso/70">
                    Tu negocio
                  </label>
                  <input
                    id="cta-negocio"
                    name="negocio"
                    type="text"
                    placeholder="panadería, peluquería, carnicería…"
                    className={fieldClass}
                  />
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className="text-sm text-hueso/70">
                    ¿Qué necesitás?
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {needs.map((need) => {
                      const inputId = `cta-necesidad-${need.id}`;
                      return (
                        <div key={need.id}>
                          <input
                            type="checkbox"
                            name="necesidad"
                            id={inputId}
                            value={need.id}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={inputId}
                            className="inline-flex cursor-pointer items-center rounded-full border border-hueso/25 px-4 py-2 text-sm text-hueso/80 transition-colors peer-checked:border-ambar peer-checked:bg-ambar peer-checked:text-noche peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ambar"
                          >
                            {need.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                <div className="flex flex-col gap-2">
                  <label htmlFor="cta-dolor" className="text-sm text-hueso/70">
                    ¿Qué te duele?
                  </label>
                  <textarea
                    id="cta-dolor"
                    name="dolor"
                    rows={3}
                    placeholder="Contame en una o dos líneas qué se te complica hoy"
                    className={`${fieldClass} resize-none`}
                  />
                </div>

                <fieldset className="flex flex-col gap-3">
                  <legend className="text-sm text-hueso/70">
                    ¿Por dónde preferís que te responda?
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {contactMethods.map((method) => {
                      const inputId = `cta-metodo-${method.toLowerCase()}`;
                      return (
                        <div key={method}>
                          <input
                            type="radio"
                            name="metodo-contacto"
                            id={inputId}
                            value={method}
                            className="peer sr-only"
                          />
                          <label
                            htmlFor={inputId}
                            className="inline-flex cursor-pointer items-center rounded-full border border-hueso/25 px-4 py-2 text-sm text-hueso/80 transition-colors peer-checked:border-ambar peer-checked:bg-ambar peer-checked:text-noche peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ambar"
                          >
                            {method}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </fieldset>

                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full bg-ambar px-8 py-4 font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
                >
                  Enviar
                </button>

                <p className="text-sm text-hueso/50">
                  Sin spam. Te leo y escucho yo, Alan.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-hueso/15 text-hueso">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            {/* Landing target for the star journey layer (BL-17). */}
            <p
              id="footer-brand"
              className="font-semibold uppercase tracking-[0.22em] text-hueso"
            >
              PULSIMUS
            </p>
            <p className="mt-1 text-sm text-hueso/70">El pulso de tu negocio</p>
          </div>

          <div className="flex flex-col gap-1 text-sm md:items-end">
            <a
              href="mailto:hola@pulsimus.dk"
              className="text-hueso/80 underline-offset-4 hover:text-ambar hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
            >
              hola@pulsimus.dk
            </a>
            <p className="text-hueso/50">© 2026 Pulsimus</p>
          </div>
        </div>
      </footer>
    </>
  );
}
