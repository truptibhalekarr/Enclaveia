"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/cn";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
};

const directionOffset = {
  up: { y: 50, x: 0 },
  down: { y: -50, x: 0 },
  left: { x: 50, y: 0 },
  right: { x: -50, y: 0 }
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up"
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <motion.div
      ref={ref}
      className={cn("will-change-transform", className)}
      initial={{ opacity: 0, ...directionOffset[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionOffset[direction] }}
      transition={{
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1], // Custom bouncy ease out
        delay: delay / 1000
      }}
    >
      {children}
    </motion.div>
  );
}
