"use client";

import { motion } from "motion/react";
import { Headphones, Users, Building2, ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const lanes = [
  {
    id: "djs",
    icon: Headphones,
    label: "For DJs",
    title: "Read the room. In real time.",
    copy: "Requests arrive ranked by the room, not the algorithm. Tips route directly to you, with full setlist context. No split attention, no cluttered dashboard — just the set.",
    stats: [
      { k: "Avg. tips per 4h set", v: "€340" },
      { k: "Requests honoured", v: "62%" },
    ],
    accent: "var(--color-amber)",
  },
  {
    id: "audience",
    icon: Users,
    label: "For the audience",
    title: "Be part of the set.",
    copy: "Send a song the DJ can actually see. Add a tip if it matters. Clap, cheer, boost the track playing — without ever pulling focus from the dancefloor.",
    stats: [
      { k: "Tap to request", v: "<3s" },
      { k: "Zero sign-ups on the floor", v: "✓" },
    ],
    accent: "var(--color-violet)",
  },
  {
    id: "venues",
    icon: Building2,
    label: "For venues",
    title: "Nights, understood.",
    copy: "See what lit the floor, which hour peaked, and what paid for the next booking. Quiet analytics designed to help programmers choose better, faster.",
    stats: [
      { k: "Heatmap per hour", v: "Live" },
      { k: "Revenue per set", v: "Tracked" },
    ],
    accent: "var(--color-cyan)",
  },
];

export function Audiences() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <Eyebrow>Built for three</Eyebrow>
          <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.6rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
            Three audiences.{" "}
            <span className="text-[color:var(--color-bone)]/55">
              One elegant stage.
            </span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {lanes.map((l, i) => (
            <motion.a
              key={l.id}
              id={l.id}
              href={`#${l.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.9,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 p-8 md:p-10 hover:border-white/20 hover:-translate-y-1 transition-[transform,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <div
                aria-hidden
                className="absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(closest-side, ${l.accent}, transparent)`,
                }}
              />
              <div className="relative flex items-center justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl border border-[color:var(--color-hairline-strong)]"
                  style={{ color: l.accent }}
                >
                  <l.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <ArrowUpRight className="h-4 w-4 text-[color:var(--color-bone)]/40 transition-all duration-500 group-hover:text-[color:var(--color-bone)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>

              <div className="relative mt-8">
                <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--color-bone)]/55">
                  {l.label}
                </div>
                <h3 className="mt-3 text-2xl md:text-3xl font-medium tracking-[-0.02em] leading-tight text-balance">
                  {l.title}
                </h3>
                <p className="mt-4 text-[color:var(--color-bone)]/65 leading-relaxed">
                  {l.copy}
                </p>
              </div>

              <dl className="relative mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-[color:var(--color-hairline)]">
                {l.stats.map((s) => (
                  <div key={s.k}>
                    <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-[color:var(--color-bone)]/50">
                      {s.k}
                    </dt>
                    <dd className="mt-1 text-lg font-medium text-[color:var(--color-bone)]">
                      {s.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
