"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const roles = [
  { v: "dj", label: "I'm a DJ" },
  { v: "venue", label: "I run a venue" },
  { v: "fan", label: "I go out" },
] as const;

type Role = (typeof roles)[number]["v"];

export function Waitlist() {
  const [role, setRole] = useState<Role>("dj");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative py-28 md:py-36 overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(600px 400px at 50% 50%, rgba(242,120,75,0.12) 0%, transparent 70%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />

      <div className="shell">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2.2rem,6vw,4.4rem)] font-medium tracking-[-0.035em] leading-[1] text-balance">
            Step on the floor
            <br />
            <span className="font-display italic text-[color:var(--color-amber-2)]">
              before the doors open.
            </span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[color:var(--color-bone)]/70 leading-relaxed text-pretty max-w-xl mx-auto">
            Early access opens in waves. Tell us which floor you&rsquo;re on —
            we&rsquo;ll reach out when your city is live.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mx-auto mt-10 max-w-xl">
          <div className="flex flex-wrap justify-center gap-2 mb-5">
            {roles.map((r) => (
              <button
                key={r.v}
                type="button"
                onClick={() => setRole(r.v)}
                className={`rounded-full px-4 py-1.5 text-sm transition-all duration-300 border ${
                  role === r.v
                    ? "bg-[color:var(--color-bone)] text-[color:var(--color-ink)] border-[color:var(--color-bone)]"
                    : "bg-transparent text-[color:var(--color-bone)]/80 border-[color:var(--color-hairline-strong)] hover:border-white/30"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={onSubmit}
            className="relative flex flex-col sm:flex-row gap-2 p-2 rounded-full border border-[color:var(--color-hairline-strong)] bg-[color:var(--color-ink-2)]/60 backdrop-blur-xl"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@label.com"
              aria-label="Email address"
              className="flex-1 bg-transparent px-5 py-3 text-[15px] placeholder:text-[color:var(--color-bone)]/35 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--color-bone)] text-[color:var(--color-ink)] px-6 py-3 text-[15px] font-medium hover:bg-white transition-all duration-300 shadow-[0_10px_30px_-10px_rgba(255,255,255,0.25)] disabled:opacity-80"
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" /> You&rsquo;re in
                </>
              ) : (
                <>
                  Request access
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center text-[color:var(--color-bone)]/60 text-sm"
            >
              Thanks — we&rsquo;ll reach out when your city goes live.
            </motion.p>
          )}
          <p className="mt-4 text-center text-xs font-mono tracking-[0.18em] uppercase text-[color:var(--color-bone)]/40">
            No spam. No noise. Just one email when it matters.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
