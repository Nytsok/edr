export function Footer() {
  return (
    <footer className="relative pt-24 pb-10 hairline-t">
      <div className="shell">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="relative inline-block h-6 w-6 rounded-md bg-gradient-to-br from-[color:var(--color-amber)] to-[color:var(--color-amber-2)]"
              >
                <span className="absolute inset-[5px] rounded-sm bg-[color:var(--color-ink)]" />
              </span>
              <span className="text-[15px] font-medium">TuneTip</span>
            </div>
            <p className="mt-5 text-[color:var(--color-bone)]/60 leading-relaxed max-w-sm">
              A live music layer for DJs, venues, and the audiences that move
              them. Crafted in Paris. Heard everywhere.
            </p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[color:var(--color-bone)]/45">
                {g.title}
              </div>
              <ul className="mt-4 space-y-2.5 text-[color:var(--color-bone)]/75">
                {g.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="link-hover hover:text-[color:var(--color-bone)]">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-6 border-t border-[color:var(--color-hairline)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[color:var(--color-bone)]/50">
          <span>© {new Date().getFullYear()} TuneTip — All rights reserved.</span>
          <span className="font-mono tracking-widest uppercase">
            Made with late nights, in Paris.
          </span>
        </div>
      </div>
    </footer>
  );
}

const groups = [
  { title: "Product", links: ["How it works", "For DJs", "For venues", "Changelog"] },
  { title: "Company", links: ["Story", "Press kit", "Contact", "Careers"] },
  { title: "Legal", links: ["Privacy", "Terms", "Security", "Imprint"] },
];
