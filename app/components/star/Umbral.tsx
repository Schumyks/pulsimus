/**
 * Umbral (BL-17): a breathing zone between two content sections. Since the
 * noche-first pivot the whole site floats on the night sky, so the umbral is
 * simply open sky where the star takes center stage and the cloud banks
 * (drawn by StarLayer, confined to these rects) drift by. Height is tunable
 * live via the `--umbral-h` CSS variable (set from the ?tune star pane).
 * Hidden on mobile and reduced-motion: those users keep a continuous page.
 */
export default function Umbral() {
  return (
    <div
      data-umbral
      aria-hidden="true"
      className="hidden h-[var(--umbral-h,55vh)] md:motion-safe:block"
    />
  );
}
