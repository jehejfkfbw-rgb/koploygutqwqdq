"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/courses", label: "الدورات" },
  { href: "/#about", label: "عن نبراس" },
  { href: "/#contact", label: "تواصل معنا" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/50 bg-white/75 backdrop-blur-xl dark:border-white/10 dark:bg-ink-950/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                pathname === link.href
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                  : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {!isLoading && !user && (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-ink-700 transition hover:text-brand-600 dark:text-ink-100"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/signup"
                className="rounded-xl bg-gradient-to-l from-brand-500 to-brand-400 px-5 py-2.5 text-sm font-extrabold text-ink-950 shadow-lg shadow-brand-500/30 transition hover:shadow-brand-500/50"
              >
                ابدأ مجاناً
              </Link>
            </>
          )}
          {!isLoading && user && (
            <>
              <Link
                href={user.role === "admin" ? "/admin" : "/dashboard"}
                className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-ink-800 dark:bg-white/10 dark:hover:bg-white/20"
              >
                {user.role === "admin" ? <ShieldCheck className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                {user.role === "admin" ? "لوحة الإدارة" : "لوحتي"}
              </Link>
              <button
                onClick={() => logout()}
                aria-label="تسجيل الخروج"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 text-ink-500 transition hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:text-ink-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 text-ink-700 lg:hidden dark:border-white/10 dark:text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-200/50 bg-white px-5 py-4 lg:hidden dark:border-white/10 dark:bg-ink-950">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between gap-2 border-t border-ink-100 pt-4 dark:border-white/10">
              <ThemeToggle />
              <div className="flex flex-1 gap-2">
                {!user ? (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl border border-ink-200 py-2.5 text-center text-sm font-bold text-ink-700 dark:border-white/10 dark:text-white"
                    >
                      دخول
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setOpen(false)}
                      className="flex-1 rounded-xl bg-brand-500 py-2.5 text-center text-sm font-extrabold text-ink-950"
                    >
                      إنشاء حساب
                    </Link>
                  </>
                ) : (
                  <Link
                    href={user.role === "admin" ? "/admin" : "/dashboard"}
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl bg-ink-900 py-2.5 text-center text-sm font-bold text-white dark:bg-white/10"
                  >
                    {user.role === "admin" ? "لوحة الإدارة" : "لوحتي"}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
