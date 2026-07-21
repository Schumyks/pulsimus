"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "./star.css";
import { useReducedMotion } from "../motion/useReducedMotion";
import { useIsDesktop } from "../motion/useIsDesktop";
import { useTunePane } from "../dev/tuneRegistry";
import {
  DEFAULT_STAR_PARAMS,
  STAR_PARAM_META,
  type StarParams,
} from "./starParams";

// Client-only mounts: both layers touch window/canvas, so they never prerender.
const StarLayer = dynamic(() => import("./StarLayer"), { ssr: false });
const SkyLayer = dynamic(() => import("./SkyLayer"), { ssr: false });

/**
 * Gates the star journey + night sky (BL-17): desktop only and no reduced
 * motion — mobile and reduced users see the page exactly as it is today
 * (umbral zones also collapse via CSS for them). Registers the "Estrella"
 * tab in the unified `?tune` panel and drives the live `--umbral-h` height.
 */
export default function StarLayerGate() {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const [params, setParams] = useState<StarParams>(DEFAULT_STAR_PARAMS);

  useTunePane({
    key: "estrella",
    label: "Estrella",
    order: 0,
    meta: STAR_PARAM_META,
    params,
    onChange: setParams,
  });

  useEffect(() => {
    document.documentElement.style.setProperty("--umbral-h", `${params.umbralVh}vh`);
  }, [params.umbralVh]);

  if (reduced || !isDesktop) return null;
  return (
    <>
      <SkyLayer />
      <StarLayer params={params} />
    </>
  );
}
