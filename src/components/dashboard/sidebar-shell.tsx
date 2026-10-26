"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/components/auth-provider";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function SidebarShell({
  navItems,
  children,
  badge,
}: {
  navItems: NavItem[];
  children: ReactNode;
  badge?: string;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (item: NavItem) => (item.exact ? pathname === item.href : pathname.startsWith(item.href));

  return (
    <div className="flex min-h-screen bg-[var(--surface)]" dir="rtl">
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 shrink-0 border-l border-ink-200/60 bg-[var(--surface-card)] p-5 transition-transform lg:static lg:translate-x-0 dark:border-white/10 ${
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo />
          <button className="lg:hidden" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {badge && (
          <span className="mt-4 inline-block rounded-full bg-brand-500/10 px-3 py-1 text-xs font-bold text-brand-600 dark:text-brand-300">
            {badge}
          </span>
        )}

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive(item)
                  ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                  : "text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/5"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-ink-200/60 p-4 dark:border-white/10">
          <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{user?.fullName}</p>
          <p className="truncate text-xs text-ink-400">{user?.email}</p>
          <button
            onClick={() => logout()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-200 py-2 text-xs font-bold text-ink-600 hover:border-rose-300 hover:text-rose-500 dark:border-white/10 dark:text-ink-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200/60 bg-[var(--surface-card)]/80 px-5 py-3.5 backdrop-blur lg:px-8 dark:border-white/10">
          <button className="grid h-10 w-10 place-items-center rounded-xl border border-ink-200 lg:hidden dark:border-white/10" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block" />
          <ThemeToggle />
        </header>
        <main className="px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
