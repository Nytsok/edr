"use client";

import { motion } from "motion/react";
import {
  Radio,
  ShieldCheck,
  Wifi,
  Sparkles,
  LineChart,
  Languages,
} from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const features = [
  {
    icon: Radio,
    title: "Live crowd queue",
    copy: "Requests surface to the DJ ranked by tip, timing and proximity. Never hidden, never spammy.",
    span: "md:col-span-3 md:row-span-2",
    showcase: "queue",
  },
  {
    icon: ShieldCheck,
    title: "Trusted tipping",
    copy: "Apple Pay, Google Pay, Link. Settled in under 48 hours. Fully traceable, venue-friendly.",
    span: "md:col-span-3",
  },
  {
    icon: Wifi,
    title: "Basement-proof",
    copy: "Offline-first. No bars? No problem. Requests queue locally, sync the second you're back.",
    span: "md:col-span-2",
  },
  {
    icon: LineChart,
    title: "Quiet analytics",
    copy: "A one-page after-hours report per set. What rose the floor, when, and why.",
    span: "md:col-span-2",
  },
  {
    icon: Languages,
    title: "Speaks the room",
    copy: "Twelve languages, a shared gesture. Built for international floors from Berghain to Tulum.",
    span: "md:col-span-2",
  },
  {
    icon: Sparkles,
    title: "Moments, captured",
    copy: "Auto-clip the exact 12 seconds the crowd peaked. Share it. Program around it.",
    span: "md:col-span-3",
  },
];

export function Features() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="shell">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <Reveal className="max-w-2xl">
            <Eyebrow>Product</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.5vw,3.6rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
              Powerful where it matters.
              <br />
              <span className="text-[color:var(--color-bone)]/55 font-display italic">
                Invisible where it should be.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="max-w-md text-[color:var(--color-bone)]/60">
            <p className="leading-relaxed">
              Every capability earned its place on the dancefloor first, on the
              screen second. Here&rsquo;s what ships in v1.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-5 auto-rows-[minmax(180px,auto)]">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 p-7 md:p-8 ${f.span} hover:border-white/20 transition-colors duration-500`}
            >
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/[0.03] border border-[color:var(--color-hairline)] text-[color:var(--color-amber-2)]">
                  <f.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </div>
              </div>
              <h3 className="mt-8 text-xl md:text-2xl font-medium tracking-[-0.02em] text-balance">
                {f.title}
              </h3>
              <p className="mt-2 text-[color:var(--color-bone)]/60 leading-relaxed text-[15px] max-w-md">
                {f.copy}
              </p>

              {f.showcase === "queue" && <QueueShowcase />}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function QueueShowcase() {
  const items = [
    { title: "Strobe", artist: "Deadmau5", tip: "€14", hot: true },
    { title: "Opus — Four Tet Remix", artist: "Eric Prydz", tip: "€12" },
    { title: "Little Fluffy Clouds", artist: "The Orb", tip: "€6" },
    { title: "Los Niños del Parque", artist: "Liaisons", tip: "€9" },
  ];
  return (
    <div className="relative mt-6 rounded-2xl border border-[color:var(--color-hairline)] bg-black/30 p-4">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--color-bone)]/50">
        <span>Live queue · 00:42</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-amber)] animate-pulse" />
          24 waiting
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((it, i) => (
          <li
            key={it.title}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              it.hot
                ? "border-[color:var(--color-amber)]/40 bg-[color:var(--color-amber)]/10"
                : "border-[color:var(--color-hairline)] bg-white/[0.02]"
            }`}
          >
            <span className="font-mono text-[10px] text-[color:var(--color-mute)] w-4">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] truncate font-medium">{it.title}</div>
              <div className="text-[11px] text-[color:var(--color-mute)] truncate">
                {it.artist}
              </div>
            </div>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-medium border ${
                it.hot
                  ? "bg-[color:var(--color-amber)] text-[color:var(--color-ink)] border-[color:var(--color-amber)]"
                  : "bg-transparent text-[color:var(--color-bone)]/70 border-[color:var(--color-hairline-strong)]"
              }`}
            >
              {it.tip}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
