import EstacionIntro from "./EstacionIntro";
import EstacionDiseno from "./EstacionDiseno";
import EstacionConstruccion from "./EstacionConstruccion";
import EstacionCalidad from "./EstacionCalidad";
import EstacionRemate from "./EstacionRemate";

export default function QuienSoy() {
  return (
    <section id="quien-soy" aria-labelledby="quien-soy-title" className="bg-noche text-hueso">
      <h2 id="quien-soy-title" className="sr-only">
        Quién está del otro lado
      </h2>
      <EstacionIntro />
      <EstacionDiseno />
      <EstacionConstruccion />
      <EstacionCalidad />
      <EstacionRemate />
    </section>
  );
}
