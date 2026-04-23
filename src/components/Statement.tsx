import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Statement() {
  return (
    <section className="relative py-28 md:py-40">
      <div className="shell">
        <Reveal className="max-w-4xl mx-auto text-center">
          <Eyebrow>What TuneTip is</Eyebrow>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.8rem)] font-medium tracking-[-0.03em] leading-[1.05] text-balance">
            A quiet layer over the loudest moments —
            <span className="text-[color:var(--color-bone)]/50">
              {" "}
              designed so the room, not the app, stays the centre of the night.
            </span>
          </h2>
          <p className="mt-8 text-base md:text-lg text-[color:var(--color-bone)]/60 max-w-2xl mx-auto leading-relaxed text-pretty">
            One interface for DJs, venues and audiences. No accounts to create
            on the dancefloor. No QR code fatigue. Just a gesture, a song, a
            tip — and the set keeps breathing.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
