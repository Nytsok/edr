"use client";

import { motion } from "motion/react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const metrics = [
  { v: "0", unit: "ads", k: "No noise, ever. Not in the app. Not on the night." },
  { v: "<3s", unit: "", k: "From scan to first interaction — no onboarding tax." },
  { v: "2.4×", unit: "", k: "More tips flowing through the room vs. manual tipping." },
  { v: "48h", unit: "", k: "Fast settlement to artists. Transparent splits for venues." },
];

export function Differentiation() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="shell">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="md:col-span-5">
            <Reveal>
              <Eyebrow>Why TuneTip</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4vw,3.2rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
                Built from the floor up.
              </h2>
              <p className="mt-6 text-[color:var(--color-bone)]/65 leading-relaxed max-w-md">
                We have spent years behind booths and behind bars. TuneTip is
                the tool we always wanted — precise, respectful, and wired into
                the emotional tempo of a live set rather than a checkout
                screen.
              </p>
              <ul className="mt-8 space-y-3 text-[color:var(--color-bone)]/75">
                {[
                  "No ads. No distractions. Ever.",
                  "Designed with working DJs and club programmers.",
                  "Venue-first revenue model. Artists keep their cut.",
                  "Private by design. No resale of audience data.",
                ].map((li) => (
                  <li key={li} className="flex items-start gap-3">
                    <span
                      className="mt-[9px] h-px w-4 bg-[color:var(--color-amber)]"
                      aria-hidden
                    />
                    <span>{li}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="md:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:gap-5">
              {metrics.map((m, i) => (
                <motion.div
                  key={m.k}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative overflow-hidden rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 p-6 md:p-8 aspect-[5/4] md:aspect-auto md:min-h-[220px] flex flex-col justify-between"
                >
                  <div
                    aria-hidden
                    className="absolute -top-20 -right-10 h-40 w-40 rounded-full bg-[color:var(--color-amber)]/10 blur-3xl"
                  />
                  <div className="relative">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-none text-[color:var(--color-bone)]">
                        {m.v}
                      </span>
                      {m.unit && (
                        <span className="text-lg text-[color:var(--color-bone)]/50">
                          {m.unit}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="relative text-[color:var(--color-bone)]/65 text-sm leading-relaxed">
                    {m.k}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
