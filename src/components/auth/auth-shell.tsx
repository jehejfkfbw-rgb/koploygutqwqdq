import type { ReactNode } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/logo";

const perks = [
  "دورات احترافية في مختلف المجالات",
  "لوحة تحكم ذكية لمتابعة تقدمك",
  "محتوى عربي 100% بمعايير عالمية",
  "شهادات إتمام معتمدة",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2" dir="rtl">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-ink-800 p-12 text-white lg:flex">
        <div className="bg-grid pointer-events-none absolute inset-0 text-white/30 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-500/30 blur-[100px]" />
        <Logo />
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-extrabold leading-tight text-balance">
            منصة نبراس تضيء طريقك نحو التعلّم والتميز
          </h2>
          <p className="mt-4 leading-7 text-ink-200">
            انضم إلى آلاف الطلاب الذين يبنون مستقبلهم عبر دورات احترافية ومحتوى تعليمي عالي الجودة.
          </p>
          <ul className="mt-8 space-y-3">
            {perks.map((perk) => (
              <li key={perk} className="flex items-center gap-3 text-sm text-ink-100">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-300" />
                {perk}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 text-xs text-ink-400">© {new Date().getFullYear()} نبراس Nebras</p>
      </div>

      <div className="flex items-center justify-center bg-[var(--surface)] px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">{title}</h1>
          <p className="mt-2 text-sm text-ink-500 dark:text-ink-300">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-6 text-center text-sm text-ink-500 dark:text-ink-300">{footer}</div>

          <p className="mt-10 text-center text-xs text-ink-400">
            بالمتابعة، أنت توافق على{" "}
            <Link href="#" className="font-semibold text-brand-600 hover:underline">
              شروط الاستخدام
            </Link>{" "}
            و{" "}
            <Link href="#" className="font-semibold text-brand-600 hover:underline">
              سياسة الخصوصية
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
