"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const quotes = [
  {
    q: "TuneTip gave my booth a sixth sense. I can feel the room's taste before I reach for the next record.",
    a: "Solenne Marchand",
    r: "Resident DJ · Le Belvédère, Paris",
  },
  {
    q: "Bar revenue is one thing — this is the first tool that actually surfaces the energy of a night. Quietly brilliant.",
    a: "Mikael Ødegaard",
    r: "Head of Programming · Fuse, Brussels",
  },
  {
    q: "It's the first time a ‘music app’ didn't feel like an app. I just… sent my song. Everyone danced. That was it.",
    a: "Ana Kovač",
    r: "Regular · Concrete Paris",
  },
];

export function SocialProof() {
  return (
    <section className="relative py-28 md:py-36 overflow-hidden">
      <div className="shell">
        <div className="max-w-2xl">
          <Eyebrow>Early signal</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
            Words from the booth, the bar, and the floor.
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {quotes.map((q, i) => (
            <motion.figure
              key={q.a}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 p-8"
            >
              <span
                aria-hidden
                className="font-display text-[5rem] leading-none text-[color:var(--color-amber)]/40 -ml-1 -mt-2"
              >
                &ldquo;
              </span>
              <blockquote className="text-[color:var(--color-bone)]/85 text-[17px] leading-relaxed -mt-6">
                {q.q}
              </blockquote>
              <figcaption className="mt-8 pt-6 border-t border-[color:var(--color-hairline)]">
                <div className="text-[color:var(--color-bone)] text-[15px] font-medium">
                  {q.a}
                </div>
                <div className="mt-0.5 text-xs font-mono uppercase tracking-[0.18em] text-[color:var(--color-bone)]/55">
                  {q.r}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
