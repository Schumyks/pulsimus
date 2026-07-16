const skins = [
  { id: "faro-ambar", label: "Faro Ámbar", active: true },
  { id: "skin-2", label: "Próximamente", active: false },
  { id: "skin-3", label: "Próximamente", active: false },
] as const;

export default function EstacionDiseno() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4" data-rv="" data-rv-d="0">
          <p className="text-xs font-medium tracking-[0.2em] text-bruma">
            SELECTOR DE MARCA
          </p>
          <div className="flex flex-col gap-3">
            {skins.map((skin) => (
              <div
                key={skin.id}
                aria-current={skin.active ? "true" : undefined}
                className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${
                  skin.active
                    ? "border-ambar bg-ambar/10"
                    : "border-hueso/15 bg-hueso/5 opacity-40"
                }`}
              >
                <span
                  className={
                    skin.active
                      ? "font-semibold text-hueso"
                      : "font-medium text-hueso/70"
                  }
                >
                  {skin.label}
                </span>
                {skin.active && (
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-ambar"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6" data-rv="" data-rv-d="120">
          <h3 className="text-3xl font-semibold text-hueso md:text-4xl">
            Que tu web se vea como tu negocio merece.
          </h3>
          <p className="text-lg leading-relaxed text-hueso/80">
            Tu marca es cómo te ven. La diseño desde cero: colores,
            tipografía, logo y el manual de uso para que siempre se vea igual
            de bien.
          </p>
          <p className="text-lg leading-relaxed text-hueso/80">
            Faro Ámbar, la marca que estás viendo ahora, también la diseñé
            yo.
          </p>
        </div>
      </div>
    </div>
  );
}
