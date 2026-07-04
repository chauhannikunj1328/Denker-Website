"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "@phosphor-icons/react/dist/ssr";
import { useReducedMotion } from "framer-motion";

// TODO: replace with the real hero dashboard video (and a matching poster
// image) when available. Until then this reuses the walkthrough placeholder.
const HERO_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

const START_ANGLE = 35; // 2.5D backward tilt at rest
const HEADER_OFFSET = 96; // px from the viewport top where the mockup pins
const TILT_RANGE = 360; // px of scroll over which it flattens (1st animation)
const TRACK_HEIGHT = 1400; // px the in-flow track adds — drives the pinned scale
const VIDEO_START_DELAY_MS = 5000;
const DESKTOP_MIN_WIDTH = 1024; // scroll animation runs at/above this width only

/**
 * Hero dashboard mockup.
 *
 * Desktop: sits in the hero at rest (visible immediately, tilted 2.5D). A
 * fixed "stage" tracks an in-flow track element so it looks in place; on
 * scroll it flattens (1st animation), pins below the header, then scales up to
 * fill the screen and shrinks back to 0 exactly as the next section arrives
 * (2nd animation). Driven purely by scroll position, so it fully reverses.
 *
 * Tablet / mobile (and reduced motion): no scroll animation — just a static,
 * flat video mockup in the hero.
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const [animate, setAnimate] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [ended, setEnded] = useState(false);

  // Only run the pinned scroll animation on desktop with motion allowed.
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
    const update = () => setAnimate(mq.matches && !reduceMotion);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [reduceMotion]);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    const loop = () => {
      const el = trackRef.current;
      const stage = stageRef.current;
      if (el && stage) {
        const rect = el.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const elTop = rect.top;
        const elH = el.offsetHeight; // TRACK_HEIGHT
        const w = rect.width;
        const h = w * (9 / 16);
        const pinTop = HEADER_OFFSET;

        // The stage follows the track's top until it reaches the pin line,
        // then pins there.
        const top = Math.max(pinTop, elTop);

        // 1st animation — tilt flattens as the track approaches the pin line.
        const tilt =
          elTop > pinTop ? START_ANGLE * Math.min(1, (elTop - pinTop) / TILT_RANGE) : 0;

        // 2nd animation — pin progress runs 0 (track top at pin line) to 1
        // (track bottom at pin line, i.e. the next section reaches the top).
        // Scale hits 0 right at q = 1, so there is no empty gap afterwards.
        const q = Math.min(1, Math.max(0, (pinTop - elTop) / elH));
        const FULL = Math.max(vw / w, vh / h);
        let scale = 1;
        if (q > 0) {
          if (q <= 0.32) scale = 1 + (FULL - 1) * (q / 0.32);
          else if (q <= 0.42) scale = FULL;
          else scale = FULL * (1 - (q - 0.42) / 0.58);
        }
        scale = Math.max(0, scale);

        stage.style.top = `${top}px`;
        stage.style.left = `${rect.left}px`;
        stage.style.width = `${w}px`;
        stage.style.height = `${h}px`;
        stage.style.transformOrigin = "center top";
        stage.style.transform = `perspective(1200px) scale(${scale}) rotateX(${tilt}deg)`;
        // Keep a constant visual 32px radius despite the scale.
        stage.style.borderRadius = `${scale > 0.01 ? 32 / scale : 32}px`;
        // Hidden once fully shrunk or entirely below the fold.
        stage.style.opacity = scale <= 0.001 || elTop > vh ? "0" : "1";

        // Play the video once, a short delay after it flattens.
        if (!playedRef.current && elTop <= pinTop + 2) {
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
  }, [animate]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  // Static mockup for tablet / mobile / reduced motion — no scroll animation.
  if (!animate) {
    return (
      <div className="relative mx-auto aspect-video w-full max-w-[1000px] overflow-hidden rounded-[32px] border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950">
        <video
          src={HERO_VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
          autoPlay={!reduceMotion}
          loop={!reduceMotion}
          controls={reduceMotion}
          className="size-full object-cover"
        />
      </div>
    );
  }

  return (
    <>
      {/* In-flow track: reserves the mockup's resting slot and provides the
          scroll distance the pinned scale phase runs over. */}
      <div ref={trackRef} aria-hidden className="mx-auto w-full max-w-[1000px]" style={{ height: `${TRACK_HEIGHT}px` }} />

      {/* Fixed stage that tracks the slot, then pins and scales. */}
      <div
        ref={stageRef}
        className="fixed z-30 overflow-hidden border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]"
        style={{ top: 0, left: 0, borderRadius: 32 }}
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
      </div>
    </>
  );
}
