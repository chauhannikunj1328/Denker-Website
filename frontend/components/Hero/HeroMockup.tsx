"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

// TODO: replace with the real hero dashboard video (and a matching poster
// image) when available. Until then this reuses the walkthrough placeholder.
const HERO_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

// Scroll distance (px from the top) over which the tilt flattens — roughly
// three scroll-wheel notches.
const FLATTEN_DISTANCE = 450;
// How far the mockup is tilted back (degrees) when at the very top: the 2.5D look.
const START_ANGLE = 26;
// Seconds to wait after the mockup is flat before the video starts.
const VIDEO_START_DELAY_MS = 5000;

/**
 * Hero dashboard mockup with a scroll-driven 2.5D effect:
 * - At the top it sits tilted back in perspective (2.5D) as a still image.
 * - Scrolling down flattens it to a straight-on 2D image within FLATTEN_DISTANCE.
 * - Once flat, after a short delay the video begins to play.
 * - Scrolling back up reverses everything: the video stops and the still image
 *   tilts back into the 2.5D view as you reach the top.
 */
export function HeroMockup() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [flat, setFlat] = useState(false);
  const [playing, setPlaying] = useState(false);

  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, FLATTEN_DISTANCE], [START_ANGLE, 0], {
    clamp: true,
  });
  const scale = useTransform(scrollY, [0, FLATTEN_DISTANCE], [0.9, 1], {
    clamp: true,
  });

  useMotionValueEvent(scrollY, "change", (y) => {
    setFlat(y >= FLATTEN_DISTANCE - 2);
  });

  // Start the video only after the mockup has been flat for the delay; stop it
  // the moment it tilts again (scrolling back up).
  useEffect(() => {
    if (reduceMotion) return;
    if (!flat) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setPlaying(true), VIDEO_START_DELAY_MS);
    return () => clearTimeout(t);
  }, [flat, reduceMotion]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
      try {
        v.currentTime = 0;
      } catch {
        // ignore — resetting time isn't essential
      }
    }
  }, [playing]);

  return (
    <div
      className="relative h-[420px] w-full sm:h-[560px] md:h-[720px]"
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
        {/* Still-image state: the styled dashboard frame + glow. Fades out once
            the video takes over. */}
        <img
          src="/images/hero/dashboard-glow.svg"
          alt=""
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-[-10px] h-1/2 w-full object-cover transition-opacity duration-500 ${
            playing ? "opacity-0" : "opacity-80"
          }`}
        />
        <video
          ref={videoRef}
          src={HERO_VIDEO_SRC}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${
            playing ? "opacity-100" : "opacity-0"
          }`}
        />
      </motion.div>
    </div>
  );
}
