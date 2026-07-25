// map-pieces: locate every content island in a composite by connected-components,
// so bboxes come from a SCRIPT, never eyeballed. Kills the "map by eye" step that put
// ~500px-shifted boxes in the tienda run. Outputs one bbox+centroid+area per piece.
//
// SCOPE: separates islands DISCONNECTED by background (the canonical input = a
// nano-banana DESARMADO sheet, one piece per island). Pieces that TOUCH/overlap in an
// assembled composite are NOT split by silhouette alone -> that needs color/gradient
// (BL-21) or SAM (BL-22), both parked. This tool is honest about that boundary.
//
// Usage: bun map-pieces.mjs <composite.png> [minArea=200] [alphaT=16] [--json]
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const args = process.argv.slice(2);
const jsonOnly = args.includes('--json');
const pos = args.filter(a => !a.startsWith('--'));
const SRC = pos[0];
const MIN_AREA = pos[1] ? +pos[1] : 200;
const T = pos[2] ? +pos[2] : 16;
if (!SRC) { console.error('usage: map-pieces.mjs <composite.png> [minArea=200] [alphaT=16] [--json]'); process.exit(1); }

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
const alpha = new Uint8Array(N);
for (let i = 0; i < N; i++) alpha[i] = data[i * 4 + 3];

// BFS flood-fill, 4-connectivity, each pixel enqueued at most once (marked on enqueue).
const label = new Int32Array(N);      // 0 = unlabeled
const queue = new Int32Array(N);      // reused ring-free FIFO; tail never exceeds N
let cur = 0;
const all = [];
for (let s = 0; s < N; s++) {
  if (alpha[s] <= T || label[s]) continue;
  cur++;
  let head = 0, tail = 0;
  queue[tail++] = s; label[s] = cur;
  let minx = W, miny = H, maxx = 0, maxy = 0, area = 0, sx = 0, sy = 0;
  while (head < tail) {
    const p = queue[head++]; const x = p % W, y = (p / W) | 0;
    area++; sx += x; sy += y;
    if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y;
    if (x > 0)     { const q = p - 1; if (alpha[q] > T && !label[q]) { label[q] = cur; queue[tail++] = q; } }
    if (x < W - 1) { const q = p + 1; if (alpha[q] > T && !label[q]) { label[q] = cur; queue[tail++] = q; } }
    if (y > 0)     { const q = p - W; if (alpha[q] > T && !label[q]) { label[q] = cur; queue[tail++] = q; } }
    if (y < H - 1) { const q = p + W; if (alpha[q] > T && !label[q]) { label[q] = cur; queue[tail++] = q; } }
  }
  all.push({ area, bbox: [minx, miny, maxx - minx + 1, maxy - miny + 1], centroid: [Math.round(sx / area), Math.round(sy / area)] });
}

const kept = all.filter(c => c.area >= MIN_AREA).sort((a, b) => a.bbox[1] - b.bbox[1] || a.bbox[0] - b.bbox[0]);
const dropped = all.length - kept.length;
const pieces = kept.map((c, i) => ({ id: `piece_${i}`, bbox: c.bbox, centroid: c.centroid, area: c.area }));
const out = { source: SRC, W, H, alphaT: T, minArea: MIN_AREA, count: pieces.length, droppedAsNoise: dropped, pieces };

if (jsonOnly) { console.log(JSON.stringify(out)); process.exit(0); }

const JPATH = SRC.replace(/\.[^.]+$/, '_pieces.json');
writeFileSync(JPATH, JSON.stringify(out, null, 2));

console.log(`map-pieces: ${W}x${H} | alphaT=${T} minArea=${MIN_AREA} | ${pieces.length} pieces (+${dropped} noise dropped)`);
console.log('  id        x     y     w     h     cx    cy    area');
for (const p of pieces) {
  const [x, y, w, h] = p.bbox;
  console.log(`  ${p.id.padEnd(8)} ${String(x).padStart(5)} ${String(y).padStart(5)} ${String(w).padStart(5)} ${String(h).padStart(5)} ${String(p.centroid[0]).padStart(5)} ${String(p.centroid[1]).padStart(5)} ${String(p.area).padStart(8)}`);
}
console.log(`-> ${JPATH}`);
