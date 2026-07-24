// Robust read: AVERAGE a strip of rows/cols (kills paper texture), then segment.
// Reports bands (flat vs graded) + the two bevel oranges + frame layer edges.
import sharp from 'sharp';
const [, , INPUT] = process.argv;
const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info; const C = 4;
const at = (x, y) => { const i = (y * W + x) * C; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
const hex = (r, g, b) => '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
const D = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);

// average color across a horizontal span [x0,x1] at row y (opaque only)
const avgRow = (y, x0, x1) => { let r = 0, g = 0, b = 0, n = 0; for (let x = x0; x <= x1; x++) { const p = at(x, y); if (p[3] > 128) { r += p[0]; g += p[1]; b += p[2]; n++; } } return n ? [r / n, g / n, b / n] : null; };
const avgCol = (x, y0, y1) => { let r = 0, g = 0, b = 0, n = 0; for (let y = y0; y <= y1; y++) { const p = at(x, y); if (p[3] > 128) { r += p[0]; g += p[1]; b += p[2]; n++; } } return n ? [r / n, g / n, b / n] : null; };

// segment a profile (array of {pos,color}) by color jumps; report flatness (max dev within band)
function segment(prof) {
  const segs = []; let s = 0, acc = [0, 0, 0], n = 0, ref = null, maxdev = 0;
  const flush = (e) => { if (n >= 8) { const col = [acc[0] / n, acc[1] / n, acc[2] / n]; segs.push({ a: prof[s].pos, b: prof[e - 1].pos, color: hex(...col), dev: Math.round(maxdev) }); } };
  for (let i = 0; i < prof.length; i++) {
    const c = prof[i].color; if (!c) { flush(i); s = i + 1; acc = [0, 0, 0]; n = 0; ref = null; maxdev = 0; continue; }
    if (ref && D(c, ref) > 34) { flush(i); s = i; acc = [0, 0, 0]; n = 0; maxdev = 0; }
    acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; n++; ref = [acc[0] / n, acc[1] / n, acc[2] / n];
    const dv = D(c, ref); if (dv > maxdev) maxdev = dv;
  }
  flush(prof.length); return segs;
}
const pct = (v, t) => (100 * v / t).toFixed(0);

console.log(`dims ${W}x${H}`);
// 1) SCREEN BANDS: average a clean vertical strip left of the left eye (x 250..380)
console.log('\nBANDS (V, avg x[250..380], dev=flatness; low dev = flat color):');
{ const prof = []; for (let y = 0; y < H; y++) prof.push({ pos: y, color: avgRow(y, 250, 380) });
  for (const s of segment(prof)) console.log(`  y[${s.a}..${s.b}] (${pct(s.a, H)}-${pct(s.b, H)}%) ${s.color} dev=${s.dev}`); }

// 2) LEFT BEVEL oranges: vertical strip inside the warm bevel (x 130..185)
console.log('\nLEFT BEVEL (V, avg x[130..185]):');
{ const prof = []; for (let y = 0; y < H; y++) prof.push({ pos: y, color: avgCol2(y) });
  function avgCol2(y){ return avgRow(y,130,185); }
  for (const s of segment(prof)) console.log(`  y[${s.a}..${s.b}] (${pct(s.a, H)}-${pct(s.b, H)}%) ${s.color} dev=${s.dev}`); }

// 3) FRAME LAYERS: average horizontal strip mid-height (y 500..1000), per column
console.log('\nFRAME LAYERS (H, avg y[500..1000] left half):');
{ const prof = []; for (let x = 0; x < W; x++) prof.push({ pos: x, color: avgCol(x, 500, 1000) });
  for (const s of segment(prof)) if (s.a < W * 0.35 || s.b > W * 0.65) console.log(`  x[${s.a}..${s.b}] (${pct(s.a, W)}-${pct(s.b, W)}%) ${s.color} dev=${s.dev}`); }
