"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

// TODO: replace with the real hero dashboard video (and a matching poster
// image) when available. Until then this reuses the walkthrough placeholder.
const HERO_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Total scroll height (in viewport heights) the pinned animation occupies.
const TRACK_VH = 260;
// Backward tilt (degrees) of the 2.5D look at the very start.
const START_ANGLE = 35;
// Seconds after the mockup flattens before the video starts.
const VIDEO_START_DELAY_MS = 5000;

// Scroll progress breakpoints (0 = pin start, 1 = pin end):
const P_FLAT = 0.15; // 1st animation: tilt has flattened to 2D
const P_HOLD1 = 0.26; // brief flat hold (video plays here) before it grows
const P_FULL = 0.52; // 2nd animation: reached full-screen scale
const P_HOLD2 = 0.62; // holds full screen
const P_ZERO = 0.9; // fully shrunk to 0

/**
 * Pinned hero dashboard mockup. As the user scrolls through this section the
 * mockup (fixed/centered in the viewport) runs a timeline:
 * 2.5D tilt → flatten to 2D → scale up to fill the screen → shrink back to 0,
 * revealing the next section. The video plays once a short while after it
 * flattens, and holds on its last frame with a replay button. Everything is
 * driven purely by scroll position, so scrolling back up reverses it.
 * (Uses position: fixed rather than sticky because the body's overflow-x:hidden
 * turns the body into the scroll container and breaks sticky pinning.)
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullScaleRef = useRef(2.2);
  const playedRef = useRef(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [ended, setEnded] = useState(false);

  const progress = useMotionValue(0);
  const opacity = useMotionValue(0);

  const rotateX = useTransform(progress, (p) =>
    p <= P_FLAT ? START_ANGLE * (1 - p / P_FLAT) : 0,
  );
  const scale = useTransform(progress, (p) => {
    const FULL = fullScaleRef.current;
    if (p <= P_FLAT) return 0.85 + 0.15 * (p / P_FLAT); // 0.85 → 1 (1st anim)
    if (p <= P_HOLD1) return 1; // hold flat
    if (p <= P_FULL) return 1 + (FULL - 1) * ((p - P_HOLD1) / (P_FULL - P_HOLD1)); // 1 → FULL (2nd anim)
    if (p <= P_HOLD2) return FULL; // hold full screen
    if (p <= P_ZERO) return FULL * (1 - (p - P_HOLD2) / (P_ZERO - P_HOLD2)); // FULL → 0
    return 0;
  });
  const radius = useTransform(progress, [P_HOLD1, P_FULL], [32, 0], { clamp: true });

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const loop = () => {
      const track = trackRef.current;
      const mock = mockupRef.current;
      if (track && mock) {
        const vh = window.innerHeight;
        const top = track.offsetTop;
        const travel = Math.max(1, track.offsetHeight - vh);
        const raw = window.scrollY - top;
        const p = Math.min(1, Math.max(0, raw / travel));

        // Full-screen cover scale from the mockup's (unscaled) layout size.
        const w = mock.offsetWidth;
        const h = mock.offsetHeight;
        if (w && h) {
          fullScaleRef.current = Math.max(window.innerWidth / w, vh / h);
        }

        progress.set(p);
        // Visible only while the pin is active; fade at the very start.
        const vis = raw < 0 ? 0 : Math.min(1, raw / (travel * 0.03));
        opacity.set(p >= 1 ? 0 : vis);

        // Play the video once, a short delay after the mockup flattens.
        if (!playedRef.current && p >= P_FLAT) {
          playedRef.current = true;
          window.setTimeout(() => {
            const v = videoRef.current;
            if (v) {
              v.currentTime = 0;
              v.play().catch(() => {});
              setHasPlayed(true);
            }
          }, VIDEO_START_DELAY_MS);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, progress, opacity]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  // Reduced motion: a simple static mockup, no scroll animation or autoplay.
  if (reduceMotion) {
    return (
      <div className="w-full px-6 sm:px-10 md:px-20">
        <div className="relative mx-auto aspect-video w-full max-w-[1000px] overflow-hidden rounded-[32px] border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950">
          <video
            src={HERO_VIDEO_SRC}
            muted
            playsInline
            preload="metadata"
            controls
            className="size-full object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scroll track: reserves the scroll distance for the pinned timeline. */}
      <div ref={trackRef} aria-hidden className="bg-grey-950" style={{ height: `${TRACK_VH}vh` }} />

      {/* Fixed/pinned stage, centered in the viewport. Dark background matches
          the hero so the pinned region never flashes white. */}
      <motion.div
        style={{ opacity }}
        className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center bg-grey-950 px-6"
      >
        <motion.div
          ref={mockupRef}
          style={{ rotateX, scale, borderRadius: radius, perspective: 1000 }}
          className="hero-dashboard-radius relative aspect-video w-full max-w-[1000px] overflow-hidden border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]"
        >
          <img
            src="/images/hero/dashboard-glow.svg"
            alt=""
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-[-10px] h-1/2 w-full object-cover transition-opacity duration-500 ${
              hasPlayed ? "opacity-0" : "opacity-80"
            }`}
          />
          <video
            ref={videoRef}
            src={HERO_VIDEO_SRC}
            muted
            playsInline
            preload="metadata"
            aria-hidden
            onEnded={() => setEnded(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
              hasPlayed ? "opacity-100" : "opacity-0"
            }`}
          />
          {ended && (
            <div className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center">
              <button
                type="button"
                onClick={replay}
                aria-label="Replay video"
                className="flex size-16 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70 md:size-20"
              >
                <Play weight="fill" className="ml-1 size-7 md:size-8" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
