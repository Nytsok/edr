"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";

const items = [
  {
    q: "Do guests need to install an app?",
    a: "No. A guest scans a chip, wristband or poster and is in the experience in under three seconds. No downloads, no account creation on the dancefloor.",
  },
  {
    q: "How do tips reach the artist?",
    a: "Tips are paid directly via Apple Pay, Google Pay or Link. Splits with the venue are configurable and fully transparent. Settlement happens within 48 hours.",
  },
  {
    q: "Does the DJ have to use everything I request?",
    a: "Absolutely not. Requests are signals, not obligations. The DJ sees them ranked by the room's energy and can respect, postpone or ignore — always their set, always their call.",
  },
  {
    q: "What about venues without reliable internet?",
    a: "TuneTip is offline-first. Every interaction queues locally and syncs the moment connectivity returns. The basement stays sacred.",
  },
  {
    q: "What data do you keep?",
    a: "The minimum. We never sell audience data. Venue analytics are aggregated and anonymised by default — individual profiles stay with the individual.",
  },
  {
    q: "Which cities are live today?",
    a: "We're onboarding venues in Paris, Brussels, Berlin, Amsterdam and Barcelona first, with London and New York opening in the next wave.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="relative py-28 md:py-36">
      <div className="shell">
        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          <Reveal className="md:col-span-4 md:sticky md:top-32 md:self-start">
            <Eyebrow>Questions</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4vw,3rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
              Answered,
              <br />
              <span className="font-display italic text-[color:var(--color-bone)]/75">
                without the noise.
              </span>
            </h2>
            <p className="mt-5 text-[color:var(--color-bone)]/60 leading-relaxed max-w-sm">
              Something we missed?{" "}
              <a
                href="mailto:hello@tunetip.app"
                className="link-hover text-[color:var(--color-bone)]"
              >
                hello@tunetip.app
              </a>
            </p>
          </Reveal>

          <div className="md:col-span-8">
            <ul className="border-t border-[color:var(--color-hairline)]">
              {items.map((it, i) => {
                const isOpen = open === i;
                return (
                  <li
                    key={it.q}
                    className="border-b border-[color:var(--color-hairline)]"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="text-lg md:text-xl tracking-[-0.01em] text-[color:var(--color-bone)] font-medium">
                        {it.q}
                      </span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[color:var(--color-hairline-strong)] transition-transform duration-500 ${
                          isOpen ? "rotate-45 bg-white/5" : ""
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="pb-7 pr-14 text-[color:var(--color-bone)]/65 leading-relaxed">
                            {it.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
