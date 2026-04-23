"use client";

import { motion, useReducedMotion } from "motion/react";
import { Music3, Heart, ArrowUpRight } from "lucide-react";

/**
 * HeroCanvas — the product visual for the hero.
 * A layered composition: phone showing live queue + a floating "tip" card
 * + a venue silhouette in the background. Built entirely in CSS/SVG so
 * it is lightweight, crisp at any resolution, and accessible.
 */
export function HeroCanvas() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mx-auto w-full max-w-[1040px] aspect-[16/11] md:aspect-[16/10]">
      {/* ambient background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 blur-3xl opacity-80"
        style={{
          background:
            "radial-gradient(50% 50% at 30% 40%, rgba(242,120,75,0.22) 0%, transparent 70%), radial-gradient(40% 60% at 75% 60%, rgba(140,123,255,0.18) 0%, transparent 70%)",
        }}
      />

      {/* subtle grid */}
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-[0.35]" />

      {/* Venue silhouette — abstract crowd bars */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[42%] flex items-end gap-[3px] md:gap-[5px] px-4 opacity-40"
      >
        {Array.from({ length: 80 }).map((_, i) => {
          const h = 20 + ((i * 37) % 70);
          return (
            <span
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-[color:var(--color-amber)]/50 via-[color:var(--color-amber)]/10 to-transparent"
              style={{ height: `${h}%` }}
            />
          );
        })}
      </div>

      {/* Pulse rings behind the phone (beacon of the live moment) */}
      {!reduce && (
        <>
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-amber)]/40 pulse-ring"
            style={{ animationDelay: "0s" }}
          />
          <span
            aria-hidden
            className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--color-amber)]/30 pulse-ring"
            style={{ animationDelay: "1.3s" }}
          />
        </>
      )}

      {/* Phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute left-1/2 top-1/2 w-[280px] md:w-[320px] -translate-x-1/2 -translate-y-1/2"
        style={{ perspective: "1200px" }}
      >
        <div className="relative rounded-[42px] p-[1px] bg-gradient-to-b from-white/15 to-white/0 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9),0_10px_40px_-10px_rgba(242,120,75,0.3)]">
          <div className="rounded-[40px] bg-[color:var(--color-ink-2)] border border-[color:var(--color-hairline)] overflow-hidden">
            {/* Notch */}
            <div className="relative h-8 flex items-center justify-center">
              <span className="h-4 w-24 rounded-full bg-black/90 border border-white/5" />
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between px-5 -mt-2 text-[10px] text-[color:var(--color-bone)]/60 font-mono">
              <span>9:41</span>
              <span className="tracking-widest">LIVE</span>
            </div>

            {/* Live marquee */}
            <div className="mx-5 mt-3 rounded-2xl border border-[color:var(--color-hairline)] bg-black/30 px-3 py-2.5 flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-amber)] opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--color-amber)]" />
              </span>
              <div className="text-[11px] leading-tight">
                <div className="text-[color:var(--color-bone)] font-medium">
                  Tonight · Le Belvédère
                </div>
                <div className="text-[color:var(--color-mute)]">
                  DJ Solenne — Deep house set
                </div>
              </div>
            </div>

            {/* Now playing */}
            <div className="mx-5 mt-3 rounded-2xl p-3 bg-gradient-to-br from-[color:var(--color-amber)]/25 to-[color:var(--color-violet)]/20 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[color:var(--color-amber)] to-[color:var(--color-amber-2)] grid place-items-center text-[color:var(--color-ink)]">
                  <Music3 className="h-5 w-5" strokeWidth={2.25} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] uppercase tracking-widest text-[color:var(--color-bone)]/60">
                    Now playing
                  </div>
                  <div className="text-[13px] font-medium truncate text-[color:var(--color-bone)]">
                    Midnight in Montmartre
                  </div>
                  <div className="text-[11px] text-[color:var(--color-mute)] truncate">
                    Louis Vitale — Extended mix
                  </div>
                </div>
                <div className="flex items-end gap-[2px] h-6">
                  {[0, 0.15, 0.35, 0.55, 0.25, 0.4].map((d, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-[color:var(--color-amber)] eq-bar"
                      style={{ animationDelay: `${d}s`, height: "100%" }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Queue header */}
            <div className="mx-5 mt-4 flex items-baseline justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[color:var(--color-bone)]/60">
                Crowd queue
              </span>
              <span className="text-[11px] font-mono text-[color:var(--color-mute)]">
                24 requests
              </span>
            </div>

            {/* Queue items */}
            <ul className="mx-5 mt-2 space-y-2 pb-5">
              {queue.map((q, i) => (
                <motion.li
                  key={q.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.8 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex items-center gap-3 rounded-xl border border-[color:var(--color-hairline)] bg-white/[0.02] px-3 py-2.5"
                >
                  <span className="font-mono text-[10px] text-[color:var(--color-mute)] w-4">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-[color:var(--color-bone)] truncate font-medium">
                      {q.title}
                    </div>
                    <div className="text-[10.5px] text-[color:var(--color-mute)] truncate">
                      {q.artist}
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-amber)]/12 text-[color:var(--color-amber)] px-2 py-0.5 text-[10.5px] font-medium border border-[color:var(--color-amber)]/25">
                    <Heart className="h-3 w-3" strokeWidth={2.5} />
                    {q.tip}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Floating tip card */}
      <motion.div
        initial={{ opacity: 0, x: 40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.1 }}
        className="absolute right-2 top-[22%] w-[200px] md:w-[230px] rounded-2xl p-4 bg-[color:var(--color-ink-3)]/80 backdrop-blur-xl border border-[color:var(--color-hairline-strong)] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[color:var(--color-bone)]/60 font-mono">
            Tip sent
          </span>
          <ArrowUpRight className="h-4 w-4 text-[color:var(--color-amber)]" />
        </div>
        <div className="mt-2 font-display text-3xl">€8</div>
        <div className="text-xs text-[color:var(--color-mute)] mt-1">
          to DJ Solenne
          <br />
          with <span className="text-[color:var(--color-bone)]">“one more
          track for table 4”</span>
        </div>
        <div className="mt-3 h-1 rounded-full overflow-hidden bg-white/5">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-amber)] to-[color:var(--color-amber-2)]"
          />
        </div>
      </motion.div>

      {/* Floating "request received" toast */}
      <motion.div
        initial={{ opacity: 0, x: -40, y: -20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 1.35 }}
        className="absolute left-2 top-[55%] w-[210px] md:w-[240px] rounded-2xl p-3.5 bg-[color:var(--color-ink-3)]/80 backdrop-blur-xl border border-[color:var(--color-hairline-strong)] shadow-[0_25px_60px_-20px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--color-cyan)]" />
          <span className="text-[10px] uppercase tracking-widest text-[color:var(--color-bone)]/60 font-mono">
            Request queued
          </span>
        </div>
        <div className="mt-1.5 text-[13px] text-[color:var(--color-bone)] font-medium leading-tight">
          “Strobe” by Deadmau5
        </div>
        <div className="text-[11px] text-[color:var(--color-mute)] mt-0.5">
          Requested by Ana · 17s ago
        </div>
      </motion.div>
    </div>
  );
}

const queue = [
  { title: "Opus — Four Tet Remix", artist: "Eric Prydz", tip: "€12" },
  { title: "Little Fluffy Clouds", artist: "The Orb", tip: "€6" },
  { title: "Los Niños del Parque", artist: "Liaisons Dangereuses", tip: "€9" },
  { title: "Windowlicker", artist: "Aphex Twin", tip: "€4" },
];
