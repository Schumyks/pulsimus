import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * The site's single scroll clock: one Lenis instance driving one
 * gsap.ticker raf, wired to ScrollTrigger.update. Every consumer shares it
 * via acquire/release (refcounted) — two Lenis instances (or Lenis without
 * the ScrollTrigger wiring) make pin/scrub tremble.
 */

let lenis: Lenis | null = null;
let refCount = 0;

const raf = (time: number) => {
  lenis?.raf(time * 1000);
};

export function acquireScrollEngine(): Lenis {
  if (!lenis) {
    gsap.registerPlugin(ScrollTrigger);
    lenis = new Lenis({ anchors: true });
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on("scroll", ScrollTrigger.update);
  }
  refCount += 1;
  return lenis;
}

export function releaseScrollEngine(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && lenis) {
    gsap.ticker.remove(raf);
    lenis.destroy();
    lenis = null;
  }
}
