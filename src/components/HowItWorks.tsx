"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const steps = [
  {
    n: "01",
    title: "Tap in.",
    copy: "Scan the table chip, wristband or poster — no account, no app install. You're in the room in under three seconds.",
  },
  {
    n: "02",
    title: "Send the moment.",
    copy: "Request a song, tip the DJ, or boost what's playing. Every gesture costs a thought, not an interaction.",
  },
  {
    n: "03",
    title: "Feel the set react.",
    copy: "The booth sees you. The floor hears you. And at dawn, the venue reads the night you helped compose.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28 md:py-36">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.6rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
            Three gestures.{" "}
            <span className="text-[color:var(--color-bone)]/55">
              No friction.
            </span>
          </h2>
        </Reveal>

        <ol className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-display text-5xl md:text-6xl text-[color:var(--color-amber)]/80 leading-none">
                  {s.n}
                </span>
                <span className="flex-1 h-px bg-gradient-to-r from-[color:var(--color-hairline-strong)] to-transparent" />
              </div>
              <h3 className="mt-6 text-2xl md:text-[28px] font-medium tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="mt-3 text-[color:var(--color-bone)]/65 leading-relaxed">
                {s.copy}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
