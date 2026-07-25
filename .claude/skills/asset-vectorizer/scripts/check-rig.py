#!/usr/bin/env python3
"""check-rig: riggeability lint for SVG pieces, run BEFORE importing into Rive.

Catches the rig-breakers found the hard way:
  HARD (fails):
    - duplicate id (an element id colliding with a gradient/clip id -> invalid + broken rig
      in Rive). Detected by parsing, so it needs no SVG DTD / network -- more portable than
      `xmllint --valid`, which requires the full SVG 1.1 DTD to know `id` is type ID.
    - malformed XML (xmllint --noout --nonet well-formedness).
    - Rive-incompatible features: gradientTransform, <mask>, <filter>, <image>,
      stroke-dasharray, skewX/Y, fill/stroke via <style>/class (Rive needs inline
      presentation attributes).
  WARN (reported, does not fail):
    - anonymous <path> (no id -> not selectable by name when rigging)
    - single-child <g> (redundant wrapper)

Usage: check-rig.py <svg> [svg2 ...]
"""
import sys
import subprocess
import xml.etree.ElementTree as ET

RIVE_UNSUPPORTED = [
    ("gradientTransform", "gradientTransform"),
    ("<mask", "<mask"),
    ("<filter", "<filter"),
    ("<image", "<image"),
    ("stroke-dasharray", "stroke-dasharray"),
    ("skewX", "skewX"), ("skewY", "skewY"),
    ("<style", "<style block (CSS)"),
    ("class=", "class= (CSS styling)"),
]


def local(tag):
    return tag.rsplit("}", 1)[-1] if isinstance(tag, str) else ""


def check(path):
    hard, warn = [], []
    raw = ""
    try:
        with open(path, encoding="utf-8") as fh:
            raw = fh.read()
    except Exception as e:
        return [f"cannot read: {e}"], []

    # well-formedness via xmllint (no network, no DTD)
    try:
        r = subprocess.run(["xmllint", "--noout", "--nonet", path],
                           capture_output=True, text=True)
        if r.returncode != 0:
            hard.append(f"malformed XML (xmllint exit {r.returncode}): {r.stderr.strip().splitlines()[0] if r.stderr.strip() else ''}")
    except FileNotFoundError:
        warn.append("xmllint not found -> skipped well-formedness")

    # parse for ids / anonymous paths / single-child groups
    ids = []
    anon_paths = 0
    single_child_g = 0
    try:
        root = ET.fromstring(raw)
        for el in root.iter():
            t = local(el.tag)
            if el.get("id"):
                ids.append(el.get("id"))
            if t == "path" and not el.get("id"):
                anon_paths += 1
            if t == "g":
                kids = [c for c in list(el) if isinstance(c.tag, str)]
                if len(kids) == 1:
                    single_child_g += 1
    except ET.ParseError as e:
        hard.append(f"XML parse error: {e}")

    dups = sorted({i for i in ids if ids.count(i) > 1})
    if dups:
        hard.append(f"duplicate id(s): {', '.join(dups)}  <- element/gradient id collision breaks the rig")

    for needle, label in RIVE_UNSUPPORTED:
        c = raw.count(needle)
        if c:
            hard.append(f"Rive-unsupported: {label} x{c}")

    if anon_paths:
        warn.append(f"{anon_paths} anonymous <path> (no id -> not name-selectable when rigging)")
    if single_child_g:
        warn.append(f"{single_child_g} single-child <g> (redundant wrapper)")
    return hard, warn


def main():
    if len(sys.argv) < 2:
        print("usage: check-rig.py <svg> [svg2 ...]", file=sys.stderr)
        sys.exit(2)
    any_hard = False
    for path in sys.argv[1:]:
        hard, warn = check(path)
        status = "FAIL ✗" if hard else ("warn" if warn else "PASS ✓")
        print(f"{path}: {status}")
        for h in hard:
            print(f"    HARD  {h}")
        for w in warn:
            print(f"    warn  {w}")
        if hard:
            any_hard = True
    sys.exit(1 if any_hard else 0)


if __name__ == "__main__":
    main()
