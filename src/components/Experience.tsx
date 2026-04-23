"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

const moments = [
  {
    tag: "22:47",
    title: "The room arrives.",
    copy: "The first hands in the air. A subtle chime on the DJ console — three requests, one already tipped. The set adapts.",
    accent: "from-[color:var(--color-amber)]/40 to-transparent",
  },
  {
    tag: "00:12",
    title: "A song changes the night.",
    copy: "Ana slides a €9 tip with two words: “just this.” It surfaces to the top. Solenne nods from behind the decks. The floor roars.",
    accent: "from-[color:var(--color-violet)]/40 to-transparent",
  },
  {
    tag: "02:38",
    title: "The set remembers.",
    copy: "Every request, every tip, every peak moment — distilled into a quiet report for the venue by sunrise. Nothing more. Nothing less.",
    accent: "from-[color:var(--color-cyan)]/40 to-transparent",
  },
];

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-40px", "40px"]);

  return (
    <section
      id="experience"
      ref={ref}
      className="relative py-28 md:py-40 overflow-hidden"
    >
      <motion.div
        aria-hidden
        style={{ y }}
        className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[color:var(--color-amber)]/40 to-transparent"
      />

      <div className="shell">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <div className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <Eyebrow>One live moment</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,3.8vw,3.2rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
              Three hours.
              <br />
              <span className="font-display italic text-[color:var(--color-bone)]/75">
                One conversation.
              </span>
            </h2>
            <p className="mt-5 text-[color:var(--color-bone)]/60 leading-relaxed max-w-sm">
              Scroll with a single night — from the opening bass drop to the
              final record lift — through the eyes of everyone in the room.
            </p>
          </div>

          <div className="md:col-span-8 space-y-6 md:space-y-10">
            {moments.map((m, i) => (
              <motion.article
                key={m.tag}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative overflow-hidden rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 p-8 md:p-12`}
              >
                <div
                  aria-hidden
                  className={`absolute -top-24 -right-24 h-[320px] w-[320px] rounded-full blur-3xl bg-gradient-to-br ${m.accent}`}
                />
                <div className="relative flex items-start gap-6 md:gap-10">
                  <span className="shrink-0 font-mono text-xs tracking-widest text-[color:var(--color-amber)]">
                    {m.tag}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-[clamp(1.6rem,2.6vw,2.2rem)] font-medium tracking-[-0.02em] leading-tight">
                      {m.title}
                    </h3>
                    <p className="mt-3 text-[color:var(--color-bone)]/65 leading-relaxed max-w-xl">
                      {m.copy}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
