// assemble.mjs — combina SVGs de piezas (mismo viewBox 2912x1881) en 1 SVG
// maestro, en el z-order dado por el orden de argumentos (primero = atrás).
// Junta los <defs> de todas y concatena el resto del contenido.
//
// usage: bun assemble.mjs <out.svg> <pieza1.svg> <pieza2.svg> ...
import { readFileSync, writeFileSync, existsSync } from "fs";

const [out, ...parts] = process.argv.slice(2);
let defs = "", body = "";
for (const p of parts) {
  if (!existsSync(p)) { console.log(`  (falta ${p} — omitida)`); continue; }
  let s = readFileSync(p, "utf8");
  // extraer defs
  const dm = s.match(/<defs>([\s\S]*?)<\/defs>/i);
  if (dm) { defs += dm[1] + "\n"; s = s.replace(dm[0], ""); }
  // contenido entre <svg ...> y </svg>
  const bm = s.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  body += `<!-- ${p.split("/").pop()} -->\n` + (bm ? bm[1] : s) + "\n";
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2912 1881" width="2912" height="1881">
<defs>${defs}</defs>
${body}</svg>`;
writeFileSync(out, svg);
console.log("ensamblado:", out, "·", parts.length, "piezas");
