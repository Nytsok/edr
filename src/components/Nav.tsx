"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "#experience", label: "Experience" },
  { href: "#djs", label: "For DJs" },
  { href: "#venues", label: "For Venues" },
  { href: "#how", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <div className="shell">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 md:px-5 transition-all duration-500",
            scrolled
              ? "backdrop-blur-xl bg-[color:var(--color-ink-2)]/70 border border-[color:var(--color-hairline)] h-12"
              : "bg-transparent h-14"
          )}
        >
          <Link
            href="/"
            className="flex items-center gap-2 font-medium tracking-tight text-bone"
            aria-label="TuneTip home"
          >
            <Logo />
            <span className="text-[15px]">TuneTip</span>
          </Link>

          <ul className="hidden md:flex items-center gap-7 text-sm text-[color:var(--color-bone)]/70">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  className="link-hover transition-colors hover:text-[color:var(--color-bone)]"
                  href={l.href}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <Button href="#waitlist" variant="ghost" size="sm">
              Sign in
            </Button>
            <Button href="#waitlist" size="sm">
              Join the waitlist
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative h-10 w-10 grid place-items-center rounded-full border border-[color:var(--color-hairline)]"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={cn(
                "absolute h-px w-5 bg-bone transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-1"
              )}
            />
            <span
              className={cn(
                "absolute h-px w-5 bg-bone transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-1"
              )}
            />
          </button>
        </nav>

        <div
          className={cn(
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            open ? "max-h-96 opacity-100 mt-2" : "max-h-0 opacity-0"
          )}
        >
          <div className="rounded-3xl border border-[color:var(--color-hairline)] bg-[color:var(--color-ink-2)]/90 backdrop-blur-xl p-4">
            <ul className="flex flex-col gap-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2 text-[color:var(--color-bone)]/80 hover:bg-white/5"
                    href={l.href}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              <Button href="#waitlist" variant="ghost" size="sm" className="flex-1">
                Sign in
              </Button>
              <Button href="#waitlist" size="sm" className="flex-1">
                Join waitlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span
      aria-hidden
      className="relative inline-block h-6 w-6 rounded-md bg-gradient-to-br from-[color:var(--color-amber)] to-[color:var(--color-amber-2)]"
    >
      <span className="absolute inset-[5px] rounded-sm bg-[color:var(--color-ink)]" />
      <span className="absolute left-1/2 top-[9px] h-[6px] w-[2px] -translate-x-1/2 rounded-full bg-[color:var(--color-amber-2)]" />
      <span className="absolute left-[9px] top-[7px] h-[10px] w-[2px] rounded-full bg-[color:var(--color-amber-2)]" />
      <span className="absolute right-[9px] top-[11px] h-[6px] w-[2px] rounded-full bg-[color:var(--color-amber-2)]" />
    </span>
  );
}
