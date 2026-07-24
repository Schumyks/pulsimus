// TRACE-OVERLAY: render the SVG on top of the raster to trace with visual feedback,
// exactly like a reference layer in Illustrator. Two views:
//  - over: SVG at 50% opacity over the raster (see both, eyeball the mismatch)
//  - diff: SVG in 'difference' blend (matches go black, mismatches glow) -> pinpoints error
// Usage: bun overlay.mjs <raster.png> <asset.svg>
import sharp from 'sharp';
import { dirname, join } from 'node:path';
const [, , RAS, SVG] = process.argv;
const S = dirname(SVG); // write diagnostics next to the SVG so Alan can open them
const rm = await sharp(RAS).metadata(); const W = rm.width, H = rm.height;

const svgPng = await sharp(SVG).resize(W, H).png().toBuffer();
// 50% overlay
const rgba = await sharp(SVG).resize(W, H).ensureAlpha().raw().toBuffer();
for (let i = 3; i < rgba.length; i += 4) rgba[i] = Math.round(rgba[i] * 0.5);
const half = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
await sharp(RAS).removeAlpha().composite([{ input: half }]).png().toFile(join(S, '_trace_over.png'));
// difference
await sharp(RAS).removeAlpha().composite([{ input: svgPng, blend: 'difference' }]).png().toFile(join(S, '_trace_diff.png'));
console.log(`-> ${join(S, '_trace_over.png')}  ${join(S, '_trace_diff.png')}  (${W}x${H})`);
