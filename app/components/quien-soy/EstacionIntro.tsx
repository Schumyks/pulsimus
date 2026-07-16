export default function EstacionIntro() {
  return (
    <div className="flex min-h-screen min-h-dvh items-center">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-24 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4" data-rv="" data-rv-d="0">
          <div
            aria-hidden="true"
            className="aspect-[4/5] w-full rounded-2xl border border-ambar/40 bg-bruma/20"
          >
            {/* TODO(P1 gate): replace with Alan's real photo via next/image */}
          </div>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-hueso/25 px-4 py-2 text-sm text-hueso/80 transition-colors hover:border-ambar hover:text-ambar focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ambar"
          >
            {/* TODO: Alan's profile URL */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              width={18}
              height={18}
              fill="none"
              className="shrink-0"
            >
              <rect
                x="1"
                y="1"
                width="22"
                height="22"
                rx="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="7.4" cy="7.8" r="1.5" fill="currentColor" />
              <rect x="6.1" y="10.8" width="2.6" height="9" fill="currentColor" />
              <path
                d="M11.5 19.8v-9h2.5v1.3c.6-.9 1.6-1.6 3-1.6 2.4 0 3.8 1.6 3.8 4.5v4.8h-2.6v-4.4c0-1.4-.5-2.4-1.8-2.4-1 0-1.6.7-1.9 1.4-.1.3-.1.6-.1 1v4.4h-2.9Z"
                fill="currentColor"
              />
            </svg>
            LinkedIn
          </a>
        </div>

        <div className="flex flex-col gap-6" data-rv="" data-rv-d="120">
          <p className="text-xl leading-relaxed text-hueso/85 md:text-2xl">
            Soy Alan. Hace diez años que trabajo en calidad y diseño web. En
            todos mis trabajos terminé metido en el diseño: la web, la
            interfaz, la experiencia del que la usa.
          </p>
          <p className="text-xl leading-relaxed font-semibold text-hueso md:text-2xl">
            Pulsimus es todo eso junto, trabajando para tu negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
