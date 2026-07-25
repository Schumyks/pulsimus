// crop-check: the paso-2 crop GATE as a script. Catches the buzon-sin-base bug (a crop
// that ate part of the piece) and missing/uncovered regions. Two checks:
//   (a) perimeter ring  -> per piece, the 4 border rows/cols must be alpha~0. Content on a
//       border means the crop touched (likely cut) the piece. A complete crop leaves a
//       transparent margin. Report which borders are touched.
//   (b) residue map     -> composite content MINUS union of placed pieces ~= 0. Leftover
//       content = incomplete crop or a missing piece; report its area + bbox (the "where").
//
// Usage:
//   crop-check.mjs --ring <piece.png> [piece2.png ...]     # ring check only (no positions needed)
//   crop-check.mjs <composite.png> <manifest.json>         # ring (all pieces) + residue map
//   manifest.json = { "pieces": [ {"file": "...", "left": X, "top": Y }, ... ] }  file rel to manifest dir or absolute
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { dirname, resolve, basename } from 'node:path';

const T = 16;                 // alpha>T = content
const EDGE_MIN = 3;           // >= this many content px on a border => "touched" (ignores AA specks)
const RESIDUE_EPS = 0.005;    // residue < 0.5% of composite content => OK

async function alphaOf(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const a = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) a[i] = data[i * 4 + 3];
  return { a, W, H };
}

function ringCheck(a, W, H) {
  let top = 0, bottom = 0, left = 0, right = 0;
  for (let x = 0; x < W; x++) { if (a[x] > T) top++; if (a[(H - 1) * W + x] > T) bottom++; }
  for (let y = 0; y < H; y++) { if (a[y * W] > T) left++; if (a[y * W + W - 1] > T) right++; }
  const touched = [];
  if (top >= EDGE_MIN) touched.push(`top(${top})`);
  if (bottom >= EDGE_MIN) touched.push(`bottom(${bottom})`);
  if (left >= EDGE_MIN) touched.push(`left(${left})`);
  if (right >= EDGE_MIN) touched.push(`right(${right})`);
  return touched;
}

const args = process.argv.slice(2);
if (args[0] === '--ring') {
  let anyTouched = false;
  console.log('ring check (transparent perimeter = complete crop):');
  for (const f of args.slice(1)) {
    const { a, W, H } = await alphaOf(f);
    const touched = ringCheck(a, W, H);
    if (touched.length) anyTouched = true;
    console.log(`  ${basename(f).padEnd(28)} ${touched.length ? 'TOUCHES EDGE -> ' + touched.join(' ') : 'complete ✓'}`);
  }
  process.exit(anyTouched ? 1 : 0);
}

// full mode: composite + manifest
const COMP = args[0], MANI = args[1];
if (!COMP || !MANI) { console.error('usage: crop-check.mjs --ring <p.png>... | crop-check.mjs <composite.png> <manifest.json>'); process.exit(2); }
const mani = JSON.parse(readFileSync(MANI, 'utf8'));
const mdir = dirname(resolve(MANI));
const comp = await alphaOf(COMP);
const union = new Uint8Array(comp.W * comp.H);

console.log('(a) ring check per piece (WARNING-level: a margin lets us verify completeness):');
let touchedCount = 0;
for (const p of mani.pieces) {
  const f = resolve(p.file.startsWith('/') ? p.file : mdir + '/' + p.file);
  const { a, W, H } = await alphaOf(f);
  const touched = ringCheck(a, W, H);
  if (touched.length) touchedCount++;
  console.log(`  ${basename(f).padEnd(28)} @${p.left},${p.top}  ${touched.length ? 'TOUCHES EDGE -> ' + touched.join(' ') : 'complete ✓'}`);
  for (let y = 0; y < H; y++) { const cy = p.top + y; if (cy < 0 || cy >= comp.H) continue; for (let x = 0; x < W; x++) { if (a[y * W + x] > T) { const cx = p.left + x; if (cx >= 0 && cx < comp.W) union[cy * comp.W + cx] = 1; } } }
}

// (b) residue = composite content not covered by union
let compContent = 0, residue = 0, rminx = comp.W, rminy = comp.H, rmaxx = 0, rmaxy = 0;
for (let y = 0; y < comp.H; y++) for (let x = 0; x < comp.W; x++) {
  if (comp.a[y * comp.W + x] > T) { compContent++; if (!union[y * comp.W + x]) { residue++; if (x < rminx) rminx = x; if (x > rmaxx) rmaxx = x; if (y < rminy) rminy = y; if (y > rmaxy) rmaxy = y; } }
}
const frac = residue / (compContent || 1);
console.log('\n(b) residue map (composite content not covered by any piece):');
console.log(`  composite content px: ${compContent}`);
console.log(`  uncovered (residue):  ${residue} (${(frac * 100).toFixed(2)}%)` + (residue ? `  bbox[x,y,w,h]=[${rminx},${rminy},${rmaxx - rminx + 1},${rmaxy - rminy + 1}]` : ''));
// Coverage (residue) is the HARD gate. Ring-touch is a WARNING: an exact crop and a piece
// that ate a part look identical at the border, so a margin is what makes it verifiable.
const coverageOk = frac < RESIDUE_EPS;
console.log(`\nRESULT: ${coverageOk ? 'PASS ✓ composite fully covered by the pieces' : `FLAG ✗ ${(frac * 100).toFixed(2)}% of the composite is uncovered (missing/cut piece) bbox[x,y,w,h]=[${rminx},${rminy},${rmaxx - rminx + 1},${rmaxy - rminy + 1}]`}`);
if (touchedCount) console.log(`WARNING: ${touchedCount} piece(s) touch their crop edge — recrop with a transparent margin so completeness is ring-verifiable (a cut piece and an exact crop look the same at the border).`);
process.exit(coverageOk ? 0 : 1);
