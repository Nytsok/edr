"use client";

import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroCanvas } from "@/components/HeroCanvas";

export function Hero() {
  return (
    <section className="relative pt-36 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="noise" aria-hidden />
      <div className="shell relative">
        <div className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/60 backdrop-blur px-3 py-1.5 text-xs text-[color:var(--color-bone)]/80"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-amber)] animate-pulse" />
            Now rolling out to select venues across Europe
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 1,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 text-[clamp(2.5rem,7vw,5.5rem)] font-medium tracking-[-0.035em] leading-[0.95] text-balance"
          >
            The live music experience,
            <br />
            <span className="font-display italic text-[color:var(--color-amber-2)]">
              amplified.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-[color:var(--color-bone)]/70 leading-relaxed text-pretty"
          >
            TuneTip turns every set into a two-way conversation. Request a
            song, tip the artist, feel the room move — all through one
            beautifully quiet app.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button href="#waitlist" size="lg">
              Join the waitlist
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
            <Button href="#experience" variant="ghost" size="lg">
              See it in motion
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-5 text-xs font-mono tracking-widest uppercase text-[color:var(--color-bone)]/45"
          >
            iOS · Android · Venue console
          </motion.p>
        </div>

        <div className="mt-14 md:mt-20">
          <HeroCanvas />
        </div>
      </div>

      {/* Logos marquee */}
      <div className="mt-16 md:mt-24 border-t border-b border-[color:var(--color-hairline)]">
        <div className="shell py-6">
          <p className="text-center text-xs font-mono tracking-[0.22em] uppercase text-[color:var(--color-bone)]/50 mb-5">
            Already moving nights at
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-14 animate-marquee whitespace-nowrap">
              {[...VENUES, ...VENUES].map((v, i) => (
                <span
                  key={i}
                  className="text-[color:var(--color-bone)]/60 text-lg md:text-xl tracking-tight font-display italic"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const VENUES = [
  "Le Belvédère",
  "Concrete Paris",
  "Fabric London",
  "Fuse Brussels",
  "Shelter Amsterdam",
  "Watergate Berlin",
  "Nitsa Barcelona",
  "Hï Ibiza",
];
