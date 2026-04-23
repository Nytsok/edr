import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  className,
  tone = "amber",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "amber" | "bone" | "violet";
}) {
  const tones: Record<string, string> = {
    amber: "text-[color:var(--color-amber)]",
    bone: "text-[color:var(--color-bone)]/70",
    violet: "text-[color:var(--color-violet)]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em]",
        tones[tone],
        className
      )}
    >
      <span className="inline-block h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
