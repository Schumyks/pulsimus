#!/usr/bin/env bun
// score.mjs — objective fidelity metric for the trace loop.
// Renders an SVG and compares it against the source raster, in-shape only
// (where the source alpha > 128). Lower = more faithful. Complements the
// visual diff of overlay.mjs: gives a single number to loop against a target.
//
// Usage:  bun score.mjs <source.png> <asset.svg> [bg=#12233a]
//   bg = flat color composited under both before comparing (only affects
//        pixels the SVG leaves transparent inside the shape; pick anything
//        far from the art so gaps are penalized).
import sharp from "sharp";

const [src, svg, bg = "#12233a"] = process.argv.slice(2);
if (!src || !svg) {
  console.error("usage: bun score.mjs <source.png> <asset.svg> [bg=#12233a]");
  process.exit(1);
}

const meta = await sharp(src).metadata();
const W = meta.width, H = meta.height;

// source with alpha, at native size
const ra = await sharp(src).ensureAlpha().raw().toBuffer();
// svg rasterized at >= native res (supersample via high density), then fit
const b = await sharp(svg, { density: 220 })
  .resize(W, H, { fit: "fill" })
  .flatten({ background: bg })
  .ensureAlpha()
  .raw()
  .toBuffer();

let sum = 0, n = 0;
for (let i = 0; i < ra.length; i += 4) {
  if (ra[i + 3] > 128) {
    for (let k = 0; k < 3; k++) { sum += Math.abs(ra[i + k] - b[i + k]); n++; }
  }
}
const score = sum / n;
console.log(`${score.toFixed(3)}  (mean |Δ|RGB in-shape, ${W}x${H}, n=${n})`);
