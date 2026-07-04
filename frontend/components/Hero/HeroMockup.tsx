"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

// TODO: replace with the real hero dashboard video (and a matching poster
// image) when available. Until then this reuses the walkthrough placeholder.
const HERO_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Scroll distance (px from the top) over which the tilt flattens — roughly
// three scroll-wheel notches.
const FLATTEN_DISTANCE = 450;
// How far the mockup is tilted back (degrees) when at the very top: the 2.5D look.
const START_ANGLE = 35;
// Seconds to wait after the mockup is flat before the video starts.
const VIDEO_START_DELAY_MS = 5000;

/**
 * Hero dashboard mockup (16:9) with a scroll-driven 2.5D effect:
 * - At the top it sits tilted back in perspective (2.5D) as a still image.
 * - Scrolling down flattens it to a straight-on 2D view; once flat it stays
 *   flat (it does not tilt back).
 * - A short delay after flattening, the video plays through once.
 * - When the video ends it holds on its last frame with a centered play button
 *   to replay it.
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const flattenedRef = useRef(false);
  const readyRef = useRef(false);
  const [flattened, setFlattened] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [ended, setEnded] = useState(false);

  // 0 = fully tilted (2.5D), 1 = flat (2D). Driven directly off window scroll.
  const progress = useMotionValue(0);
  const rotateX = useTransform(progress, [0, 1], [START_ANGLE, 0]);
  const scale = useTransform(progress, [0, 1], [0.9, 1]);

  // On (re)load the browser can briefly restore the previous scroll position
  // before StartAtTop resets to the top; ignore lock triggers until that
  // settles, otherwise the mockup would lock flat and never show the 2.5D tilt.
  useEffect(() => {
    const id = window.setTimeout(() => {
      readyRef.current = true;
    }, 400);
    return () => window.clearTimeout(id);
  }, []);

  // Scroll events don't reliably fire in every embedding, so poll window scroll
  // via rAF while the mockup is still tilting. Once it locks flat (one-way, no
  // tilt-back), the loop stops.
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const loop = () => {
      const y = window.scrollY;
      if (readyRef.current && y >= FLATTEN_DISTANCE - 2) {
        flattenedRef.current = true;
        setFlattened(true);
        progress.set(1);
        return;
      }
      progress.set(Math.min(1, Math.max(0, y / FLATTEN_DISTANCE)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion, progress]);

  // Play the video once, a short delay after the mockup locks flat.
  useEffect(() => {
    if (reduceMotion || !flattened || hasPlayed) return;
    const t = window.setTimeout(() => {
      setHasPlayed(true);
      const v = videoRef.current;
      if (v) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    }, VIDEO_START_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [flattened, hasPlayed, reduceMotion]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <div
      className="relative aspect-video w-full"
      style={{ perspective: reduceMotion ? undefined : 1000 }}
    >
      <motion.div
        style={
          reduceMotion
            ? undefined
            : { rotateX, scale, transformOrigin: "center bottom" }
        }
        className="hero-dashboard-radius absolute inset-0 overflow-hidden border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]"
      >
        {/* Still-image state: the styled dashboard frame + glow, shown until the
            video starts. */}
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
        {/* Replay button centered on the last frame after the video ends. */}
        {ended && (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
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
    </div>
  );
}
