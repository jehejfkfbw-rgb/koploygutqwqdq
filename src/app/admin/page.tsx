import Link from "next/link";
import { BookOpen, GraduationCap, ShieldCheck, Users } from "lucide-react";
import { db } from "@/db";
import { courses, enrollments, users } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [allUsers, allCourses, allEnrollments] = await Promise.all([
    db.select().from(users).orderBy(desc(users.createdAt)),
    db.select().from(courses).orderBy(desc(courses.createdAt)),
    db.select().from(enrollments),
  ]);

  const admins = allUsers.filter((u) => u.role === "admin").length;
  const students = allUsers.length - admins;

  const stats = [
    { label: "إجمالي المستخدمين", value: allUsers.length, icon: Users },
    { label: "الطلاب", value: students, icon: GraduationCap },
    { label: "الدورات", value: allCourses.length, icon: BookOpen },
    { label: "إجمالي التسجيلات", value: allEnrollments.length, icon: ShieldCheck },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">نظرة عامة على المنصة</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">إدارة شاملة لمنصة نبراس التعليمية</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-5 dark:border-white/10">
            <stat.icon className="h-6 w-6 text-brand-500" />
            <p className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-ink-500 dark:text-ink-300">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-6 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink-900 dark:text-white">أحدث المستخدمين</h2>
            <Link href="/admin/users" className="text-xs font-bold text-brand-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ink-100 dark:divide-white/5">
            {allUsers.slice(0, 5).map((u) => (
              <li key={u.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">{u.fullName}</p>
                  <p className="text-xs text-ink-400">{u.email}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    u.role === "admin"
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-300"
                      : "bg-ink-100 text-ink-500 dark:bg-white/5 dark:text-ink-300"
                  }`}
                >
                  {u.role === "admin" ? "مشرف" : "طالب"}
                </span>
              </li>
            ))}
            {allUsers.length === 0 && <p className="py-4 text-sm text-ink-400">لا يوجد مستخدمون بعد.</p>}
          </ul>
        </div>

        <div className="rounded-2xl border border-ink-200/60 bg-[var(--surface-card)] p-6 dark:border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-ink-900 dark:text-white">أحدث الدورات</h2>
            <Link href="/admin/courses" className="text-xs font-bold text-brand-600 hover:underline">
              عرض الكل
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-ink-100 dark:divide-white/5">
            {allCourses.slice(0, 5).map((c) => (
              <li key={c.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-semibold text-ink-900 dark:text-white">{c.title}</p>
                  <p className="text-xs text-ink-400">{c.category}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    c.isPublished
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : "bg-ink-100 text-ink-500 dark:bg-white/5 dark:text-ink-300"
                  }`}
                >
                  {c.isPublished ? "منشورة" : "مسودة"}
                </span>
              </li>
            ))}
            {allCourses.length === 0 && <p className="py-4 text-sm text-ink-400">لا توجد دورات بعد.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
