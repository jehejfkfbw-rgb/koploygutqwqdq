"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="تبديل المظهر"
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-200/60 bg-white/70 text-ink-700 transition hover:border-brand-400 hover:text-brand-500 dark:border-white/10 dark:bg-white/5 dark:text-ink-100 dark:hover:text-brand-300 ${className}`}
    >
      {mounted && isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
