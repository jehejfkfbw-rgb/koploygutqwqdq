import Link from "next/link";

export function Logo({ className = "", withText = true }: { className?: string; withText?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-brand-600 shadow-lg shadow-brand-500/30 transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5.5 w-5.5 text-ink-950"
          style={{ width: "1.4rem", height: "1.4rem" }}
        >
          <path
            d="M12 2c3.2 0 5.5 2.4 5.5 5.4 0 2.1-1.1 3.5-2.1 4.7-.8 1-1.4 1.7-1.4 2.7h-4c0-1-.6-1.7-1.4-2.7-1-1.2-2.1-2.6-2.1-4.7C6.5 4.4 8.8 2 12 2Z"
            fill="currentColor"
          />
          <path d="M9.2 17h5.6v1.3a1 1 0 0 1-1 1H10.2a1 1 0 0 1-1-1V17Z" fill="currentColor" />
          <path d="M10.4 21h3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-300/60 blur-xl animate-glow" />
      </span>
      {withText && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight text-ink-900 dark:text-white">نبراس</span>
          <span className="text-[11px] font-medium tracking-[0.2em] text-ink-400">NEBRAS</span>
        </span>
      )}
    </Link>
  );
}
