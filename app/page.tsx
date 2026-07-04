import Hero from "./components/Hero";
import Dolores from "./components/Dolores";
import Mostrador from "./components/Mostrador";
import Proceso from "./components/Proceso";
import CtaFooter from "./components/CtaFooter";
import Intro from "./components/Intro";
import Reveals from "./components/motion/Reveals";

export default function Home() {
  return (
    <>
      <Intro />
      <Reveals />
      <header className="sticky top-0 z-50 h-[72px] border-b border-noche/10 bg-hueso/85 backdrop-blur">
        <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <a
            href="#inicio"
            className="flex items-center gap-3 font-semibold uppercase tracking-[0.22em] text-noche focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ambar"
          >
            {/* Landing target for the intro's FLIP travel; the Intro toggles its opacity. */}
            <svg
              id="hdr-sym"
              viewBox="0 0 128 56"
              className="h-[22px] w-[50px] shrink-0"
              fill="none"
              aria-hidden="true"
              style={{ transition: "opacity 0.3s ease" }}
            >
              <path
                d="M6 37 H24 L31 30 L38 37 L48 15 L58 45 L66 37 H82 L97 16"
                stroke="#1B2140"
                strokeWidth={5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g transform="translate(103, 11)">
                <path
                  d="M0 -9 C1.7 -2.7 2.7 -1.7 9 0 C2.7 1.7 1.7 2.7 0 9 C-1.7 2.7 -2.7 1.7 -9 0 C-2.7 -1.7 -1.7 -2.7 0 -9 Z"
                  fill="#F2A63E"
                />
              </g>
            </svg>
            PULSIMUS
          </a>
          <a
            href="#contacto"
            className="rounded-full bg-ambar px-4 py-1.5 text-xs font-medium whitespace-nowrap text-noche transition-colors hover:bg-ambar/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar sm:px-5 sm:py-2 sm:text-sm"
          >
            Agendá tu diagnóstico
          </a>
        </nav>
      </header>

      <main>
        <Hero />
        <Dolores />
        <Mostrador />
        <Proceso />
        {/* F5 · Ejemplos (slot vivo, nace oculto) — hueco reservado */}
        <CtaFooter />
      </main>
    </>
  );
}
