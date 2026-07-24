// Clean a single green-screen asset: measure real green -> soft-alpha chroma key
// (greenness = G - max(R,B)) -> despill -> erode + feather -> crop to content bbox.
// Usage: bun clean-asset.mjs <input> <output> [erode] [feather]
import sharp from 'sharp';
const [, , INPUT, OUTPUT, ER = '4', FE = '2'] = process.argv;
const ERODE = +ER, FEATHER = +FE;

function erodeAlpha(a, w, h, R) {
  const t = new Uint8Array(w * h), o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 255; for (let d = -R; d <= R; d++) { const xx = x + d; if (xx < 0 || xx >= w) { m = 0; break; } const v = a[y * w + xx]; if (v < m) m = v; } t[y * w + x] = m; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let m = 255; for (let d = -R; d <= R; d++) { const yy = y + d; if (yy < 0 || yy >= h) { m = 0; break; } const v = t[yy * w + x]; if (v < m) m = v; } o[y * w + x] = m; }
  return o;
}
function boxBlur(a, w, h, rb) {
  const t = new Float32Array(w * h), o = new Float32Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, c = 0; for (let d = -rb; d <= rb; d++) { const xx = x + d; if (xx < 0 || xx >= w) continue; s += a[y * w + xx]; c++; } t[y * w + x] = s / c; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, c = 0; for (let d = -rb; d <= rb; d++) { const yy = y + d; if (yy < 0 || yy >= h) continue; s += t[yy * w + x]; c++; } o[y * w + x] = s / c; }
  return o;
}

const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info; const C = 4;
const gr = (i) => data[i + 1] - Math.max(data[i], data[i + 2]);

// measure background green from corners
let sg = 0, n = 0;
for (const [x, y] of [[3, 3], [W - 3, 3], [3, H - 3], [W - 3, H - 3]]) { sg += gr((y * W + x) * C); n++; }
const bgGreen = sg / n;
const HI = Math.max(28, bgGreen * 0.5), LO = Math.max(8, bgGreen * 0.22);
console.log(`dims ${W}x${H} | bg greenness=${bgGreen.toFixed(0)} | LO=${LO.toFixed(0)} HI=${HI.toFixed(0)} | erode=${ERODE} feather=${FEATHER}`);

const out = Buffer.alloc(W * H * C);
for (let i = 0; i < W * H; i++) {
  const si = i * C; let r = data[si], g = data[si + 1], b = data[si + 2];
  const gg = g - Math.max(r, b);
  let a = 255; if (gg >= HI) a = 0; else if (gg > LO) a = Math.round(255 * (HI - gg) / (HI - LO));
  const cap = (r + b) / 2 + 10; if (g > cap) g = cap; // despill
  out[si] = r; out[si + 1] = g; out[si + 2] = b; out[si + 3] = a;
}
// erode + feather alpha
const al = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) al[i] = out[i * 4 + 3];
const fe = boxBlur(erodeAlpha(al, W, H, ERODE), W, H, FEATHER);
for (let i = 0; i < W * H; i++) out[i * 4 + 3] = Math.round(fe[i]);

// crop to content bbox (+pad)
let minx = W, miny = H, maxx = 0, maxy = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (out[(y * W + x) * 4 + 3] > 30) { if (x < minx) minx = x; if (x > maxx) maxx = x; if (y < miny) miny = y; if (y > maxy) maxy = y; }
const PAD = 8; minx = Math.max(0, minx - PAD); miny = Math.max(0, miny - PAD); maxx = Math.min(W - 1, maxx + PAD); maxy = Math.min(H - 1, maxy + PAD);
const cw = maxx - minx + 1, ch = maxy - miny + 1;
const crop = Buffer.alloc(cw * ch * 4);
for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const s = ((miny + y) * W + (minx + x)) * 4, d = (y * cw + x) * 4; crop[d] = out[s]; crop[d + 1] = out[s + 1]; crop[d + 2] = out[s + 2]; crop[d + 3] = out[s + 3]; }
await sharp(crop, { raw: { width: cw, height: ch, channels: 4 } }).png().toFile(OUTPUT);
console.log(`cropped -> ${OUTPUT}  ${cw}x${ch}`);
