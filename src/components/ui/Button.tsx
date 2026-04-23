import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform";

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.95rem]",
  lg: "h-13 px-7 text-base md:h-14 md:px-8",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-bone)] text-[color:var(--color-ink)] hover:bg-white hover:-translate-y-[1px] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.25)]",
  ghost:
    "border border-[color:var(--color-hairline-strong)] text-[color:var(--color-bone)] hover:bg-white/5 hover:border-white/25",
  quiet:
    "text-[color:var(--color-bone)]/80 hover:text-[color:var(--color-bone)]",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  const cls = cn(base, sizes[size], variants[variant], className);
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
