// reduce-palette.mjs — colapsa la paleta explotada de vtracer a las familias
// reales del PNG. k-means sobre píxeles in-shape (ponderado por área natural),
// remapea cada fill del SVG al centroide más cercano. Arregla colores-artefacto
// + habilita que svgo fusione paths del mismo color.
//
// usage: bun reduce-palette.mjs <source.png> <svg-in> <svg-out> [K=24]
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";

const [PNG, SVGIN, SVGOUT, Ks] = process.argv.slice(2);
const K = parseInt(Ks || "24", 10);

// 1) muestrear píxeles reales in-shape
const { data, info } = await sharp(PNG).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const N = info.width * info.height;
const px = [];
for (let i = 0; i < N; i++) if (data[i * 4 + 3] > 128) px.push([data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
const step = Math.max(1, Math.floor(px.length / 40000));
const S = [];
for (let i = 0; i < px.length; i += step) S.push(px[i]);

// 2) k-means (init espaciado por luminancia, 14 iters)
S.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
let cents = [];
for (let k = 0; k < K; k++) cents.push(S[Math.floor((k + 0.5) / K * S.length)].slice());
for (let it = 0; it < 14; it++) {
  const acc = Array.from({ length: K }, () => [0, 0, 0, 0]);
  for (const p of S) {
    let bi = 0, bd = 1e12;
    for (let k = 0; k < K; k++) { const c = cents[k]; const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2; if (d < bd) { bd = d; bi = k; } }
    const a = acc[bi]; a[0] += p[0]; a[1] += p[1]; a[2] += p[2]; a[3]++;
  }
  for (let k = 0; k < K; k++) if (acc[k][3]) cents[k] = [acc[k][0] / acc[k][3], acc[k][1] / acc[k][3], acc[k][2] / acc[k][3]];
}
const pal = cents.map(c => c.map(Math.round));

// 3) remapear fills del SVG
const toRgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const toHex = c => "#" + c.map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
const near = rgb => { let bi = 0, bd = 1e12; for (let k = 0; k < pal.length; k++) { const c = pal[k]; const d = (rgb[0] - c[0]) ** 2 + (rgb[1] - c[1]) ** 2 + (rgb[2] - c[2]) ** 2; if (d < bd) { bd = d; bi = k; } } return toHex(pal[bi]); };
let svg = readFileSync(SVGIN, "utf8");
const cache = {};
svg = svg.replace(/fill="(#[0-9a-fA-F]{6})"/g, (_, hex) => { hex = hex.toLowerCase(); if (!(hex in cache)) cache[hex] = near(toRgb(hex)); return `fill="${cache[hex]}"`; });
writeFileSync(SVGOUT, svg);

const used = new Set(Object.values(cache));
console.log(`K=${K}: ${Object.keys(cache).length} fills → ${used.size} familias usadas`);
console.log("paleta:", [...used].join(" "));
