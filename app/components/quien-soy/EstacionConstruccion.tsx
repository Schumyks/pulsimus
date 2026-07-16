const fichas = [
  { id: "whatsapp", label: "Tomo pedidos por WhatsApp", active: true },
  { id: "turnos", label: "Doy turnos", active: false },
  { id: "instagram", label: "Vendo por Instagram", active: false },
] as const;

export default function EstacionConstruccion() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6" data-rv="" data-rv-d="0">
          <h3 className="text-3xl font-semibold text-hueso md:text-4xl">
            Te escucho y te lo construyo a medida.
          </h3>
          <p className="text-lg leading-relaxed text-hueso/80">
            Cada negocio necesita algo distinto. Vos me contás cómo trabajás
            y qué se te complica. Yo te armo la herramienta para eso. Ni más
            ni menos: lo que tu negocio necesita.
          </p>
          <div className="flex flex-col gap-3">
            {fichas.map((ficha) => (
              <div
                key={ficha.id}
                aria-current={ficha.active ? "true" : undefined}
                className={`w-fit rounded-full border px-5 py-2.5 text-sm font-medium ${
                  ficha.active
                    ? "border-ambar bg-ambar text-noche"
                    : "border-hueso/20 text-hueso/60"
                }`}
              >
                {ficha.label}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl border border-hueso/15 bg-hueso/5 p-6"
          data-rv=""
          data-rv-d="150"
        >
          <p className="mb-4 text-xs font-medium tracking-[0.2em] text-bruma">
            TU TIENDA
          </p>
          <div className="flex flex-col gap-4 rounded-xl bg-noche/40 p-4">
            <div className="flex items-center justify-between rounded-lg bg-hueso/10 px-4 py-3">
              <span
                aria-hidden="true"
                className="h-2.5 w-16 rounded-full bg-hueso/40"
              />
              <span
                aria-hidden="true"
                className="h-2.5 w-2.5 rounded-full bg-ambar"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex flex-col gap-2 rounded-lg bg-hueso/10 p-3"
                >
                  <span
                    aria-hidden="true"
                    className="block aspect-square w-full rounded-md bg-hueso/15"
                  />
                  <span
                    aria-hidden="true"
                    className="h-2 w-3/4 rounded-full bg-hueso/30"
                  />
                </div>
              ))}
            </div>
            <span
              aria-hidden="true"
              className="h-9 w-full rounded-full bg-ambar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
