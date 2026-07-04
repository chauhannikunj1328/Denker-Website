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
const PIN_SCROLL = 1400; // px of scroll for the fullscreen scale (2nd animation)
const VIDEO_START_DELAY_MS = 5000;

/**
 * Hero dashboard mockup. It sits in the hero at rest (visible immediately,
 * tilted 2.5D). A fixed "stage" tracks that in-flow slot so it looks in place;
 * as you scroll it flattens (1st animation), then pins below the header and
 * scales up to fill the screen and shrinks back to 0 (2nd animation). Driven
 * purely by scroll position, so it fully reverses on the way up.
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const slotRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playedRef = useRef(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const loop = () => {
      const slot = slotRef.current;
      const stage = stageRef.current;
      if (slot && stage) {
        const rect = slot.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const w = rect.width;
        const h = w * (9 / 16);
        const pinTop = HEADER_OFFSET;

        // Stage follows the in-flow slot until the slot's top reaches the pin
        // line, then it pins there.
        const top = Math.max(pinTop, rect.top);
        const past = Math.max(0, pinTop - rect.top); // scroll distance past the pin

        // 1st animation — tilt flattens as the slot approaches the pin line.
        const tilt =
          past > 0
            ? 0
            : START_ANGLE * Math.min(1, Math.max(0, (rect.top - pinTop) / TILT_RANGE));

        // 2nd animation — once pinned, scale up to cover the screen then shrink.
        const FULL = Math.max(vw / w, vh / h);
        const q = Math.min(1, past / PIN_SCROLL);
        let scale = 1;
        if (q > 0) {
          if (q <= 0.4) scale = 1 + (FULL - 1) * (q / 0.4);
          else if (q <= 0.52) scale = FULL;
          else if (q <= 0.85) scale = FULL * (1 - (q - 0.52) / 0.33);
          else scale = 0;
        }

        stage.style.top = `${top}px`;
        stage.style.left = `${rect.left}px`;
        stage.style.width = `${w}px`;
        stage.style.height = `${h}px`;
        stage.style.transformOrigin = "center top";
        stage.style.transform = `perspective(1200px) scale(${scale}) rotateX(${tilt}deg)`;
        // Keep a constant visual 32px radius despite the scale.
        stage.style.borderRadius = `${scale > 0.01 ? 32 / scale : 32}px`;
        // Hidden once fully shrunk or entirely below the fold.
        stage.style.opacity = q >= 1 || rect.top > vh ? "0" : "1";

        // Play the video once, a short delay after it flattens.
        if (!playedRef.current && rect.top <= pinTop + 2) {
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
  }, [reduceMotion]);

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    setEnded(false);
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  const mockupInner = (
    <>
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
    </>
  );

  // Reduced motion: a plain, static mockup with native controls.
  if (reduceMotion) {
    return (
      <div className="mx-auto aspect-video w-full max-w-[1000px] overflow-hidden rounded-[32px] border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950">
        <video
          src={HERO_VIDEO_SRC}
          muted
          playsInline
          preload="metadata"
          controls
          className="size-full object-cover"
        />
      </div>
    );
  }

  return (
    <>
      {/* In-flow slot: reserves the mockup's resting size and the extra scroll
          distance the pinned scale phase needs. */}
      <div className="w-full">
        <div ref={slotRef} className="mx-auto aspect-video w-full max-w-[1000px]" />
        <div aria-hidden style={{ height: `${PIN_SCROLL}px` }} />
      </div>

      {/* Fixed stage that tracks the slot, then pins and scales. */}
      <div
        ref={stageRef}
        className="fixed z-30 overflow-hidden border border-grey-700 bg-gradient-to-b from-grey-900 to-grey-950 shadow-[0_0_120px_rgba(74,191,115,0.08)]"
        style={{ top: 0, left: 0, borderRadius: 32 }}
      >
        {mockupInner}
      </div>
    </>
  );
}
