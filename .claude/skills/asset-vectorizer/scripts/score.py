#!/usr/bin/env python3
"""Multi-axis fidelity score (Option B: number covers SHAPE + COLOR).

Compares a TARGET raster against a CANDIDATE (png or svg) of matching art.
Reports ORTHOGONAL axes so no single trick satisfies all of them (Goodhart):

  color       -> deltaE CIEDE2000, pooled p95 (worst color, not diluted mean)
  structure   -> SSIM, worst-region (p95 of 1-ssim map)
  shape       -> IoU + coverage of the TARGET silhouette (missing vs spurious)
  worst point -> Hausdorff distance on silhouettes

VERDICT follows the division of labor (see SKILL "Verificación reforzada"):
SHAPE is the robust AUTOMATIC gate (IoU/coverage have a stable cut ~0.90) and
distinguishes MISSING (coverage low) from EXTRA (IoU low, coverage high).
Color/structure are SIGNALS to cross-check against the MANDATORY contrast diff,
NOT absolute pass/fail — their thresholds cross between pieces (a flip trap
scored dE95=18 while a good real vector scored 31; there is no single cut).
Orientation and sharpness are NOT the number's job -> the diff catches them.

Region of scoring is fixed by the TARGET alpha (never the candidate) so a
candidate cannot hide a missing part by shrinking its own mask.

Requires: numpy scipy scikit-image pillow cairosvg  (see requirements-score.txt)
Usage: score.py TARGET.png CANDIDATE.{png,svg} [--bg RRGGBB] [--json]
"""
import sys, os, io, json, argparse
import numpy as np
from PIL import Image
from skimage.color import rgb2lab, deltaE_ciede2000
from skimage.metrics import structural_similarity, hausdorff_distance


def load_rgba(path, size=None):
    if path.lower().endswith(".svg"):
        import cairosvg
        w, h = size if size else (None, None)
        png = cairosvg.svg2png(url=path, output_width=w, output_height=h)
        im = Image.open(io.BytesIO(png)).convert("RGBA")
    else:
        im = Image.open(path).convert("RGBA")
    if size is not None and im.size != size:
        im = im.resize(size, Image.LANCZOS)
    return np.asarray(im)


def _composite_over(rgba, bg):
    a = rgba[..., 3:4].astype(np.float32) / 255.0
    rgb = rgba[..., :3].astype(np.float32)
    return rgb * a + np.array(bg, np.float32) * (1.0 - a)


def score_pair(tgt, cnd, bg=(0x12, 0x23, 0x3a)):
    """tgt, cnd: HxWx4 uint8, same shape. Returns dict of axes + verdict."""
    if cnd.shape[:2] != tgt.shape[:2]:
        raise ValueError(f"size mismatch {cnd.shape} vs {tgt.shape}")
    t_rgb = _composite_over(tgt, bg)
    c_rgb = _composite_over(cnd, bg)

    region = tgt[..., 3] > 128            # region fixed by TARGET
    n = int(region.sum())
    if n == 0:
        raise ValueError("empty target region")

    old = float(np.abs(t_rgb - c_rgb)[region].mean())   # legacy 1-axis, for reference

    dE = deltaE_ciede2000(rgb2lab(t_rgb / 255.0), rgb2lab(c_rgb / 255.0))
    dE_p95 = float(np.percentile(dE[region], 95))

    t_gray, c_gray = t_rgb.mean(2), c_rgb.mean(2)
    ssim_mean, ssim_map = structural_similarity(t_gray, c_gray, data_range=255.0, full=True)
    diss_p95 = float(np.percentile(1.0 - ssim_map[region], 95))

    m_t, m_c = tgt[..., 3] > 128, cnd[..., 3] > 128
    inter = int(np.logical_and(m_t, m_c).sum())
    union = int(np.logical_or(m_t, m_c).sum())
    iou = float(inter / union) if union else 0.0
    covered = float(inter / int(m_t.sum())) if m_t.any() else 0.0
    try:
        hd = float(hausdorff_distance(m_t, m_c))
    except Exception:
        hd = float("nan")

    # SHAPE = robust automatic gate; distinguish MISSING from EXTRA
    tag = []
    if covered < 0.90:               tag.append(f"MISSING(cov={covered:.2f})")
    if iou < 0.90 <= covered:        tag.append(f"EXTRA(iou={iou:.2f})")
    shape_ok = covered >= 0.90 and iou >= 0.90
    signals = []
    if dE_p95 > 25:                  signals.append(f"color:dE95={dE_p95:.0f}")
    if diss_p95 > 0.6:               signals.append(f"struct:1-ssim95={diss_p95:.2f}")
    verdict = "shape-ok" if shape_ok else "FAIL-SHAPE " + " ".join(tag)
    if signals:
        verdict += " | signals(cross-check the diff): " + " ".join(signals)

    return dict(old=round(old, 2), dE_p95=round(dE_p95, 1), ssim=round(float(ssim_mean), 4),
                diss_p95=round(diss_p95, 3), iou=round(iou, 4), covered=round(covered, 4),
                hausdorff=round(hd, 1), region_px=n, verdict=verdict)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("target")
    ap.add_argument("candidate")
    ap.add_argument("--bg", default="12233a")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    bg = tuple(int(a.bg[i:i + 2], 16) for i in (0, 2, 4))
    tgt = load_rgba(a.target)
    cnd = load_rgba(a.candidate, size=(tgt.shape[1], tgt.shape[0]))
    out = score_pair(tgt, cnd, bg)
    print(json.dumps(out) if a.json else out)


if __name__ == "__main__":
    main()
