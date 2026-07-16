export default function EstacionCalidad() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6" data-rv="" data-rv-d="0">
          <h3 className="text-3xl font-semibold text-hueso md:text-4xl">
            La calidad es la experiencia.
          </h3>
          <p className="text-lg leading-relaxed text-hueso/80">
            Una web puede estar completa y aun así sentirse muerta. La
            diferencia está en los detalles: que todo responda, que nada se
            trabe, que dé gusto usarla.
          </p>
          <p className="text-lg leading-relaxed text-hueso/80">
            Yo trabajo así: si hay que hacerlo, hay que hacerlo bien. Si no,
            no vale la pena hacerlo.
          </p>
        </div>

        <div className="flex flex-col gap-4" data-rv="" data-rv-d="150">
          <div className="inline-flex w-fit items-center gap-1 rounded-full border border-hueso/15 bg-hueso/5 p-1">
            <span className="rounded-full px-4 py-1.5 text-sm font-medium text-hueso/50">
              Sin alma
            </span>
            <span
              aria-current="true"
              className="rounded-full bg-ambar px-4 py-1.5 text-sm font-medium text-noche"
            >
              Con alma
            </span>
          </div>

          <div className="rounded-2xl border border-ambar/30 bg-hueso/5 p-6">
            <div className="flex items-center justify-between">
              <span
                aria-hidden="true"
                className="h-2.5 w-24 rounded-full bg-hueso/40"
              />
              <span className="rounded-full bg-ambar/20 px-3 py-1 text-xs font-medium text-ambar">
                Nuevo
              </span>
            </div>
            <div className="mt-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="h-2 w-32 rounded-full bg-hueso/25"
                />
                <span
                  aria-hidden="true"
                  className="h-2 w-10 rounded-full bg-hueso/25"
                />
              </div>
              <div className="flex items-center justify-between">
                <span
                  aria-hidden="true"
                  className="h-2 w-24 rounded-full bg-hueso/25"
                />
                <span
                  aria-hidden="true"
                  className="h-2 w-10 rounded-full bg-hueso/25"
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-hueso/10 pt-4">
              <span
                aria-hidden="true"
                className="h-2.5 w-16 rounded-full bg-hueso/40"
              />
              <span
                aria-hidden="true"
                className="h-9 w-28 rounded-full bg-ambar"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
