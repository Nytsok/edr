"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  direction?: Direction;
  as?: "div" | "section" | "header" | "footer" | "article" | "span";
  className?: string;
  once?: boolean;
  amount?: number;
};

const offset = 28;

export function Reveal({
  children,
  delay = 0,
  direction = "up",
  as = "div",
  className,
  once = true,
  amount = 0.2,
}: RevealProps) {
  const shouldReduce = useReducedMotion();

  const hidden = {
    opacity: 0,
    x:
      direction === "left"
        ? -offset
        : direction === "right"
        ? offset
        : 0,
    y:
      direction === "up"
        ? offset
        : direction === "down"
        ? -offset
        : 0,
    filter: "blur(6px)",
  };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      delay,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  };

  const variants: Variants = shouldReduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden, visible };

  const MotionTag = motion[as] as typeof motion.div;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
