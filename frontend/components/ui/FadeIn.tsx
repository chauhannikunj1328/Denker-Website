"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element starts, for sequencing within a section. */
  delay?: number;
  /** How far (px) the element travels up as it fades in. */
  y?: number;
  /** Which element to render. Rendered in place (no extra wrapper). */
  as?: "div" | "p" | "span";
};

/**
 * Fades its content in while rising from below, the first time it scrolls into
 * view. Renders the chosen element directly (same tag + className) so it can
 * replace an existing element without adding a wrapper that would disturb
 * flex/grid layouts. Respects prefers-reduced-motion.
 */
export function FadeIn({ children, className, delay = 0, y = 24, as = "div" }: FadeInProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "p" ? motion.p : as === "span" ? motion.span : motion.div;

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </MotionTag>
  );
}
