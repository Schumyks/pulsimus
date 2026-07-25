#!/usr/bin/env python3
"""locate-piece: find WHERE each known piece sits inside a composite, by normalized
cross-correlation (template matching). It LOCATES without SEGMENTING -> works on an
ASSEMBLED composite where map-pieces (connected-components) only sees one blob.

Use when you HAVE the individual pieces AND the assembled art, and need each piece's
position (e.g. to reproduce the composition faithfully) -> the third mapping route,
complementary to connected-components (disassembled sheet) and color/SAM (BL-21/BL-22).

Caveat: needs the piece to appear at the SAME scale/orientation in the composite
(a 1:1 crop). If the piece comes from a different generation/scale than the art, the
peak correlation drops -> reported (low peak = matching not viable for that pair; the
position must come from elsewhere, e.g. the rigger's layout).

Requires: numpy scikit-image pillow (venv-score).
Usage: locate-piece.py <composite.png> <piece.png> [piece2.png ...] [--json]
"""
import sys
import json
import numpy as np
from PIL import Image
from skimage.feature import match_template
from skimage.color import rgb2gray


def gray_on_black(path):
    im = np.asarray(Image.open(path).convert("RGBA")).astype(np.float32) / 255.0
    a = im[..., 3:4]
    return rgb2gray(im[..., :3] * a)          # composite over black, then luminance


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    json_out = "--json" in sys.argv
    comp = gray_on_black(args[0])
    out = []
    for ppath in args[1:]:
        tmpl = gray_on_black(ppath)
        name = ppath.split("/")[-1]
        if tmpl.shape[0] > comp.shape[0] or tmpl.shape[1] > comp.shape[1]:
            out.append({"piece": name, "error": "template larger than composite"})
            continue
        res = match_template(comp, tmpl)       # NCC map; index = window top-left
        y, x = np.unravel_index(int(np.argmax(res)), res.shape)
        out.append({"piece": name, "x": int(x), "y": int(y),
                    "peak": round(float(res[y, x]), 4), "w": tmpl.shape[1], "h": tmpl.shape[0]})

    for o in out:
        if "error" in o:
            print(f"  {o['piece']:28} {o['error']}")
        else:
            flag = "" if o["peak"] >= 0.5 else "  <- LOW peak (scale/generation mismatch?)"
            print(f"  {o['piece']:28} @ ({o['x']},{o['y']})  peak={o['peak']:.3f}  ({o['w']}x{o['h']}){flag}")
    if json_out:
        print(json.dumps(out))


if __name__ == "__main__":
    main()
