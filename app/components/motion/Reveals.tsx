'use client';

import { useEffect } from 'react';

export default function Reveals() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const els = Array.from(
      document.querySelectorAll<HTMLElement>('[data-rv]'),
    ).filter((el) => el.dataset.rv !== 'hero');
    if (els.length === 0) return;

    for (const el of els) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition =
        'opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 0.61, 0.36, 1)';
      const delay = el.dataset.rvD;
      if (delay) el.style.transitionDelay = `${delay}ms`;
    }

    let io: IntersectionObserver | null = null;
    const raf = requestAnimationFrame(() => {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'none';
            io?.unobserve(el);
          }
        },
        { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
      );
      for (const el of els) io.observe(el);
    });

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  return null;
}
