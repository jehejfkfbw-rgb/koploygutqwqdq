"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[Nebras] Unhandled application error:", error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--surface)] px-6 py-16" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] p-10 text-center shadow-2xl shadow-ink-900/10 dark:border-white/10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-ink-900 dark:text-white">حدث خطأ غير متوقع</h1>
        <p className="mt-3 text-sm leading-7 text-ink-500 dark:text-ink-300">
          نعتذر عن هذا الإزعاج. حدث خلل مؤقت أثناء تحميل الصفحة، فريق نبراس يعمل دائماً على ضمان استقرار المنصة. حاول
          مرة أخرى، وإن استمرت المشكلة الرجاء العودة للصفحة الرئيسية.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-800 dark:bg-brand-500 dark:text-ink-950 dark:hover:bg-brand-400"
          >
            <RefreshCcw className="h-4 w-4" />
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-ink-200 px-6 py-3 text-sm font-bold text-ink-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/15 dark:text-ink-100"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
