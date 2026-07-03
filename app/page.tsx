import Hero from "./components/Hero";
import Dolores from "./components/Dolores";
import Proceso from "./components/Proceso";
import CtaFooter from "./components/CtaFooter";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-50 h-[72px] border-b border-noche/10 bg-hueso/85 backdrop-blur">
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <a
            href="#inicio"
            className="font-semibold uppercase tracking-[0.22em] text-noche focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ambar"
          >
            PULSIMUS
          </a>
          <a
            href="#contacto"
            className="rounded-full bg-ambar px-5 py-2 text-sm font-medium text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
          >
            Agendá tu diagnóstico
          </a>
        </nav>
      </header>

      <main>
        <Hero />
        <Dolores />
        {/* F4 · El mostrador (pieza firma) — hueco reservado, se integra después */}
        <Proceso />
        {/* F5 · Ejemplos (slot vivo, nace oculto) — hueco reservado */}
        <CtaFooter />
      </main>
    </>
  );
}
