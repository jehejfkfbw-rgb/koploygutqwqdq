import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--surface)] px-6 py-16" dir="rtl">
      <div className="w-full max-w-lg rounded-3xl border border-ink-200/60 bg-[var(--surface-card)] p-10 text-center shadow-2xl shadow-ink-900/10 dark:border-white/10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-extrabold text-ink-900 dark:text-white">404</h1>
        <p className="mt-3 text-sm leading-7 text-ink-500 dark:text-ink-300">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها. دعنا نعيدك إلى بر الأمان.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-xl bg-ink-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-ink-800 dark:bg-brand-500 dark:text-ink-950 dark:hover:bg-brand-400"
        >
          العودة للصفحة الرئيسية
        </Link>
      </div>
    </main>
  );
}
